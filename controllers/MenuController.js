/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 22nd March 2022
 * Modified By: Paarth Sanhotra (paarthsanhotra@gmail.com)
 */
/* globals LanguageController, EffectsController */

(function ($, exports) {
    /**
     * The variable `lastUsedFilter` stores the current used filter to be able
     * to reset the filter and changing the icon of the filters.
     * The variables allergies, price_range, tannin, alcohol_range are used to
     * store the second set of filters dynamically and change the menu on each
     * filter's click.
     */
    let lastUsedFilter;
    let allergyItem = '';
    let allergies = {
        Milk:false,
        Nuts:false,
        Gluten:false,
        Sulphite:false
    };
    let price_range = [];
    let tannin = false;
    let alcohol_range = [];

    $(document).ready(function () {
        initMenu();

        //Reload the menu with the selected values of the allergies
        $(".allergy-item").click(function ()
        {
            allergyItem = $(this).attr("value")

            switch(allergyItem)
            {
                case "Milk":
                    if(allergies.Milk == false)
                        allergies.Milk = true;
                    else if(allergies.Milk == true)
                        allergies.Milk = false;
                    break;

                case "Nuts":
                    if(allergies.Nuts == false)
                        allergies.Nuts = true;
                    else if(allergies.Nuts == true)
                        allergies.Nuts = false;
                    break;

                case "Gluten":
                    if(allergies.Gluten == false)
                        allergies.Gluten = true;
                    else if(allergies.Gluten == true)
                        allergies.Gluten = false;
                    break;

                case "Sulphite":
                    if(allergies.Sulphite == false)
                        allergies.Sulphite = true;
                    else if(allergies.Sulphite == true)
                        allergies.Sulphite = false;
                    break;

                default: console.log("Allergy not defined.");
            }

            console.log(allergies);

            initMenu(lastUsedFilter);
        });

        //Reload the menu with the selected value of the price filters
        $(".price-range").click(function ()
        {
            price_range = [];

            if($(this).attr("value") != 'all')
            {
                price_range = $(this).attr("value").split('-');
                price_range[0] = parseFloat(price_range[0]);
                price_range[1] = parseFloat(price_range[1]);
                console.log("Price Range selected: "+price_range);
            }
            initMenu(lastUsedFilter);
        });

        //Reload the menu with the selected value of the alcohol percentage filters
        $(".alcohol-range").click(function ()
        {
            alcohol_range = [];

            if($(this).attr("value") != 'all')
            {
                alcohol_range = $(this).attr("value").split('-');
                alcohol_range[0] = parseFloat(alcohol_range[0]);
                alcohol_range[1] = parseFloat(alcohol_range[1]);
                console.log("Alcohol Range selected: "+alcohol_range);
            }
            initMenu(lastUsedFilter);
        });

        //Reload the menu with the tannin filters
        $(".tannin").click(function (){
            if(tannin == false)
                tannin = true;
            else if(tannin == true)
                tannin = false;
            console.log("Tannins filter on: "+tannin);
            initMenu(lastUsedFilter);
        });
    });



    /**
     * Filter the beverages according to the type and show them in the menu.
     *
     * @param {string} byType The name of the filter type.
     */
    function filterMenu(byType) {
        if (byType === lastUsedFilter) {
            // Reset the filter
            initMenu();
        } else {
            switch (byType) {
                case Constants.BEER_filter:
                case Constants.WINE_filter:
                case Constants.DRINK_filter:
                case Constants.WATER_filter:
                    initMenu(byType);
                    break;
                default:
                    console.log(
                        `MenuController | Beverage type '${byType}' is unknown.`
                    );
                    break;
            }
        }
    }

    /**
     * Initialize the menu with the information about the available beverages in
     * the bar inventory. With the optional filter argument it's possible to
     * only show one specific type.
     *
     * @param {string} filterByType The optional filter.
     */
    function initMenu(filterByType) {
        const inventoryName = Constants.INVENTORIES.BAR;
        console.log(
            `MenuController | Start initializing the menu with items from the '${inventoryName}' ` +
                (filterByType
                    ? `with the filter '${filterByType}'.`
                    : `without a filter.`)
        );



        // At first remove the currently shown menu.
        $("#menu-container").empty();

        lastUsedFilter = filterByType;

        const inventoryItems =
            DatabaseAPI.Inventory.getInventory(inventoryName);
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            const beverageNr = inventoryItem.beverageNr;

            // Check if the inventory item is marked as "visible in menu". If not, skip it.
            if (inventoryItem.visibleInMenu !== true) {
                continue;
            }
            // Check if the inventory item is set to `active`. If not, skip it.
            if (inventoryItem.active === false) {
                continue;
            }

            // Check if we have enough beverages left in the inventory. If not, skip it.
            const quantity = inventoryItem.quantity;
            if (!quantity || quantity < 1) {
                console.log(
                    `MenuController.initMenu | The item in the inventory '${inventoryName}' with the beverage number '${beverageNr}' doesn't have enough quantities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            const beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Check if the beverage exists in the beverage db.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory '${inventoryName}' includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            // Check if the beverages fit the tannins filter
            if(tannin == true && jQuery.inArray(beverageNr, DB.tannins) > 0)
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the price filter
            if(price_range[0] > parseInt(beverage.priceinclvat) ||
               parseInt(beverage.priceinclvat) > price_range[1])
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the alcohol percentage filter
            if(alcohol_range[0] > parseInt(beverage.alcoholstrength.substring(0, beverage.alcoholstrength.length-1)) ||
               parseInt(beverage.alcoholstrength.substring(0, beverage.alcoholstrength.length-1)) > alcohol_range[1])
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the sulphite filter
            if(allergies.Sulfite == true && jQuery.inArray(beverageNr, DB.allergies[0].beverages) > -1)
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the gluten filter
            if(allergies.Gluten == true && jQuery.inArray(beverageNr, DB.allergies[1].beverages) > -1)
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the milk filter
            if(allergies.Milk == true && jQuery.inArray(beverageNr, DB.allergies[2].beverages) > -1)
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            // Check if the beverages fit the nuts filter
            if(allergies.Nuts == true && jQuery.inArray(beverageNr, DB.allergies[3].beverages) > -1)
            {
                console.log("Skipping the beverage "+beverageNr+" from the list");
                continue;
            }

            displayBeverageInMenu(beverage, quantity, filterByType);
        }

        EffectsController.updateFilterIconsInView(lastUsedFilter);

        // Refresh all text strings
        LanguageController.refreshTextStrings();
    }

    /**
     * Displays the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     * @param {number} quantity Number of available beverages left.
     * @param {string} filterByType The optional type filter.
     */
    function displayBeverageInMenu(beverage, quantity, filterByType) {
        if (!beverage) {
            return;
        }

        // Check type and displays the relevant information depending on the type.
        // If a filter is defined, use the filter and check if the type matches the filter.
        const type = beverage.category.toUpperCase();
        let relevantInfoToDisplay;
        let imageSource = "";
        if (
            containsAnyOf(type, Constants.BEER_CATEGORY) &&
            (!filterByType || filterByType === Constants.BEER_filter)
        ) {
            // Beer or cider
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "menu-item-label-category",
                    classToAdd: "menu-item-category",
                },
                producer: {
                    value: beverage.producer,
                    dataLangKeyForLabel: "menu-item-label-producer",
                    classToAdd: "",
                },
                country: {
                    value: beverage.countryoforiginlandname,
                    dataLangKeyForLabel: "menu-item-label-origin",
                    classToAdd: "",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_beer.png";
        } else if (
            containsAnyOf(type, Constants.WINE_CATEGORY) &&
            (!filterByType || filterByType === Constants.WINE_filter)
        ) {
            // Wine
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "menu-item-label-category",
                    classToAdd: "menu-item-category",
                },
                year: {
                    value: extractYearOutOfDate(beverage.introduced),
                    dataLangKeyForLabel: "menu-item-label-year",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_wine.png";
        } else if (
            containsAnyOf(type, Constants.DRINKS_CATEGORY) &&
            (!filterByType || filterByType === Constants.DRINK_filter)
        ) {
            // Cocktails / Drinks / Mixed drinks
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "menu-item-label-category",
                    classToAdd: "menu-item-category",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_drink.png";
        } else if (
            containsAnyOf(type, Constants.WATER_CATEGORY) &&
            (!filterByType || filterByType === Constants.WATER_filter)
        ) {
            // Water
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "menu-item-label-category",
                    classToAdd: "menu-item-category",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_water.png";
        } else if (!filterByType) {
            // Unknown type and no filter is set → Show some basic information of the beverage
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "menu-item-label-category",
                    classToAdd: "menu-item-category",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_others.png";
        }

        // E.g. when a filter is set, don't display anything for this beverage.
        if (!relevantInfoToDisplay) {
            return;
        }

        let menuItemInfoHTML = "";
        for (const key in relevantInfoToDisplay) {
            if (Object.hasOwnProperty.call(relevantInfoToDisplay, key)) {
                const infoObject = relevantInfoToDisplay[key];
                menuItemInfoHTML += `
                <div class="menu-item-info ${infoObject.classToAdd}">
                    <span class="menu-item-info-label" data-lang="${
                        infoObject.dataLangKeyForLabel
                    }"></span>
                    <span>${infoObject.value} ${
                    infoObject.suffix ? infoObject.suffix : ""
                }</span>
                </div>
                `;
            }
        }

        const menuItemHTML = `
        <div data-beverage-nr="${beverage.nr}" class="item">
            <div>
                ${menuItemInfoHTML}
            </div>
            <img src="${imageSource}" alt="">
        </div>
        `;

        $("#menu-container").append(menuItemHTML);
    }

    /**
     * Refreshes the menu in the view by reinitializes it. It uses the same
     * filter as before (could be `undefined`).
     */
    function refreshMenu() {
        initMenu(lastUsedFilter);
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
})(jQuery, window);
