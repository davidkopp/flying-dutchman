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

(function ($, exports) {
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

        let table_number = Math.floor(Math.random() * 10 + 1);

        $("#table-number").append("Table Number " + table_number);

        const userDetails = LoginController.getUserDataOfLoggedInUser();
        let user = DatabaseAPI.Users.getUserDetailsByUserName(
            userDetails.username
        );
        let main_menu_items = "";
        let ordered_items = "";
        let bar_inventory = DatabaseAPI.Inventory.getInventory(
            Constants.INVENTORIES.BAR
        );
        let vip_inventory = DatabaseAPI.Inventory.getInventory(
            Constants.INVENTORIES.VIP
        );
        let bar_items = "";
        let vip_items = "";

        for (let i = 0; i < bar_inventory.length; i++) {
            beverage = DatabaseAPI.Beverages.findBeverageByNr(
                bar_inventory[i].beverageNr
            );
            bar_items =
                bar_items +
                `
                <div data-beverage-id = "${bar_inventory[i].beverageNr}" class = "bar-items" id = "item-${bar_inventory[i].id}" draggable = "true" ondragstart = "dragItem(event)">
                    ${beverage.name} ${beverage.alcoholstrength} ${beverage.priceinclvat}
                </div>
            `;
        }

        for (let i = 0; i < vip_inventory.length; i++) {
            beverage = DatabaseAPI.Beverages.findBeverageByNr(
                vip_inventory[i].beverageNr
            );
            vip_items =
                vip_items +
                `
                <div data-beverage-id = "${vip_inventory[i].beverageNr}" class = "vip-items" id = "item-${vip_inventory[i].beverageNr}" draggable = "true" ondragstart = "dragItem(event)">
                    ${beverage.name} ${beverage.alcoholstrength} ${beverage.priceinclvat}
                </div>
            `;
        }

        // Populate the amount in the VIP's account
        $("#vip-account").append(
            "Weclome " +
                user.first_name +
                " " +
                user.last_name +
                ", Balance = " +
                user.creditSEK
        );

        $("#main-menu").append(bar_items);
        $("#vip-menu").append(vip_items);

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }

        function set_content(target, content) {
            target.innerHTML = content;
        }

        function update_view() {
            set_content(document.getElementById("main-menu"), bar_items);
            set_content(document.getElementById("vip-menu"), vip_items);
            set_content(document.getElementById("order"), ordered_items);
        }

        $("#place-order").click(function () {
            let items = [];
            $("#order")
                .children()
                .each(function () {
                    const beverageID = $(this).data("beverage-id");
                    items.push({
                        beverageNr: beverageID.toString(),
                    });
                });

            for (let i = 0; i < vip_inventory.length; i++) {
                if (items[0].beverageNr == vip_inventory[i].beverageNr) {
                    inventory = "vipInventory";
                    break;
                }
                inventory = "barInventory";
            }

            let order = {
                table: table_number,
                items: items,
                inventory: inventory,
            };

            console.log(order);

            OrderController.createOrder(order);
        });

        exports.dragItem = drag;
        exports.dropItem = drop;
        exports.allowDropOnItem = allowDrop;
        exports.update_view_vip = update_view;
    });
})(jQuery, window);
