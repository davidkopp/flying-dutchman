/*
 * File: StaffDashboardController.js
 *
 * The controller for the staff dashboard.
 *
 * Author: David Kopp
 */
/* globals LanguageController, OrderController, InventoryController, UNDOmanager */

(function ($, exports) {
    let barInventoryController = new InventoryController(
        Constants.INVENTORIES.BAR
    );
    let vipInventoryController = new InventoryController(
        Constants.INVENTORIES.VIP
    );

    let undoManagers = {};

    $(document).ready(function () {
        initOrdersList();
        initInventoryOverview();

        addEventHandlers();
    });

    /** Add event handlers to all buttons. */
    function addEventHandlers() {
        $("#create-order-button").click(function () {
            // Clear form values.
            $("#create-order-form")
                .find(
                    "input[type=text], input[type=number], input[type=textarea]"
                )
                .val("");
            $("#added-items-list").empty();
            // The bar inventory radio box should be set to checked as the default.
            $("#create-order-form")
                .find("input[value=barInventory]")
                .prop("checked", true);

            // Show only one item input field
            const addItemBoxes = $(
                "#create-order-items-inner-container"
            ).children();
            $(addItemBoxes).each(function (index, element) {
                if (index > 0) {
                    element.remove();
                }
            });

            // Finally show overlay
            $("#overlay-create-order").show();
        });

        $("#add-more-items-button").click(function () {
            $(this).parent().find("input[name=addItem]").val();
            $(".add-item")
                .first()
                .clone()
                .appendTo("#create-order-items-inner-container")
                .find("input")
                .val("");
        });

        $("#create-order-form").on("submit", handleCreateOrder);

        $(".overlay-close-button").click(function () {
            // Hide the overlay div this close button belongs to.
            $(this).parent().closest(".overlay").hide();
            deactivateOverlayEventHandlers();
        });

        // Enable closing an overlay by clicking somewhere outside of the centered overlay content.
        $(document).mouseup(function (e) {
            var container = $(".overlay-content");

            // If the target of the click event isn't the container (overlay content) nor a descendant of the container, hide all overlays (=close).
            if (
                !container.is(e.target) &&
                container.has(e.target).length === 0
            ) {
                $(".overlay").hide();
                deactivateOverlayEventHandlers();
            }
        });

        $("#notify-security-button").click(function () {
            // When enter is pressed (not together with shift key), send out the notification
            $(document).on("keypress", function (e) {
                if (e.which == 13 && !e.shiftKey) {
                    e.preventDefault();
                    $("#security-notifier-form").submit();
                }
            });

            $("#overlay-security-notifier").show();
        });

        $("#security-notifier-form").submit(function (event) {
            event.preventDefault();
            const data = getFormData("security-notifier-form");

            const optMessage = data.message;
            console.log(
                "Notify security!" +
                    (optMessage ? ` Message: '${optMessage}'` : "")
            );

            $("#overlay-security-notifier").hide();
            $("#security-notifier-form").find("textarea").val("");
            deactivateOverlayEventHandlers();
        });

        $("#vip-account-balance-button").click(function () {
            $("#overlay-vip-account-balances").show();
        });

        $("#vip-account-name").keypress(function (e) {
            if (e.which == 13) {
                handleSearchForUserAndDisplayInfo();
            }
        });

        $("#search-vip-account-name").click(function () {
            handleSearchForUserAndDisplayInfo();
        });

        // Event handlers for the single and split bill buttons
        $("#bill-type-single").click(function () {
            $("#single-payment").show();
            $("#split-payment").hide();
        });
        $("#bill-type-split").click(function () {
            $("#single-payment").hide();
            $("#split-payment").show();
        });
        $("#finalize-split-number").click(handleInitSplitBill);
        $("#single-payment-button").click(handleSinglePayment);
    }

    /** Deactivate specific event handlers that were set while the overlay was opened... */
    function deactivateOverlayEventHandlers() {
        $(document).unbind("keypress");
    }

    /**
     * Searches for a vip account, displays user info and provide the
     * functionality to change the account balance.
     */
    function handleSearchForUserAndDisplayInfo() {
        // First remove the lastest search results.
        $(".added-row-for-search").remove();

        const search = $("#vip-account-name").val().trim();
        if (!search) {
            return;
        }

        let foundUsers = DatabaseAPI.Users.searchForUsers(search);
        if (foundUsers.length == 0) {
            console.log(`No user found for search '${search}'.`);
            return;
        }

        let htmlTableRows = "";
        let countVIPUsers = 0;
        for (let i = 0; i < foundUsers.length; i++) {
            const user = foundUsers[i];
            if (user.credentials != Constants.ACCESS_LEVEL_VIP) {
                continue;
            }
            countVIPUsers++;
            const creditSEK = DatabaseAPI.Users.getBalanceByUserId(
                user.user_id
            );

            htmlTableRows += `
                            <tr class="added-row-for-search">
                            <td>${user.username}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>
                                <span id="balance-amount-user-${user.user_id}">${creditSEK}</span>
                                <span>SEK</span>
                            </td>
                            <td>
                    <input type="number" class="change-balance-amount" id="change-balance-amount-user-${user.user_id}" />

                </td>
                <td><button class="change-vip-account-balance-amount-button" data-lang="change-vip-account-balance-amount-button" data-user-id=${user.user_id} data-username=${user.username}>
                </button></td>
                            </tr>`;
        }

        if (countVIPUsers == 0) {
            console.log(`No vip user account found for search '${search}'.`);
        } else {
            $("#found-vip-accounts-table").append(htmlTableRows);

            // Add event handler to the added change buttons
            $(".change-vip-account-balance-amount-button").click(
                handleChangeAccountBalanceOfUser
            );

            // Refresh all text strings
            LanguageController.refreshTextStrings();
        }
    }

    /** Event handler for changing the acount balance of a vip user. */
    function handleChangeAccountBalanceOfUser() {
        const userId = $(this).data("user-id");
        const username = $(this).data("username");

        const inputAddAmount = $(`#change-balance-amount-user-${userId}`).val();
        const addAmount = parseInt(inputAddAmount.trim());
        if (isNaN(addAmount)) {
            // TODO: Display error to user.
            console.log(
                `Provided value '${inputAddAmount}' is not a valid number!`
            );
            return;
        }

        const currentAmount = DatabaseAPI.Users.getBalanceByUserId(userId);
        const newAmount = currentAmount + addAmount;
        DatabaseAPI.Users.changeBalance(username, newAmount);

        // Update view
        const creditSEK = DatabaseAPI.Users.getBalanceByUserId(userId);
        $(`#balance-amount-user-${userId}`).text(creditSEK);
    }

    /** Initializes the order list in the view. */
    function initOrdersList() {
        const ordersSortedByTable =
            OrderController.getUndoneOrdersSortedByTable();

        // Add table with orders to the overview
        let tableOrdersListHTML = "";
        let numberOfOrders = 0;
        for (const table in ordersSortedByTable) {
            if (Object.hasOwnProperty.call(ordersSortedByTable, table)) {
                const orders = ordersSortedByTable[table];

                const ordersHtmlList = [];
                orders.forEach((order) => {
                    initUndoManagerForOrder(order);
                    let orderItemsHTML = "<ul>";
                    order.items.forEach((item) => {
                        const beverageNr = item.beverageNr;
                        const beverage =
                            DatabaseAPI.Beverages.findBeverageByNr(beverageNr);

                        orderItemsHTML += `
                        <li>
                            <span>${beverage.name}</span>
                        </li>
                        `;
                    });
                    orderItemsHTML += "</ul>";

                    ordersHtmlList.push(`
                    <div class="order-element" data-order-id="${order.id}">
                        <div class="order-element-header">
                            <div class="order-element-number">
                                <span data-lang="order-list-order-number"></span>
                                <span>${order.id}</span>
                            </div>
                            <div>
                                <span class="order-undo-button clickable hover-shine" data-lang="[title]undo-order-action-button-title">↩</span>
                                <span class="order-redo-button clickable hover-shine" data-lang="[title]redo-order-action-button-title">↪</span>
                            </div>
                        </div>
                        <div class="overview-element-row">
                            <div>
                                <span class="overview-list-column-heading" data-lang="order-list-items"></span>
                                <br/>
                                <span>${orderItemsHTML}</span>
                            </div>
                            <div>
                                <span class="overview-list-column-heading" data-lang="order-list-notes"></span>
                                <br/>
                                <textarea class="order-notes-text-field" rows="2" >${order.notes}</textarea>
                            </div>
                            <div>
                                <span class="overview-list-column-heading" data-lang="order-list-inventory"></span>
                                <br/>
                                <span ${Constants.DATA_LANG_DYNAMIC_KEY}="order-inventory-dynamic" ${Constants.DATA_LANG_DYNAMIC_VALUE}=${order.inventory}>...</span>
                            </div>
                            <div>
                                <span class="overview-list-column-heading" data-lang="order-list-actions"></span>
                                <br/>
                                <div>
                                    <span class="clickable order-list-pay-order-button order-action-button hover-shine"
                                        data-lang="[title]order-paid-button">💳</span>
                                    <span class="clickable order-list-edit-order-button order-action-button hover-shine"
                                        data-lang="[title]edit-order-button">📝</span>
                                    <span class="clickable order-list-delete-order-button order-action-button hover-shine"
                                        data-lang="[title]delete-order-button">❌</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
                });

                tableOrdersListHTML += `
                <div class="table-element">
                    <div class="order-table-number" data-table-nr="${table}">
                        <span data-lang="orders-overview-table-label"></span>
                        <span>${table}</span>
                        </div>
                    <div class="orders-container">
                        ${ordersHtmlList.join("\n")}
                    </div>
                </div>`;
                numberOfOrders += orders.length;
            }
        }
        $("#orders-list").html(tableOrdersListHTML);

        // Add event handler for the table number: Show details of all orders of a table.
        $(".order-table-number").click(function () {
            const table = $(this).data("table-nr");
            showOrderDetailsForTable(table);
        });

        // Add event handler for the notes input fields to be able to edit the value directly in the overview.
        $(".order-notes-text-field").blur(function (event) {
            saveInputAsNotesToOrder(event);
        });
        $(".order-notes-text-field").keypress(function (event) {
            // When the user has currently the focus on the input field and presses enter, it should lose the focus.
            if (event.which == 13) {
                $(this).blur();
            }
        });

        // Add an event handler for the pay buttons for the orders
        $(".order-list-pay-order-button").click(function () {
            // First save the order id in the payment overlay so other functions will be be able to execute operations for this order.
            const orderId = $(this).closest(".order-element").data("order-id");
            $("#payment").data("order-id", orderId);

            // Clear form values.
            $("#payment-split-value").val("");

            // The split single radio box should be set to checked as the default.
            $("#payment").find("input[value=Single]").prop("checked", true);

            // Finally show the overlay
            $("#overlay-payment").show();

            // Check if a bill already exists... If so, use the info.
            const order = OrderController.getOrderById(orderId);
            if (order.billId) {
                // There is already a bill! Use it...
                const bill = OrderController.getBillById(order.billId);
                if (bill.split) {
                    $("#payment")
                        .find("input[value=Split]")
                        .prop("checked", true);
                    handleInitSplitBill();
                } else {
                    handleSinglePayment();
                }
            }
        });

        // Add event handler for the edit buttons for the orders
        $(".order-list-edit-order-button").click(function () {
            const orderId = $(this).closest(".order-element").data("order-id");

            editOrder(orderId);
        });

        // Add event handler for the delete buttons for the orders
        $(".order-list-delete-order-button").click(function () {
            const orderId = $(this).closest(".order-element").data("order-id");

            deleteOrder(orderId);
        });

        // Add event handler for undo / redo buttons
        $(".order-undo-button").click(function () {
            const orderId = $(this).closest(".order-element").data("order-id");
            const undoManager = undoManagers[orderId];
            undoManager.undoit();

            // Refresh view
            initOrdersList();
        });

        // Add event handler for undo / redo buttons
        $(".order-redo-button").click(function () {
            const orderId = $(this).closest(".order-element").data("order-id");
            const undoManager = undoManagers[orderId];
            undoManager.redoit();

            // Refresh view
            initOrdersList();
        });

        // Add number of current orders to the footer of the overview
        $("#orders-list-total-number").html(numberOfOrders);

        LanguageController.refreshTextStrings();
    }

    /**
     * Initializes the undo manager for a specific order. Purpose is to be able
     * to undo and redo actions made one this specific order. If an undo manager
     * already exists for this order, it will be reused.
     *
     * @param {object} order The order object.
     */
    function initUndoManagerForOrder(order) {
        if (!Object.hasOwnProperty.call(undoManagers, order.id)) {
            undoManagers[order.id] = new UNDOmanager();
        }
    }

    /** Handles a single payment and markes an order as done. */
    function handleSinglePayment() {
        const orderId = $("#payment").data("order-id");

        const createdBill = OrderController.createBillForOrder(orderId);
        const completedOrder = OrderController.completeOrder(orderId);

        console.log(
            `StaffDashboardController | Payment for order '${orderId}' received.`
        );

        if (completedOrder) {
            paymentDone();
        }
    }

    /** Handles the initializing of the split of a bill. */
    function handleInitSplitBill() {
        const orderId = $("#payment").data("order-id");
        const order = OrderController.getOrderById(orderId);

        let bill;
        let splitNumber;
        // When there is already a bill for the order... Use it!
        if (order.billId) {
            bill = OrderController.getBillById(order.billId);
        }

        // When there is no bill or the existing bill has no info about the split, get the info from the view.
        let splitObj;
        if (!bill || !bill.split) {
            const splitNumberInput = $("#payment-split-value").val();
            if (!splitNumberInput) {
                return;
            }
            splitNumber = parseInt(splitNumberInput.trim());
            if (isNaN(splitNumber)) {
                console.log(
                    `Provided value '${splitNumberInput}' is not a valid number!`
                );
                return;
            }

            splitObj = {};
            for (let i = 1; i <= splitNumber; i++) {
                const splitId = i.toString();
                splitObj[splitId] = {
                    paid: false,
                };
            }

            if (!bill) {
                // When there is no bill, create it now!
                bill = OrderController.createBillForOrder(orderId, splitObj);
            } else {
                // When there is already a bill, update the info about the split.
                bill = OrderController.editBillSplit(bill.id, splitObj);
            }
        }

        // When the splitting number is not set yet, use the info from the bill object.
        if (!splitNumber) {
            splitNumber = Object.keys(bill.split).length;
        }

        // Update the view.
        let splitPaymentButtonsHTML = "";
        for (const splitId in bill.split) {
            if (Object.hasOwnProperty.call(bill.split, splitId)) {
                const splitInfo = bill.split[splitId];
                if (splitInfo.paid != true) {
                    splitPaymentButtonsHTML += `
                <button class="split-payment-buttons overlay-button hover-shine" data-split-id="${splitId}">
                    <span data-lang="payment-split-pay-button"></span>
                    <span>#${splitId}</span>
                </button>`;
                }
            }
        }
        $("#payments").html(`
                <div id="split-payment-buttons-container">
                    ${splitPaymentButtonsHTML}
                </div>
            `);

        // Add event handlers for the buttons
        $(".split-payment-buttons").click(function () {
            const splitId = $(this).data("split-id");
            handleSplitPayment(orderId, bill.id, splitId);
            $(this).remove();
        });

        LanguageController.refreshTextStrings();
    }

    /**
     * Handles a split payment by setting the individual payments as paid and
     * checking if all have paid.
     *
     * @param {number} orderId The order id.
     * @param {number} billId The bill id.
     * @param {string} splitId The split id.
     */
    function handleSplitPayment(orderId, billId, splitId) {
        const bill = OrderController.getBillById(billId);
        if (!bill) {
            console.log(
                `handleSplitPayment | Bill with id '${billId}' does not exist!`
            );
            return;
        }
        bill.split[splitId].paid = true;

        const updatedBill = OrderController.editBillSplit(billId, bill.split);

        let allPaid = true;
        for (const splitId in updatedBill.split) {
            if (Object.hasOwnProperty.call(updatedBill.split, splitId)) {
                const splitInfo = updatedBill.split[splitId];
                if (splitInfo.paid != true) {
                    allPaid = false;
                }
            }
        }
        if (allPaid) {
            console.log(
                `StaffDashboardController | All payments for order '${orderId}' received.`
            );
            const updatedOrder = OrderController.completeOrder(orderId);

            if (updatedOrder) {
                paymentDone();
            }
        }
    }

    /** Handles everything that should be done after a successful payment. */
    function paymentDone() {
        initOrdersList();
        $("#payment").data("order-id", "");
        $("#overlay-payment").hide();
    }

    /**
     * Saves the value from the input field to the 'notes' field of the order.
     *
     * @param {object} event The event object.
     */
    function saveInputAsNotesToOrder(event) {
        // Save the changed value
        const inputElement = event.target;
        const orderId = $(inputElement)
            .closest(".order-element")
            .data("order-id");
        const newValue = $(inputElement).val().trim();
        const changeNoteOfOrderFunc = OrderController.changeNoteOfOrderUNDOFunc(
            orderId,
            newValue
        );
        const undoManager = undoManagers[orderId];
        undoManager.doit(changeNoteOfOrderFunc);
    }

    /** Initializes the inventory overview in the view. */
    function initInventoryOverview() {
        const inventoryBarListHtml = createHTMLForInventoryItemListForOverview(
            barInventoryController
        );
        const inventoryVipListHtml = createHTMLForInventoryItemListForOverview(
            vipInventoryController
        );
        $("#inventory-bar-overview .inventory-list-content").html(
            inventoryBarListHtml
        );
        $("#inventory-vip-overview .inventory-list-content").html(
            inventoryVipListHtml
        );

        $(".item-hide-visible-button").click(function () {
            const beverageNr = $(this).data("beverage-nr");
            const inventoryName = $(this).data("inventory-name");
            const currentStatus = $(this).data("visible-status");
            const newStatus = !currentStatus;

            // true means, the item will be visible in the menu
            if (newStatus == true) {
                DatabaseAPI.VisibleInMenu.setBeverageToVisible(
                    inventoryName,
                    beverageNr.toString()
                );
            } else {
                DatabaseAPI.VisibleInMenu.setBeverageToHidden(
                    inventoryName,
                    beverageNr.toString()
                );
            }

            $(
                `#item-hide-visible-button-text-${inventoryName}-${beverageNr}`
            ).attr(Constants.DATA_LANG_DYNAMIC_VALUE, newStatus);

            $(this).data("visible-status", newStatus);
            if (newStatus == true) {
                $(this).addClass("item-visible");
                $(this).removeClass("item-hidden");
            } else {
                $(this).removeClass("item-visible");
                $(this).addClass("item-hidden");
            }

            // Refresh the dynamic text strings so the true / false values will be replaced with adaquate text strings.
            LanguageController.refreshDynamicTextStrings();
        });

        // Add info about number of notifications
        const barItemsRunningLow =
            barInventoryController.getItemsThatRunOutOfStock();
        const vipItemsRunningLow =
            vipInventoryController.getItemsThatRunOutOfStock();
        $("#inventory-bar-overview .inventory-notifications-total-number").html(
            barItemsRunningLow.length
        );
        $("#inventory-vip-overview .inventory-notifications-total-number").html(
            vipItemsRunningLow.length
        );

        LanguageController.refreshTextStrings();
    }

    /**
     * Returns the HTML for an inventory element in the dashboard.
     *
     * @param {object} inventoryController The inventory controller.
     * @returns {string} The HTML.
     */
    function createHTMLForInventoryItemListForOverview(inventoryController) {
        const inventoryItems = inventoryController.getInventory();
        const inventoryName = inventoryController.getName();
        const itemsHtmlList = [];

        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            if (inventoryItem.active != true) {
                continue;
            }
            const quantity = inventoryItem.quantity;
            const beverage = DatabaseAPI.Beverages.findBeverageByNr(
                inventoryItem.beverageNr
            );
            const menuVisibilityStatus = inventoryItem.visibleInMenu;

            const visibleHtmlClass =
                menuVisibilityStatus == true ? "item-visible" : "item-hidden";

            const buttonShowHideHTML = `
            <div class="item-hide-visible-button clickable hover-shine ${visibleHtmlClass}" data-beverage-nr="${beverage.nr}" data-inventory-name="${inventoryName}" data-visible-status="${menuVisibilityStatus}">
                <span id="item-hide-visible-button-text-${inventoryName}-${inventoryItem.beverageNr}"
                ${Constants.DATA_LANG_DYNAMIC_KEY}="item-hide-visible-button-dynamic"
                ${Constants.DATA_LANG_DYNAMIC_VALUE}=${menuVisibilityStatus}>
                    ...
                </span>
            </div>`;

            const classRunningLow =
                quantity < Constants.LOW_STOCK_NUMBER
                    ? "inventory-has-items-running-low"
                    : "inventory-has-enough-items";

            itemsHtmlList.push(`
            <div class="inventory-item-row">
                <div class="column-item column-item-nr">
                    <span>${beverage.nr}</span>
                </div>
                <div class="column-item column-item-name">
                    <span>${beverage.name}</span>
                </div>
                <div class="column-item column-item-quantity">
                    <span>${quantity}</span>
                    <img src="assets/images/icon_alert.png" class="${classRunningLow}">
                </div>
                <div class="column-item column-item-hidden-status">
                    ${buttonShowHideHTML}
                </div>
            </div>
            `);
        }

        let html = "<div>";
        itemsHtmlList.forEach((itemHtml) => {
            html += itemHtml;
        });
        html += "</>";
        return html;
    }

    /**
     * Event handler for showing the details of the order for a specific table. *
     *
     * @param {number} table The table number.
     */
    function showOrderDetailsForTable(table) {
        const ordersForTable = OrderController.getUndoneOrdersForTable(table);

        // Add table number
        $("#order-details-table").html(table);

        // Add order details for each table
        let ordersListHTML = "";
        ordersForTable.forEach((order) => {
            // Order number
            const orderNrHTML = `
            <div>
                <span class="overlay-details-label" data-lang="order-details-id-label"></span>
                <span class="overlay-details-value">${order.id}</span>
            </div>`;

            // Create HTML for order items
            let orderItemsHTML = "<ul>";
            order.items.forEach((item) => {
                const beverageNr = item.beverageNr;
                const beverage =
                    DatabaseAPI.Beverages.findBeverageByNr(beverageNr);

                orderItemsHTML += `
                <li class="order-details-beverage overlay-details-value">
                ${beverage.name}
                </li>
                `;
            });
            orderItemsHTML += "</ul>";

            // Order items, notes and buttons for editing and deleting
            const orderItemsContainerHTML = `
            <div>
                <span class="overlay-details-label" data-lang="order-details-items-label"></span>
                <div>
                    ${orderItemsHTML}
                </div>
                <div>
                    <span class="overlay-details-label" data-lang="order-details-notes-label"></span>
                    <span class="overlay-details-value">${order.notes}</span>
                </div>
                <button type="clickable" class="overlay-button details-overlay-edit-order-button hover-shine" data-order-id="${order.id}">
                    <span data-lang="edit-order-button"></span>
                </button>
                <button type="clickable" class="overlay-button details-overlay-delete-order-button hover-shine" data-order-id="${order.id}">
                    <span data-lang="delete-order-button"></span>
                </button>
            </div>
            `;

            ordersListHTML += `
            <div class="order-details-order-element">
            ${orderNrHTML}
            ${createHtmlForInventoryNameInfo(order.inventory)}
            ${orderItemsContainerHTML}
            </div>`;
        });

        // Add the html to the DOM
        $("#order-details-list").html(ordersListHTML);

        // Add an event handler to the buttons
        $(".details-overlay-edit-order-button").click(function (event) {
            event.preventDefault();
            const orderId = parseInt($(this).data("order-id"));
            editOrder(orderId);
        });
        $(".details-overlay-delete-order-button").click(function (event) {
            event.preventDefault();
            const orderId = parseInt($(this).data("order-id"));
            deleteOrder(orderId);

            // Hide overlay
            $("#overlay-orders-details").hide();
        });

        // Refresh all text strings
        LanguageController.refreshTextStrings();

        // Finally show the overlay
        $("#overlay-orders-details").show();
    }

    /**
     * Creates a html div to display the inventory name.
     *
     * @param {string} inventoryName The inventory name.
     * @returns {string} The html string.
     */
    function createHtmlForInventoryNameInfo(inventoryName) {
        return `
            <div>
            <span class="overlay-details-label" data-lang="order-details-inventory-label"></span>
                <span
                    ${Constants.DATA_LANG_DYNAMIC_KEY}="order-inventory-dynamic"
                    ${Constants.DATA_LANG_DYNAMIC_VALUE}=${inventoryName}
                    class="overlay-details-value">
                    ...
                </span>
            </div>`;
    }

    /**
     * Returns the inventory controller for the given inventory name.
     *
     * @param {string} inventoryName The inventory name.
     * @returns {object} The inventory controller or `undefined` if the
     *   inventory name is unknown.
     */
    function getInventoryController(inventoryName) {
        let inventoryController;
        switch (inventoryName) {
            case barInventoryController.getName():
                inventoryController = barInventoryController;
                break;

            case vipInventoryController.getName():
                inventoryController = vipInventoryController;
                break;

            default:
                console.log(
                    "StaffDashboardController.getInventoryController | Unknown inventory: " +
                        inventoryName
                );
                break;
        }
        return inventoryController;
    }

    /**
     * Event handler for creating a new order.
     *
     * @param {object} event The event object.
     */
    function handleCreateOrder(event) {
        event.preventDefault();

        const data = getFormData("create-order-form");
        const items = [];
        $("input[name=addItem]").each(function () {
            const beverageNr = $(this).val().trim();
            if (beverageNr) {
                items.push({
                    beverageNr: beverageNr,
                });
            }
        });

        const order = {
            table: parseInt(data.table.trim()),
            items: items,
            notes: data.notes,
            inventory: data.inventory,
        };
        const createdOrder = OrderController.createOrder(order);

        // If the order was created successfully, update the order list and close the overlay.
        if (createdOrder) {
            // Update order list
            initOrdersList();

            // Hide overlay
            $("#overlay-create-order").hide();
        }
    }

    /**
     * Delete the order and updates the view.
     *
     * @param {string} orderId The order id.
     */
    function deleteOrder(orderId) {
        OrderController.removeOrderById(orderId);

        // Update order list
        initOrdersList();
    }

    /**
     * Edit an order and update the view.
     *
     * @param {string} orderId The order id.
     */
    function editOrder(orderId) {
        // TODO: Implement editing of an order

        $("#overlay-edit-order").show();
        //OrderController.editOrder(order);
    }

    /**
     * Get the data from a form and create a object with key-value pairs out of it.
     *
     * @param {string} formId The form id.
     * @returns {object} Object as key-value pairs.
     */
    function getFormData(formId) {
        return $(`#${formId}`)
            .serializeArray()
            .reduce(function (obj, item) {
                obj[item.name] = item.value.trim();
                return obj;
            }, {});
    }

    exports.showOrderDetailsForTable = showOrderDetailsForTable;
})(jQuery, window);
