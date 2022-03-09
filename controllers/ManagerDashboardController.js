/*
 * File: ManagerDashboardController.js
 *
 * The Manager's Dashboard Controller.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Wednesday, 9th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals LanguageController */

(function ($, exports) {
    $(document).ready(function () {
        // Hide the divs at the beginning
        $("#revise-amounts").hide();
        $("#refil-beverages").hide();
        $("#add-remove-beverages").hide();

        // Add event handlers
        $("#revise-amounts-label").click(function () {
            // Show / Hide div "revise amounts"
            $("#revise-amounts").toggle();
        });
        $("#refil-beverages-label").click(function () {
            // Show / Hide div "refill beverages"
            $("#refil-beverages").toggle();
        });
        $("#add-remove-beverages-label").click(function () {
            // Show / Hide div "add / remove beverages"
            $("#add-remove-beverages").toggle();

            if ($("#add-remove-beverages").is(":visible")) {
                showMenuWithStatus();
            }
        });

        $("#get-price-button").click(showPrice);

        $("#revise-price-button").click(revicePrice);

        $("#get-quantity-button").click(showQuantity);
    });

    /** Event handler that show the price of the given beverage number. */
    function showPrice() {
        const inputSerialNumber = $("#price-serial-number").val();
        if (!inputSerialNumber) {
            return;
        }

        const serialNumber = inputSerialNumber.trim();
        const beverage = DatabaseAPI.Beverages.findBeverageByNr(serialNumber);
        if (beverage) {
            $("#price").empty();
            $("#price").append(
                `<span class="price">${parseFloat(
                    beverage.priceinclvat
                ).toFixed(2)}</span>`
            );
        } else {
            // TODO: Display to the user that the beverage number does not exist.
            console.log(
                `ManagerDashboardController | Beverage with number ${inputSerialNumber} does not exist!`
            );
        }
    }

    /** Event handler that changes the price of a beverage accordingly to the input fields. */
    function revicePrice() {
        const inputSerialNumber = $("#price-serial-number").val();
        const inputNewValue = $("#revise-price-figure").val();

        if (!inputSerialNumber) {
            return;
        }
        const serialNumber = inputSerialNumber.trim();
        const newValue = parseFloat(inputNewValue.trim());
        if (isNaN(newValue)) {
            // TODO: Display error to user.
            console.log(
                `Provided value '${inputNewValue}' is not a valid number!`
            );
            return;
        }

        DatabaseAPI.Beverages.setPriceOfBeverage(serialNumber, newValue);

        // Update the displayed price, so their is no confusion.
        showPrice();
    }

    /** Event handler to show the quantity of a given beverage. */
    function showQuantity() {
        const inputSerialNumber = $("#refil-serial-number").val();
        if (!inputSerialNumber) {
            return;
        }
        const serialNumber = inputSerialNumber.trim();

        const inventoryNames = Object.values(Constants.INVENTORIES);
        var collector = [];
        inventoryNames.forEach((inventoryName) => {
            const inventoryItem =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    inventoryName,
                    serialNumber
                );
            if (inventoryItem) {
                collector.push({
                    inventoryName: inventoryName,
                    beverageNr: serialNumber,
                    quantity: inventoryItem.quantity,
                });
            }
        });
        if (collector.length === 0) {
            // Beverage does not exist in any inventory!

            // TODO: Display to the user that the beverage number does not exist.
            console.log(
                `ManagerDashboardController | Item with beverage number ${inputSerialNumber} does not exist in any inventory!`
            );
            return;
        }

        let htmlTable = `<table>
            <tr>
                <th>Inventory</th>
                <th>Quantity</th>
                <th>Order Stocks</th>
                <th></th>
            </tr>
        `;

        collector.forEach((obj) => {
            htmlTable += `<tr>
                <td ${Constants.DATA_LANG_DYNAMIC_KEY}="inventory-name-dynamic"
                    ${Constants.DATA_LANG_DYNAMIC_VALUE}=${obj.inventoryName}></td>
                <td>${obj.quantity}</td>
                <td>
                    <input type="number" id="refill-beverages-input-${obj.inventoryName}-${obj.beverageNr}" name="refill-beverages-input" class="refill-beverages-input" />

                </td>
                <td><button class="refil-beverages-button" onclick="refillBeverages('${obj.inventoryName}', '${obj.beverageNr}', ${obj.quantity})">Confirm</button></td>
            </tr>`;
        });
        htmlTable += "</table>";

        $("#quantity").html(htmlTable);

        // Refresh all text strings
        LanguageController.refreshTextStrings();
    }

    /**
     * Event handler to refill the beverages.
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     * @param {number} currentQuantity The current quantity.
     */
    function refillBeverages(inventoryName, beverageNr, currentQuantity) {
        if (!inventoryName || !beverageNr) {
            return;
        }
        if (isNaN(currentQuantity)) {
            console.log(
                `Given quantity '${currentQuantity}' of beverage number '${beverageNr}' is not valid!`
            );
            return;
        }

        const inputAddQuantity = $(
            `#refill-beverages-input-${inventoryName}-${beverageNr}`
        ).val();
        const addQuantity = parseInt(inputAddQuantity.trim());
        if (isNaN(addQuantity)) {
            // TODO: Display error to user.
            console.log(
                `Provided value '${inputAddQuantity}' is not a valid number!`
            );
            return;
        }

        const newQuantity = addQuantity + currentQuantity;
        let item = DatabaseAPI.Inventory.updateNumberInStockForBeverage(
            inventoryName,
            beverageNr,
            newQuantity
        );
        console.log(
            `'${addQuantity}' stocks ordered for '${item.beverageNr}' in inventory '${inventoryName}'. New number in stock: ${item.quantity}`
        );

        // Update view
        showQuantity();
    }

    /** Menu with all the inventory items to show or hide the beverage */
    function showMenuWithStatus() {
        let htmlTable = `<table>
            <tr>
                <th>Inventory</th>
                <th>Beverage number</th>
                <th>Name</th>
                <th>Status</th>
                <th></th>
            </tr>
        `;

        const inventoryNames = Object.values(Constants.INVENTORIES);

        inventoryNames.forEach((inventoryName) => {
            const inventoryItems =
                DatabaseAPI.Inventory.getInventory(inventoryName);

            inventoryItems.forEach((inventoryItem) => {
                const beverage = DatabaseAPI.Beverages.findBeverageByNr(
                    inventoryItem.beverageNr
                );
                const active = DatabaseAPI.ActiveCheck.getStatusOfBeverage(
                    inventoryName,
                    inventoryItem.beverageNr
                );

                const statusHTML = `
                <span id='status-text-${inventoryName}-${inventoryItem.beverageNr}'
                ${Constants.DATA_LANG_DYNAMIC_KEY}="beverage-status-dynamic"
                ${Constants.DATA_LANG_DYNAMIC_VALUE}=${active}>
                    ...
                </span>`;

                const buttonHTML = `
                <button class="beverage-show-hide-button"
                    onclick="beverageShowHide('${inventoryName}', '${inventoryItem.beverageNr}')">
                    <span id="show-hide-button-text-${inventoryName}-${inventoryItem.beverageNr}"
                    ${Constants.DATA_LANG_DYNAMIC_KEY}="beverage-status-button-dynamic"
                    ${Constants.DATA_LANG_DYNAMIC_VALUE}=${active}>
                        ...
                    </span>
                </button>`;

                htmlTable += `
                <tr>
                <td ${Constants.DATA_LANG_DYNAMIC_KEY}="inventory-name-dynamic" ${Constants.DATA_LANG_DYNAMIC_VALUE}="${inventoryName}">...</td>
                <td>${beverage.nr}</td>
                <td>${beverage.name}</td>
                <td>${statusHTML}</td>
                <td>${buttonHTML}</td>
                </tr>`;
            });
        });
        htmlTable += "</table>";

        $("#add-remove-beverages").append(htmlTable);

        // Refresh all text strings
        LanguageController.refreshTextStrings();
    }

    /**
     * Event handler for the show-hide buttons.
     *
     * @param {string} inventoryName The inventory name.
     * @param {any} beverageNr The beverage name.
     */
    function beverageShowHide(inventoryName, beverageNr) {
        const newStatus = DatabaseAPI.ActiveCheck.changeStatusOfBeverage(
            inventoryName,
            beverageNr
        );

        $(`#status-text-${inventoryName}-${beverageNr}`).attr(
            Constants.DATA_LANG_DYNAMIC_VALUE,
            newStatus
        );
        $(`#show-hide-button-text-${inventoryName}-${beverageNr}`).attr(
            Constants.DATA_LANG_DYNAMIC_VALUE,
            newStatus
        );

        // Refresh the dynamic text strings so the true / false values will be replaced with adaquate text strings.
        LanguageController.refreshDynamicTextStrings();
    }

    exports.refillBeverages = refillBeverages;
    exports.beverageShowHide = beverageShowHide;
})(jQuery, window);
