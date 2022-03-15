/*
 * File: StaffDashboardController.js
 *
 * The controller for the staff dashboard.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 15th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals LanguageController, OrderController, InventoryController, UNDOmanager */

(function ($, exports) {
    let barInventoryController = new InventoryController(
        Constants.INVENTORIES.BAR
    );
    let vipInventoryController = new InventoryController(
        Constants.INVENTORIES.VIP
    );
    let undoManager = new UNDOmanager();

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

        $("#restock-button").click(function () {
            $("#overlay-restock").show();
        });

        $("#create-order-form").on("submit", handleCreateOrder);

        $(".overlay-close-button").click(function () {
            // Hide the overlay div this close button belongs to.
            $(this).parent().closest(".overlay").hide();
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
            }
        });

        $("#notify-security-button").click(function () {
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
        });
    }

    /** Initializes the order list in the view. */
    function initOrdersList() {
        let orderId = ``;
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

                    // TODO: Status value ("tbd." / "done") makes not real sense at the moment...

                    ordersHtmlList.push(`
                    <div class="order-element">
                        <div class="order-element-number">
                            <span class="" data-lang="order-list-order-number"></span>
                            <span>${order.id}</span>
                        </div>
                        <div class="order-element-row" data-order-id="${order.id}">
                            <div class="order-element-row-items">
                                <span class="order-list-column-heading" data-lang="order-list-items"></span>
                                <br/>
                                <span>${orderItemsHTML}</span>
                            </div>
                            <div>
                                <span class="order-list-column-heading" data-lang="order-list-notes"></span>
                                <br/>
                                <textarea class="order-notes-text-field" rows="2" >${order.notes}</textarea>
                            </div>
                            <div>
                                <span class="order-list-column-heading" data-lang="order-list-status"></span>
                                <br/>
                                <span ${Constants.DATA_LANG_DYNAMIC_KEY}="order-list-status-dynamic" ${Constants.DATA_LANG_DYNAMIC_VALUE}=${order.done}>...</span>
                            </div>
                            <div>
                                <span class="order-list-column-heading" data-lang="order-list-actions"></span>
                                <br/>
                                <div>
                                    <span class="clickable order-list-pay-order-button order-action-button hover-shine">💳</span>
                                    <span class="clickable order-list-edit-order-button order-action-button hover-shine">📝</span>
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

        // Add event hander for the pay buttons for the orders
        $(".order-list-pay-order-button").click(function () {
            orderId = $(this).closest(".order-element-row").data("order-id");

            // TODO: Splitting type + vip account

            $("#overlay-payment").show();
            $("#bill-type-single").click(function () {
                $("#single-payment").show();
                $("#split-payment").hide();
            });

            $("#bill-type-split").click(function () {
                $("#single-payment").hide();
                $("#split-payment").show();
            });

            $("#finalize-split-number").click(function () {
                var split_number = $("#payment-split-value").val();
                let split_payments = ``;

                const createdBill = OrderController.createBillForOrder(orderId);
                const updatedOrder = OrderController.completeOrder(
                    orderId,
                    createdBill.id
                );

                for (let i = 1; i <= split_number; i++) {
                    split_payments =
                        split_payments +
                        `<button class="split-payment-buttons">
                            <span data-lang="payment-split-pay-button"></span>
                            <span>#${i}</span>
                        </button>`;
                }
                $("#payments").empty();
                $("#payments").append(split_payments);

                LanguageController.refreshTextStrings();

                $(".split-payment-buttons").click(function () {
                    $(this).remove();

                    if ($("#payments").children().length == 0) {
                        alert("All payments have been made. Thank you.");

                        if (updatedOrder) {
                            // Order was successfully marked as done → we can remove it.
                            initOrdersList();
                        }
                        $("#overlay-payment").hide();
                    }
                });
            });

            $("#single-payment-button").click(function () {
                const createdBill = OrderController.createBillForOrder(orderId);
                const updatedOrder = OrderController.completeOrder(
                    orderId,
                    createdBill.id
                );

                $("#payments").empty();
                alert("All payments have been made. Thank you.");

                if (updatedOrder) {
                    // Order was successfully marked as done → we can remove it.
                    initOrdersList();
                }

                $("#overlay-payment").hide();
            });
        });

        $("#finalize-split-number").click(function () {
            var split_number = $("#payment-split-value").val();
            let split_payments = ``;

            const createdBill = OrderController.createBillForOrder(orderId);
            const updatedOrder = OrderController.completeOrder(
                orderId,
                createdBill.id
            );

            for (let i = 1; i <= split_number; i++) {
                split_payments =
                    split_payments +
                    `<button class="split-payment-buttons">
                        <span data-lang="payment-split-pay-button"></span>
                        <span>#${i}</span>
                    </button>`;
            }
            $("#payments").empty();
            $("#payments").append(split_payments);

            LanguageController.refreshTextStrings();

            $(".split-payment-buttons").click(function () {
                $(this).remove();

                if ($("#payments").children().length == 0) {
                    alert("All payments have been made. Thank you.");

                    if (updatedOrder) {
                        // Order was successfully marked as done → we can remove it.
                        initOrdersList();
                    }
                    $("#overlay-payment").hide();
                }
            });
        });

        $("#single-payment-button").click(function () {
            const createdBill = OrderController.createBillForOrder(orderId);
            const updatedOrder = OrderController.completeOrder(
                orderId,
                createdBill.id
            );

            $("#payments").empty();
            alert("All payments have been made. Thank you.");

            if (updatedOrder) {
                // Order was successfully marked as done → we can remove it.
                initOrdersList();
            }

            $("#overlay-payment").hide();
        });

        // Add event hander for the edit buttons for the orders
        $(".order-list-edit-order-button").click(function () {
            const orderId = $(this)
                .closest(".order-element-row")
                .data("order-id");

            editOrder(orderId);
        });

        // Add number of current orders to the footer of the overview
        $("#orders-list-total-number").html(numberOfOrders);

        LanguageController.refreshTextStrings();
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
            .closest(".order-element-row")
            .data("order-id");
        const newValue = $(inputElement).val().trim();
        const changeNoteOfOrderFunc = OrderController.changeNoteOfOrderUNDOFunc(
            orderId,
            newValue
        );
        undoManager.doit(changeNoteOfOrderFunc);
    }

    /** Initializes the inventory overview in the view. */
    function initInventoryOverview() {
        // Add list of inventories
        const inventoryListHTML = `
        <div id="inventory-list">
        ${createHTMLForInventoryElementForOverview(barInventoryController)}
        ${createHTMLForInventoryElementForOverview(vipInventoryController)}
        </div>`;
        $("#inventory-list-container").html(inventoryListHTML);

        // Add event handlers
        $(".inventory-element").click(function () {
            const inventoryName = $(this).data("inventory-name");
            showInventoryDetails(inventoryName);
        });

        // Add info about number of notifications
        const barItemsRunningLow =
            barInventoryController.getItemsThatRunOutOfStock();
        const vipItemsRunningLow =
            vipInventoryController.getItemsThatRunOutOfStock();
        const sumOfItemsRunningLow =
            barItemsRunningLow.length + vipItemsRunningLow.length;
        $("#inventory-notifications-total-number")
            .empty()
            .append(sumOfItemsRunningLow);

        LanguageController.refreshTextStrings();
    }

    /**
     * Returns the HTML for an inventory element in the dashboard.
     *
     * @param {object} inventoryController The inventory controller.
     * @returns {string} The HTML.
     */
    function createHTMLForInventoryElementForOverview(inventoryController) {
        const itemsRunningLow = inventoryController.getItemsThatRunOutOfStock();

        const classRunningLow =
            itemsRunningLow.length > 0
                ? "inventory-has-items-running-low"
                : "inventory-has-enough-items";
        let imageSource, imageSourceHover, alt;
        switch (inventoryController.getName()) {
            case Constants.INVENTORIES.BAR:
                imageSource = "assets/images/icon_beer.png";
                imageSourceHover = "assets/images/icon_beer_active.png";
                alt = "Bar Inventory";
                break;
            case Constants.INVENTORIES.VIP:
                imageSource = "assets/images/icon_cooler.png";
                imageSourceHover = "assets/images/icon_cooler_active.png";
                alt = "VIP Inventory";
                break;
            default:
                imageSource = "assets/images/icon_placeholder.png";
                break;
        }
        const html = `
        <div class="inventory-element" data-inventory-name="${inventoryController.getName()}">
            <img src="${imageSource}" data-src="${imageSource}" data-hover="${imageSourceHover}" alt="${alt}" class="inventory-element-image">
            <img src="assets/images/icon_alert.png" class="${classRunningLow}">
        </div>`;
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

        // TODO: Filter out the VIP orders, because only the orders for the bar are relevant in this view.

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
                    <span data-lang="details-overlay-edit-order-button"></span>
                </button>
                <button type="clickable" class="overlay-button details-overlay-delete-order-button hover-shine" data-order-id="${order.id}">
                    <span data-lang="details-overlay-delete-order-button"></span>
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
     * Event handler for showing the details for an inventory.
     *
     * @param {string} inventoryName The inventory name.
     */
    function showInventoryDetails(inventoryName) {
        let inventoryController = getInventoryController(inventoryName);
        if (!inventoryController) {
            return;
        }

        // Add inventory name
        const orderInventoryHTML =
            createHtmlForInventoryNameInfo(inventoryName);
        $("#inventory-details-inventory-container").html(orderInventoryHTML);

        // Add details of items that are running low
        const itemsRunningLow = inventoryController.getItemsThatRunOutOfStock();
        let itemsRunningLowHTML = "";
        itemsRunningLow.forEach((item) => {
            itemsRunningLowHTML += `
            <span class="inventory-item-running-low-beverage-nr">
                ${item.beverageNr}
            </span>
            <span class="inventory-item-running-low-quantity">
                ${item.quantity}
            </span>
            <br/>`;
        });
        $("#inventory-details-items-running-low")
            .empty()
            .append(itemsRunningLowHTML);

        // Refresh all text strings
        LanguageController.refreshTextStrings();

        // Finally show the overlay
        $("#overlay-inventory-details").show();
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

        // Hide overlay
        $("#overlay-orders-details").hide();
    }

    /**
     * Edit an order and update the view.
     *
     * @param {string} orderId The order id.
     */
    function editOrder(orderId) {
        // TODO: Implement editing of an order

        alert("NOT IMPLEMENTED YET");
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
    exports.showInventoryDetails = showInventoryDetails;
})(jQuery, window);
