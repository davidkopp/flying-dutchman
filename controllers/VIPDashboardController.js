/*
 * File: VIPDashboardController.js
 *
 * The VIP's Dashboard Controller.
 *
 * Author: Paarth Sanhotra, Abdullah Abdullah
 */
/* globals LoginController, MenuController, OrderController */

(function ($, exports) {
    let table_number;
    let currentMenu;

    // When the DOM is ready, initialize the view with data and add event handlers.
    $(document).ready(function () {
        $("#vip-menu").hide();

        $("#main-tab").click(function () {
            $("#main-menu").show();
            $("#vip-menu").hide();

            // Reinitialize menu
            initMainMenu();
        });

        $("#vip-tab").click(function () {
            $("#vip-menu").show();
            $("#main-menu").hide();

            initVipMenu();
        });

        initVipUserInformation();
        initTableNumber();

        // By default the main menu is shown -> initialize it.
        initMainMenu();

        $("#place-order-button").click(handlePlaceOrder);

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

    /** Initializes the main menu with the items from the bar vip inventory. */
    function initMainMenu() {
        if (!MenuController) {
            console.log(
                "MenuController is not available! Initializing of the menu not possible!"
            );
            return;
        }

        // First ensure that the order cart if empty, because we don't allow to mix bar and specials in one order.
        $("#order").empty();

        const mainMenuConfig = {
            viewElementId: "main-menu",
            inventory: Constants.INVENTORIES.BAR,
            allowDragItems: true,
        };
        MenuController.initMenu(mainMenuConfig);
        currentMenu = "main";
    }

    /** Initializes the vip menu with the items from the vip inventory. */
    function initVipMenu() {
        if (!MenuController) {
            console.log(
                "MenuController is not available! Initializing of the menu not possible!"
            );
            return;
        }

        // First ensure that the order cart if empty, because we don't allow to mix bar and specials in one order.
        $("#order").empty();

        const vipMenuConfig = {
            viewElementId: "vip-menu",
            inventory: Constants.INVENTORIES.VIP,
            allowDragItems: true,
        };
        MenuController.initMenu(vipMenuConfig);
        currentMenu = "vip";
    }

    /** Event handler for the place order button → create the order. */
    function handlePlaceOrder() {
        let items = [];
        $("#order")
            .find(".item")
            .each(function () {
                const beverageID = $(this).data("beverage-nr");
                items.push({
                    beverageNr: beverageID.toString(),
                });
            });

        // If there are no items, don't create the order.
        if (items.length < 1) {
            console.log("There are no items added to the order!");
            return;
        }

        let inventoryName;
        switch (currentMenu) {
            case "main":
                inventoryName = Constants.INVENTORIES.BAR;
                break;
            case "vip":
                inventoryName = Constants.INVENTORIES.VIP;
                break;
            default:
                console.log(`Unknown ${currentMenu}! Can't place order.`);
                break;
        }
        if (!inventoryName) {
            return;
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

            // Reset the current menu and reset the order area.
            switch (currentMenu) {
                case "main":
                    initMainMenu();
                    break;
                case "vip":
                    initVipMenu();
                    break;
                default:
                    break;
            }

            // Show success
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
        const idOfMenuItem = ev.dataTransfer.getData("text");
        const $menuItemElement = $(`#${idOfMenuItem}`);
        const $targetElement = $(ev.target);
        if ($targetElement.hasClass(".droppable-area")) {
            $targetElement.append($menuItemElement);
        } else {
            $targetElement.closest(".droppable-area").append($menuItemElement);
        }
    }

    exports.dragItem = drag;
    exports.dropItem = drop;
    exports.allowDropOnItem = allowDrop;
})(jQuery, window);
