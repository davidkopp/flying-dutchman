/*
 * File: VIPDashboardController.js
 *
 * The VIP's Dashboard Controller.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Monday, 7th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals LoginController, OrderController */

(function ($, exports) {
    let table_number;

    // When the DOM is ready, initialize the view with data and add event handlers.
    $(document).ready(function () {
        $("#vip-menu").hide();

        $("#main-tab").click(function () {
            $("#main-menu").show();
            $("#vip-menu").hide();
        });

        $("#vip-tab").click(function () {
            $("#vip-menu").show();
            $("#main-menu").hide();
        });

        initVipUserInformation();
        initTableNumber();
        initMenus();

        // Add event handler for the button 'place order'
        $("#place-order").click(handlePlaceOrder);
    });

    /** Initializes the table number in the view. */
    function initTableNumber() {
        // TODO: Remove random value.
        table_number = Math.floor(Math.random() * 10 + 1);
        $("#table-number").html(table_number);
    }

    /** Initialize the vip user information with the name and the account balance. */
    function initVipUserInformation() {
        const loggedInUserData = LoginController.getUserDataOfLoggedInUser();
        if (loggedInUserData) {
            const userDetails = DatabaseAPI.Users.getUserDetailsByUserName(
                loggedInUserData.username
            );
            $("#vip-name").html(
                userDetails.first_name + " " + userDetails.last_name
            );
            $("#vip-account-balance").html(userDetails.creditSEK);
        }
    }

    /** Initialize the menus with the items from the bar and vip inventory. */
    function initMenus() {
        const bar_inventory = DatabaseAPI.Inventory.getInventory(
            Constants.INVENTORIES.BAR
        );
        const vip_inventory = DatabaseAPI.Inventory.getInventory(
            Constants.INVENTORIES.VIP
        );
        $("#main-menu").append(createHTMLForInventoryList(bar_inventory));
        $("#vip-menu").append(createHTMLForInventoryList(vip_inventory));
    }

    /**
     * Creates a HTML string for displaying the inventory items.
     *
     * @param {Array} inventory The inventory.
     * @returns {string} The HTML
     */
    function createHTMLForInventoryList(inventory) {
        let result = "";
        inventory.forEach((inventoryItem) => {
            const beverage = DatabaseAPI.Beverages.findBeverageByNr(
                inventoryItem.beverageNr
            );
            result += `
            <div data-beverage-id = "${inventoryItem.beverageNr}"
                 class = "vip-items"
                 id = "item-${inventoryItem.beverageNr}"
                 draggable = true
                 ondragstart = "dragItem(event)">
                ${beverage.name} ${beverage.alcoholstrength} ${beverage.priceinclvat}
            </div>
        `;
        });
        return result;
    }

    /** Event handler for the place order button → create the order. */
    function handlePlaceOrder() {
        const vip_inventory = DatabaseAPI.Inventory.getInventory(
            Constants.INVENTORIES.VIP
        );
        let items = [];
        $("#order")
            .children()
            .each(function () {
                const beverageID = $(this).data("beverage-id");
                items.push({
                    beverageNr: beverageID.toString(),
                });
            });

        // TODO: better approach would be to disallow the mix of the both inventories in the first place.
        let inventoryName = Constants.Inventory.BAR;
        for (let i = 0; i < vip_inventory.length; i++) {
            if (items[0].beverageNr == vip_inventory[i].beverageNr) {
                inventoryName = Constants.Inventory.VIP;
                break;
            }
        }

        const order = {
            table: table_number,
            items: items,
            inventory: inventoryName,
        };
        OrderController.createOrder(order);
    }
    /**
     * Event handler for the event 'ondragover' → prevent the defaults.
     *
     * @param {object} ev The event object.
     */
    function allowDrop(ev) {
        ev.preventDefault();
    }

    /**
     * Event handler for the event 'ondragstart' → set data to transfer.
     *
     * @param {object} ev The event object.
     */
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    /**
     * Event handler for the event 'ondrop' → make the change.
     *
     * @param {object} ev The event object.
     */
    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }

    exports.dragItem = drag;
    exports.dropItem = drop;
    exports.allowDropOnItem = allowDrop;
})(jQuery, window);
