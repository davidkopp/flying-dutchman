/*
 * File: StaffDashboardController.js
 *
 * The controller for the staff dashboard.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 5th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals LanguageController, OrderController, InventoryController */

(function ($, exports) {
    let barInventoryController = new InventoryController(
        Constants.INVENTORIES.BAR
    );
    let vipInventoryController = new InventoryController(
        Constants.INVENTORIES.VIP
    );

    $(document).ready(function () {
        $("#overlay").hide();

        initOrdersList();
        initInventoryOverview();

        // Add event handlers to all buttons
        $("#create-order-button").click(function () {
            // Clear form values.
            $("#create-order-form")
                .find("input[type=text], input[type=number], textarea")
                .val("");
            $("#create-order-form")
                .find("input[name=inventory]")
                .prop("checked", false);
            $("#added-items-list").empty();
            $("#overlay-create-order").show();
        });

        $("#add-item-button").click(function () {
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

        $("#delete-order-button").click(handleDeleteOrder);

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

        // Hide all prepared overlays at the beginning.
        $(".overlay").hide();
    });

    /** Initializes the order list in the view. */
    function initOrdersList() {
        const orders = OrderController.getUndoneOrders();

        // Add current orders to overview
        let ordersListHTML = "";
        orders.forEach((order) => {
            ordersListHTML += `
            <div class="order-element" data-order-id="${order.id}">
                <div class="order-user-picture-container"></div>
                <div class="order-table-number">${order.table}</div>
            </div>`;
        });
        $("#orders-list").empty().append(ordersListHTML);

        // Add event handlers
        $(".order-element").click(function () {
            const orderId = $(this).data("order-id");
            showOrderDetails(orderId);
        });

        // Add number of current orders to the footer of the overview
        $("#orders-list-total-number").empty().append(orders.length);

        LanguageController.refreshTextStrings();
    }

    /** Initializes the inventory overview in the view. */
    function initInventoryOverview() {
        // Add list of inventories
        const inventoryListHTML = `
        <div id="inventory-list">
        ${createHTMLForInventoryElement(barInventoryController)}
        ${createHTMLForInventoryElement(vipInventoryController)}
        </div>`;
        $("#inventory-list-container").empty().append(inventoryListHTML);

        // Add event handlers
        $(".inventory-element").click(function () {
            const inventoryName = $(this).data("inventory-name");
            showInventoryDetails(inventoryName);
        });

        // Add hover effect to the inventory images.
        $(".inventory-element-image")
            .mouseover(function () {
                $(this).attr("src", $(this).data("hover"));
            })
            .mouseout(function () {
                $(this).attr("src", $(this).data("src"));
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
    function createHTMLForInventoryElement(inventoryController) {
        const itemsRunningLow = inventoryController.getItemsThatRunOutOfStock();

        const classRunningLow =
            itemsRunningLow.length > 0 ? "inventory-has-items-running-low" : "";
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
            <img src="${imageSource}" data-src="${imageSource}" data-hover="${imageSourceHover}" alt="${alt}" class="inventory-element-image ${classRunningLow}">
        </div>`;
        return html;
    }

    /**
     * Event handler for showing the details of a specific order.
     *
     * @param {number} orderId The order id.
     */
    function showOrderDetails(orderId) {
        const order = OrderController.getOrderById(orderId);
        if (!order) {
            return;
        }

        // Add order table
        $("#order-details-table").empty().append(order.table);

        // Add order items
        let orderItemsHTML = "";
        order.items.forEach((item) => {
            orderItemsHTML += `
            <span class="order-details-beverage">
                ${item.beverageNr}
            </span>
            <br/>`;
        });
        $("#order-details-items-container").empty().append(orderItemsHTML);

        // Refresh all text strings
        LanguageController.refreshTextStrings();

        // Set the current order id as a data attribute to the delete order button, so it will be able to delete the correct order.
        $("#delete-order-button").data("order-id", orderId);

        // Finally show the overlay
        $("#overlay-orders-details").show();
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
        $("#inventory-details-inventory-name").empty().append(inventoryName);

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
            table: data.table,
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
     * Event handler for deleting an order.
     *
     * @param {object} event The event object.
     */
    function handleDeleteOrder(event) {
        event.preventDefault();

        const orderId = parseInt($(this).data("order-id"));
        OrderController.removeOrderById(orderId);

        // Update order list
        initOrdersList();

        // Hide overlay
        $("#overlay-orders-details").hide();
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

    exports.showOrderDetails = showOrderDetails;
    exports.showInventoryDetails = showInventoryDetails;
})(jQuery, window);
