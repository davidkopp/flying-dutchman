/*
 * File: ManagerDashboardController.js
 *
 * DESCRIPTION
 *
 * Author: David Kopp
 * -----
 * Last Modified: Thursday, 3rd March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

// File: ManagerDashboardController.js

// The Manager's Dashboard Controller.

// Author: Paarth Sanhotra
// -----
// Last Modified: Monday, 3rd March 2022
// Modified By: Paarth Sanhotra (paarthsanhotra@gmail.com)

(function ($, exports) {
    $(document).ready(function () {
        var finalindex, beverage, inventoryItem, stocks, beverageNr;
        $("#revise-amounts-label").click(function () {
            $("#revise-amounts").toggle();
        });
        $("#refil-beverages-label").click(function () {
            $("#refil-beverages").toggle();
        });
        $("#add-remove-beverages-label").click(function () {
            $("#add-remove-beverages").toggle();
        });

        $("#get-amount-button").click(function () {
            const serialNumber = $("#amount-serial-number").val();
            if (serialNumber !== "") {
                for (
                    let index = 0;
                    index < BeveragesDB.beverages.length;
                    index++
                ) {
                    beverage = BeveragesDB.beverages[index];
                    if (beverage.nr == serialNumber) {
                        finalindex = index;
                        console.log(`Beverage found: '${beverage.name}'`);
                        $("#amount").empty();
                        $("#amount").append(
                            `<h6>${beverage.priceinclvat}</h6>`
                        );
                        break;
                    }
                }
            } else {
                $("#amount").empty();
                console.log(
                    "ManagerDashboardController | Search with a valid serial number"
                );
            }
        });

        $("#revise-amount-button").click(function () {
            const newvalue = $("#revise-amount-figure").val();

            if (finalindex != 0 && beverage != null && newvalue != "") {
                BeveragesDB.beverages[finalindex].priceinclvat = newvalue;
                console.log(
                    `Price of '${beverage.name}' changed to '${newvalue}'`
                );
                alert(`Price of '${beverage.name}' changed to '${newvalue}'`);
            } else {
                console.log(
                    `Value of Index = '${finalindex}', Value of Beverage = '${beverage.name}', New Value = '${newvalue}'`
                );
                finalindex = 0;
                beverage = null;
            }
        });

        $("#get-quantity-button").click(function () {
            const serialNumber = $("#refil-serial-number").val();
            inventoryItem = DatabaseAPI.Inventory.getInventory(inventoryItem);
            if (serialNumber !== "") {
                for (let index = 0; index < inventoryItem.length; index++) {
                    beverage = inventoryItem[index];
                    if (beverage.beverageNr == serialNumber) {
                        finalindex = index;
                        stocks = beverage.quantity;
                        console.log(`Beverage found: '${beverage.quantity}'`);
                        $("#quantity").empty();
                        $("#quantity").append(`<h6>${beverage.quantity}</h6>`);
                        break;
                    }
                }
            } else {
                $("#quantity").empty();
                console.log(
                    "ManagerDashboardController | Search with a valid serial number"
                );
            }
        });

        $("#refil-beverages-button").click(function () {
            const newvalue = $("#refil-beverages-figure").val();

            if (finalindex != 0 && beverage != null && newvalue != "") {
                let item = DatabaseAPI.Inventory.updateNumberInStockForBeverage(
                    beverage.beverageNr,
                    parseInt(newvalue) + parseInt(stocks)
                );
                console.log(
                    `'${newvalue}' stocks ordered for '${beverage.beverageNr}'`
                );
                alert(
                    `'${newvalue}' stocks ordered for '${beverage.beverageNr}'`
                );
            } else {
                console.log(
                    `Value of Index = '${finalindex}', Value of Beverage = '${beverage.name}', New Value = '${newvalue}'`
                );
                finalindex = 0;
                beverage = null;
            }
        });

        $(document).ready(function () {
            initMenu();
        });

        // Menu with all the inventory items to show or hide the beverage
        function initMenu() {
            const inventoryItems = DatabaseAPI.Inventory.getInventory();
            var menu = "";

            for (let i = 0; i < inventoryItems.length; i++) {
                const inventoryItem = inventoryItems[i];
                // console.log(inventoryItem.beverageNr);
                active = DatabaseAPI.ActiveCheck.getStatusOfBeverage(
                    inventoryItem.beverageNr
                );
                active == true ? (active = "Active") : (active = "Removed");
                // console.log("Status"+active);
                beverage = DatabaseAPI.Beverages.findBeverageByNr(
                    inventoryItem.beverageNr
                );
                menu =
                    menu +
                    `
                    <span id="span">
                        <span id="span-` +
                    inventoryItem.beverageNr +
                    `">
                            ${inventoryItem.beverageNr}
                            ${beverage.name}
                            ${active}
                        </span>
                        <button id="beverage-` +
                    inventoryItem.beverageNr +
                    `-button" class="beverage-show-hide-button">Show/Hide</button>
                    </span>
                    <br>
                `;
            }

            $("#add-remove-beverages").append(menu);
        }

        $(document).on("click", ".beverage-show-hide-button", function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            beverageNr = event.target.id.split("-")[1];
            DatabaseAPI.ActiveCheck.changeStatusOfBeverage(beverageNr);
            active = DatabaseAPI.ActiveCheck.getStatusOfBeverage(beverageNr);
            active == true ? (active = "Active") : (active = "Removed");
            beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            $("#span-" + beverageNr).empty();
            new_span = `
                ${beverageNr}
                ${beverage.name}
                ${active}
            `;
            $("#span-" + beverageNr).append(new_span);
        });
    });
})(jQuery, window);
