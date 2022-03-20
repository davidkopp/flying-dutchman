/*
 * File: VIPDashboardController.js
 *
 * The VIP's Dashboard Controller.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Sunday, 13th March 2022
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

        $("#place-order").click(handlePlaceOrder);

        $(".overlay-close-button").click(function () {
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
            $("#vip-account-balance").html(
                userDetails.creditSEK + " " + Constants.CURRENCY_IN_VIEW
            );
            $("#vip-account-balance").show();
        } else {
            $("#vip-account-balance").hide();
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
        $("#main-menu").html(createHTMLForInventoryList(bar_inventory));
        $("#vip-menu").html(createHTMLForInventoryList(vip_inventory));
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
                 class = "item drag-items"
                 id = "item-${inventoryItem.beverageNr}"
                 draggable = true
                 ondragstart = "dragItem(event)">
                ${beverage.name} ${beverage.alcoholstrength} ${beverage.priceinclvat}
            </div>`;
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
            .children("div")
            .each(function () {
                const beverageID = $(this).data("beverage-id");
                items.push({
                    beverageNr: beverageID.toString(),
                });
            });

        // If there are no items, don't create the order.
        if (items.length < 1) {
            console.log("There are no items added to the order!");
            return;
        }

        // TODO: better approach would be to disallow the mix of the both inventories in the first place.
        let inventoryName = Constants.INVENTORIES.BAR;
        for (let i = 0; i < vip_inventory.length; i++) {
            if (items[0].beverageNr == vip_inventory[i].beverageNr) {
                inventoryName = Constants.INVENTORIES.VIP;
                break;
            }
        }

        const order = {
            table: table_number,
            items: items,
            inventory: inventoryName,
        };
        const createdOrder = OrderController.createOrder(order);
        if (createdOrder) {
            console.log(
                "Order was successfully created: " +
                    JSON.stringify(createdOrder)
            );

            // Reset the menus and reset the order area.
            initMenus();
            $("#order").empty();

            // Show success
            $("#info-box-message").html("Placement of order was successful!");
            $("#overlay-message-box").show();
        }
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
        const data = ev.dataTransfer.getData("text");
        if (data !== ev.target.id) {
            ev.target.appendChild(document.getElementById(data));
        }
    }

    exports.dragItem = drag;
    exports.dropItem = drop;
    exports.allowDropOnItem = allowDrop;
})(jQuery, window);
