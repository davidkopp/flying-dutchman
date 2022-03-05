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

        $("#create-order-button").click(createOrder);

        // Hide all prepared overlays at the beginning.
        $(".overlay").hide();

        LanguageController.refreshTextStrings();
    });

    /** Initializes the order list in the view. */
    function initOrdersList() {
        const orders = OrderController.getUndoneOrders();

        // Add current orders to overview
        let ordersListHTML = "";
        orders.forEach((order) => {
            ordersListHTML += `
            <div class="order-element" onclick="showOrderDetails(${order.id})">
                <div class="order-user-picture-container"></div>
                <div class="order-table-number">${order.table}</div>
            </div>`;
        });
        $("#orders-list").empty().append(ordersListHTML);

        // Add number of current orders to the footer of the overview
        $("#orders-list-total-number").empty().append(orders.length);
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
        <div class="inventory-element" onclick="showInventoryDetails('${inventoryController.getName()}')">
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

        // Add event handler to be able to hide the overlay again
        $("#overlay-orders-details").click(function () {
            $(this).hide();
        });

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

        // Add event handler to be able to hide the overlay again
        $("#overlay-inventory-details").click(function () {
            $(this).hide();
        });

        // Finally show the overlay
        $("#overlay-inventory-details").show();
    }

    /**
     * Returns the inventory controller for the given inventory name.
     *
     * @param {string} inventoryName The inventory name.
     * @returns {object} The inventory controller.
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

    /** Function for creating an new order. */
    function createOrder() {}

    exports.showOrderDetails = showOrderDetails;
    exports.showInventoryDetails = showInventoryDetails;
})(jQuery, window);
