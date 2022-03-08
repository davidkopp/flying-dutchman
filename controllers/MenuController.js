/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 8th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    const inventoryName = Constants.INVENTORIES.BAR;

    $(document).ready(function () {
        //filterMenu(Constants.BEER_filter);
        initMenu();
    });

    /**
     * Filtering the item according to type
     *
     * @param {string} byType The name of type
     */
    function filterMenu(byType)
    {
        switch (byType) {
            case Constants.BEER_filter:
            case Constants.WINE_filter:
            case Constants.DRINK_filter:
            case Constants.WATER_filter:
                $("#menu-container").empty();
                initMenu(byType);
                break;
            default:
                console.log(`menu ${byType} not known.`);
                break;
        }
    }

    /** Initialize the menu with the information about the available beverages. */
    function initMenu(filterByType) {
        // TODO: Differentiate between bar and vip inventory
        const inventoryItems = DatabaseAPI.Inventory.getInventory(inventoryName);
        const hideFromMenuList = DatabaseAPI.HideFromMenu.getList();
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            const beverageNr = inventoryItem.beverageNr;

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
                    `MenuController.initMenu | The item in the inventory '${inventoryName}' with the beverage number '${beverageNr}' doesn't have enough quanities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            let beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Check if the beverage exists in the beverage db.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory '${inventoryName}' includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            /*if(typeof filterByType !== "undefined") {
                
            } else {
                
            }*/
            displayBeverageInMenu(beverage, quantity, filterByType);
        }
    }

    /**
     * Displays the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     * @param {number} quantity Number of available beverages left.
     */
    function displayBeverageInMenu(beverage, quantity, filterByType) {
        if (!beverage) {
            return;
        }

        /*if(typeof filterByType !== "undefined") {
            console.log(filterByType);
        }*/

        let optClassLowInStock;
        if (quantity < Constants.LOW_STOCK_NUMBER) {
            optClassLowInStock = "menu-item-is-low-in-stock";
        }

        var menuItemHTML = "";
        // Check type and displays the relevant information depending on the type.
        let type = beverage.category.toUpperCase();
        if (
            filterByType === Constants.BEER_filter &&
            containsAnyOf(type, Constants.BEER_CATEGORY)
        ) {
            // Beer or cider
            menuItemHTML = `<div class="item  ${optClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.producer}</li>
                    <li>${beverage.countryoforiginlandname}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.alcoholstrength}</li>
                    <li>${beverage.packaging}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="https://purepng.com/public/uploads/large/purepng.com-alcohol-bottlebottle-food-wine-object-alcohol-beverage-cocktail-liquor-whiskey-drunk-941524624582wlel2.png"
                    alt="">
            </div>`;
            
        } else if (
            filterByType === Constants.WINE_filter &&
            containsAnyOf(type, Constants.WINE_CATEGORY)
        ) {
            // Wine
            menuItemHTML = `<div class="item  ${optClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${
                        beverage.nr
                    }</li>
                    <li>${beverage.name}</li>
                    <li>${extractYearOutOfDate(beverage.introduced)}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.packaging}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="https://purepng.com/public/uploads/large/purepng.com-alcohol-bottlebottle-food-wine-object-alcohol-beverage-cocktail-liquor-whiskey-drunk-941524624582wlel2.png"
                    alt="">
            </div>`;
            
        } else if (
            filterByType === Constants.DRINK_filter &&
            containsAnyOf(type, Constants.DRINKS_CATEGORY)
        ) {
            // Cocktails / Drinks / Mixed drinks
            menuItemHTML = `<div class="item  ${optClassLowInStock}">
                    <ul>
                        <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                        <li>${beverage.name}</li>
                        <li>${beverage.category}</li>
                        <li>${beverage.alcoholstrength}</li>
                        <li>${beverage.packaging}</li>
                        <li>${beverage.priceinclvat}</li>
                    </ul>
                    <img src="https://purepng.com/public/uploads/large/purepng.com-alcohol-bottlebottle-food-wine-object-alcohol-beverage-cocktail-liquor-whiskey-drunk-941524624582wlel2.png"
                        alt="">
                </div>`;
            
        } else if ( 
            filterByType === Constants.WATER_filter && 
            containsAnyOf(type, Constants.WATER_CATEGORY)
        ) {
            // Water
            menuItemHTML = `<div class="item  ${optClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="https://purepng.com/public/uploads/large/purepng.com-alcohol-bottlebottle-food-wine-object-alcohol-beverage-cocktail-liquor-whiskey-drunk-941524624582wlel2.png"
                    alt="">
            </div>`;
            
        } else if(typeof filterByType !== "undefined" ) {

        } else {
            menuItemHTML = `<div class="item  ${optClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.alcoholstrength}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="https://purepng.com/public/uploads/large/purepng.com-alcohol-bottlebottle-food-wine-object-alcohol-beverage-cocktail-liquor-whiskey-drunk-941524624582wlel2.png"
                    alt="">
            </div>`;
            /*
            menuItemHTML = `
            <div class="menu-item menu-item-other ${optClassLowInStock}">
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
            */
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
    exports.MenuController.filterMenu = filterMenu;
    exports.MenuController.initMenu = initMenu;
    exports.MenuController.showBeverageInMenu = showBeverageInMenu;
    exports.MenuController.hideBeverageFromMenu = hideBeverageFromMenu;
})(jQuery, window);
