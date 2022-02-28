/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Monday, 28th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    $(document).ready(function () {
        initMenu();
    });

    /** Initialize the menu with the information about the available beverages. */
    function initMenu() {
        const inventoryItems = DatabaseAPI.Inventory.getInventory();
        const hideFromMenuList = DatabaseAPI.HideFromMenu.getList();
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            let beverageNr = inventoryItem.beverageNr;

            // Check if the beverage number is marked as "hide from menu". If so, skip it.
            if (hideFromMenuList.includes(beverageNr)) {
                console.log(
                    `MenuController.initMenu | The inventory item with the beverage number '${beverageNr}' is included in the "hideFromMenu" list. Don't show it in the menu.`
                );
                continue;
            }
            // Check if the inventory item is set to `active`. If not, skip it.
            if (inventoryItem.active === false) {
                console.log(
                    `MenuController.initMenu | The inventory item with the beverage number '${beverageNr}' has the "active" property set to '${inventoryItem.active}'. Don't show it in the menu.`
                );
                continue;
            }

            // Check if we have enough beverages left in the inventory. If not, skip it.
            let quantity = inventoryItem.quantity;
            if (!quantity || quantity < 1) {
                console.log(
                    `MenuController.initMenu | The inventory item with the beverage number '${beverageNr}' doesn't have enough quanities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            let beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Check if the beverage exists in the beverage db.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            displayBeverageInMenu(beverage);
        }
    }

    /**
     * Displays the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     */
    function displayBeverageInMenu(beverage) {
        if (!beverage) {
            return;
        }

        var menuItemHTML = "";
        // Check type and displays the relevant information depending on the type.
        let type = beverage.category.toUpperCase();
        if (containsAnyOf(type, Constants.BEER_CATEGORY)) {
            // Beer or cider
            menuItemHTML = `
            <div class="menu-item menu-item-beer">
                <span class="menu-item-property menu-item-id hidden">
                ${beverage.nr}
                </span>
                <span class="menu-item-property menu-item-name">
                ${beverage.name}
                </span>
                <br/>
                <span class="menu-item-property menu-item-producer">
                ${beverage.producer}
                </span>
                <br/>
                <span class="menu-item-property menu-item-country">
                ${beverage.countryoforiginlandname}
                </span>
                <br/>
                <span class="menu-item-property menu-item-type">
                ${beverage.category}
                </span>
                <br/>
                <span class="menu-item-property menu-item-alcoholstrength">
                ${beverage.alcoholstrength}
                </span>
                <br/>
                <span class="menu-item-property menu-item-servingsize">
                ${beverage.packaging}
                </span>
                <br/>
                <span class="menu-item-property menu-item-price">
                ${beverage.priceinclvat}
                </span>
            </div>
            `;
        } else if (containsAnyOf(type, Constants.WINE_CATEGORY)) {
            // Wine
            menuItemHTML = `
            <div class="menu-item menu-item-wine">
                <span class="menu-item-property menu-item-id hidden">
                ${beverage.nr}
                </span>
                <span class="menu-item-property menu-item-name">
                ${beverage.name}
                </span>
                <br/>
                <span class="menu-item-property menu-item-year">
                ${extractYearOutOfDate(beverage.introduced)}
                </span>
                <br/>
                <span class="menu-item-property menu-item-producer">
                ${beverage.producer}
                </span>
                <br/>
                <span class="menu-item-property menu-item-type">
                ${beverage.category}
                </span>
                <br/>
                <!-- TODO: Separate grape out of type
                <span class="menu-item-property menu-item-grape">
                </span>
                <br/> -->
                <span class="menu-item-property menu-item-servingsize">
                ${beverage.packaging}
                </span>
                <br/>
                <span class="menu-item-property menu-item-price">
                ${beverage.priceinclvat}
                </span>
            </div>
            `;
        } else if (containsAnyOf(type, Constants.DRINKS_CATEGORY)) {
            // Cocktails / Drinks / Mixed drinks
            menuItemHTML = `
            <div class="menu-item menu-item-drink">
                <span class="menu-item-property menu-item-id hidden">
                ${beverage.nr}
                </span>
                <span class="menu-item-property menu-item-name">
                ${beverage.name}
                </span>
                <br/>
                <span class="menu-item-property menu-item-type">
                ${beverage.category}
                </span>
                <br/>
                <span class="menu-item-property menu-item-alcoholstrength">
                ${beverage.alcoholstrength}
                </span>
                <br/>
                <span class="menu-item-property menu-item-servingsize">
                ${beverage.packaging}
                </span>
                <br/>
                <!-- TODO: Include incredients
                <span class="menu-item-property menu-item-ingredients">
                </span>
                <br/> -->
                <span class="menu-item-property menu-item-price">
                ${beverage.priceinclvat}
                </span>
            </div>
            `;
        } else if (containsAnyOf(type, Constants.WATER_CATEGORY)) {
            // Water
            menuItemHTML = `
            <div class="menu-item menu-item-water">
                <span class="menu-item-property menu-item-id hidden">
                ${beverage.nr}
                </span>
                <span class="menu-item-property menu-item-name">
                ${beverage.name}
                </span>
                <br/>
                <span class="menu-item-property menu-item-type">
                ${beverage.category}
                </span>
                <br/>
                <span class="menu-item-property menu-item-price">
                ${beverage.priceinclvat}
                </span>
            </div>
            `;
        } else {
            console.log(
                `MenuController.displayBeverageInMenu | Beverage with number '${beverage.nr}' has an unknown type '${beverage.category}'! Display some basic info that could be relevant...`
            );
            menuItemHTML = `
            <div class="menu-item menu-item-other">
                <span class="menu-item-property menu-item-id hidden">
                ${beverage.nr}
                </span>
                <span class="menu-item-property menu-item-name">
                ${beverage.name}
                </span>
                <br/>
                <span class="menu-item-property menu-item-type">
                ${beverage.category}
                </span>
                <br/>
                <span class="menu-item-property menu-item-alcoholstrength">
                ${beverage.alcoholstrength}
                </span>
                <br/>
                <span class="menu-item-property menu-item-price">
                ${beverage.priceinclvat}
                </span>
            </div>
            `;
        }

        $("#menu-container").append(menuItemHTML);
    }

    /**
     * Refreshes the menu in the view by removing all child notes from the menu
     * container and reinitializes it.
     */
    function refreshMenu() {
        $("#menu-container").empty();
        initMenu();
    }

    /**
     * Removes a beverage from the list "hideFromMenu" and refreshes the menu in the view.
     *
     * @param {string} beverageNr The beverage number.
     */
    function showBeverageInMenu(beverageNr) {
        DatabaseAPI.HideFromMenu.removeBeverageNrFromList(beverageNr);
        refreshMenu();
    }

    /**
     * Adds a beverage to the list "hideFromMenu" and refreshes the menu in the view.
     *
     * @param {string} beverageNr The beverage number.
     */
    function hideBeverageFromMenu(beverageNr) {
        DatabaseAPI.HideFromMenu.addBeverageNrToList(beverageNr);
        refreshMenu();
    }

    /**
     * Checks if a text includes substrings given by an array.
     *
     * @param {string} text The text to check
     * @param {string} array The array with multiple substrings
     * @returns {boolean} `true` if the text includes at least one of the
     *   substrings inside the array
     */
    function containsAnyOf(text, array) {
        return array.some((substring) => text.includes(substring));
    }

    /**
     * Extracts the year out of the date.
     *
     * @param {string} dateString The date as a string.
     * @returns {string} The year.
     */
    function extractYearOutOfDate(dateString) {
        return new Date(dateString).getFullYear();
    }

    exports.MenuController = {};
    exports.MenuController.initMenu = initMenu;
    exports.MenuController.showBeverageInMenu = showBeverageInMenu;
    exports.MenuController.hideBeverageFromMenu = hideBeverageFromMenu;
})(jQuery, window);
