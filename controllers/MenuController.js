/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp, Paarth Sanhotra, Abdullah Abdullah
 */
/* globals LanguageController, EffectsController */

(function ($, exports) {
    /**
     * The variable 'lastUsedMenuConfig' saves the last used used menu config to
     * be able to reuse it when a filter is set.
     */
    let lastUsedMenuConfig;

    /**
     * The variables typeFilter, allergies, price_range, tannin, alcohol_range
     * are used to store the current filters dynamically and change the menu on
     * each filter's click.
     */
    let typeFilter;
    let allergyItem = "";
    let allergies = {
        Milk: false,
        Nuts: false,
        Gluten: false,
        Sulphite: false,
    };
    let price_range = [];
    let tannin = false;
    let alcohol_range = [];

    $(document).ready(function () {
        initMenuWithDefaultConfig();

        //Reload the menu with the selected values of the allergies
        $(".allergy-item").click(function () {
            allergyItem = $(this).attr("value");

            switch (allergyItem) {
                case "Milk":
                    if (allergies.Milk == false) allergies.Milk = true;
                    else if (allergies.Milk == true) allergies.Milk = false;
                    break;

                case "Nuts":
                    if (allergies.Nuts == false) allergies.Nuts = true;
                    else if (allergies.Nuts == true) allergies.Nuts = false;
                    break;

                case "Gluten":
                    if (allergies.Gluten == false) allergies.Gluten = true;
                    else if (allergies.Gluten == true) allergies.Gluten = false;
                    break;

                case "Sulphite":
                    if (allergies.Sulphite == false) allergies.Sulphite = true;
                    else if (allergies.Sulphite == true)
                        allergies.Sulphite = false;
                    break;

                default:
                    console.log(
                        `MenuController | Allergy '${allergyItem}' not defined!`
                    );
            }

            refreshMenu();

            // If filter is active, make it visible in the view.
            let isFilterActive = false;
            for (const allergy in allergies) {
                if (Object.hasOwnProperty.call(allergies, allergy)) {
                    const value = allergies[allergy];
                    if (value == true) {
                        // Filter is active!
                        isFilterActive = true;
                    }
                }
            }

            // If filter is active, make it visible in the view.
            const $button = $(this).closest("button");
            if (isFilterActive) {
                $button.addClass("filter-active");
            } else {
                $button.removeClass("filter-active");
            }
        });

        //Reload the menu with the selected value of the price filters
        $(".price-range").click(function () {
            price_range = [];

            if ($(this).attr("value") != "all") {
                price_range = $(this).attr("value").split("-");
                price_range[0] = parseFloat(price_range[0]);
                price_range[1] = parseFloat(price_range[1]);
            }

            refreshMenu();

            // If filter is active, make it visible in the view.
            const $button = $(this).closest("button");
            if (price_range.length > 0) {
                $button.addClass("filter-active");
            } else {
                $button.removeClass("filter-active");
            }
        });

        //Reload the menu with the selected value of the alcohol percentage filters
        $(".alcohol-range").click(function () {
            alcohol_range = [];

            if ($(this).attr("value") != "all") {
                alcohol_range = $(this).attr("value").split("-");
                alcohol_range[0] = parseFloat(alcohol_range[0]);
                alcohol_range[1] = parseFloat(alcohol_range[1]);
            }
            refreshMenu();

            // If filter is active, make it visible in the view.
            const $button = $(this).closest("button");
            if (alcohol_range.length > 0) {
                $button.addClass("filter-active");
            } else {
                $button.removeClass("filter-active");
            }
        });

        //Reload the menu with the tannin filters
        $(".tannin").click(function () {
            if (tannin == false) tannin = true;
            else if (tannin == true) tannin = false;

            refreshMenu();

            // If filter is active, make it visible in the view.
            const $button = $(this).closest("button");
            if (tannin == true) {
                $button.addClass("filter-active");
            } else {
                $button.removeClass("filter-active");
            }
        });
    });

    /**
     * Filter the beverages according to the type and show them in the menu.
     *
     * @param {string} newTypeFilter The name of the new type filter.
     */
    function filterMenuByType(newTypeFilter) {
        if (newTypeFilter === typeFilter) {
            // Reset the type filter
            typeFilter = null;
        } else {
            switch (newTypeFilter) {
                case Constants.BEER_filter:
                case Constants.WINE_filter:
                case Constants.DRINK_filter:
                case Constants.WATER_filter:
                    typeFilter = newTypeFilter;
                    break;
                default:
                    console.log(
                        `MenuController | Beverage type '${newTypeFilter}' is unknown.`
                    );
                    break;
            }
        }
        refreshMenu();
    }

    /** Initializes the menu with the default config for normal customers. */
    function initMenuWithDefaultConfig() {
        const menuConfig = {
            viewElementId: "menu-container",
            inventory: Constants.INVENTORIES.BAR,
        };
        initMenu(menuConfig);
    }

    /**
     * Refreshes the menu in the view by reinitializes it. It uses the same
     * filters as before.
     */
    function refreshMenu() {
        initMenu(lastUsedMenuConfig);
    }

    /**
     * Initialize the menu with the information about the available beverages.
     * The config object is used to know which inventory should be used and
     * where in the view the menu items should be placed. With the optional
     * filter argument it's possible to only show one specific type.
     *
     * @param {object} config The config object for the initialization.
     */
    function initMenu(config) {
        if (!config || !config.viewElementId || !config.inventory) {
            console.log(
                "MenuController | Invalid config for initializing the menu! Required properties are `viewElementId` and `inventory`."
            );
        }
        console.log(
            `MenuController | Start initializing the menu with items from the '${config.inventory}' ` +
                (typeFilter
                    ? `with the type filter '${typeFilter}'.`
                    : `without a type filter.`) +
                " Config: " +
                JSON.stringify(config)
        );

        const $viewMenuContainer = $(`#${config.viewElementId}`);
        if ($viewMenuContainer.length == 0) {
            console.log(
                `MenuController | View element with id '${config.viewElementId}' does not exist! Can't initialize menu.`
            );
            return;
        }

        // At first remove the currently shown menu.
        $viewMenuContainer.empty();

        // Save the config to be able to reuse it, e.g. when a filter is set.
        lastUsedMenuConfig = config;

        const inventoryItems = DatabaseAPI.Inventory.getInventory(
            config.inventory
        );
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
                    `MenuController.initMenu | The item in the inventory '${config.inventory}' with the beverage number '${beverageNr}' doesn't have enough quantities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            const beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Make sure that the beverage actually exists in the beverage database.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory '${config.inventory}' includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            // Check if the beverage fit the tannins filter
            if (tannin == true) {
                const beveragesWithTannin =
                    DatabaseAPI.Beverages.getBeveragesWithTannins();
                if ($.inArray(beverageNr, beveragesWithTannin) > -1) {
                    continue;
                }
            }

            // Check if the beverage fit the price filter
            if (
                price_range &&
                price_range.length > 0 &&
                (price_range[0] > parseFloat(beverage.priceinclvat) ||
                    parseFloat(beverage.priceinclvat) > price_range[1])
            ) {
                continue;
            }

            // Check if the beverage fit the alcohol percentage filter
            if (
                (alcohol_range &&
                    alcohol_range.length > 0 &&
                    alcohol_range[0] >
                        parseFloat(
                            beverage.alcoholstrength.substring(
                                0,
                                beverage.alcoholstrength.length - 1
                            )
                        )) ||
                parseFloat(
                    beverage.alcoholstrength.substring(
                        0,
                        beverage.alcoholstrength.length - 1
                    )
                ) > alcohol_range[1]
            ) {
                continue;
            }

            const allergiesList = DatabaseAPI.Beverages.getAllergiesList();
            // Check if the beverages fit the sulphite filter
            if (allergies.Sulfite == true) {
                const beveragesWithSulfite = allergiesList.find(
                    (obj) => obj.name === "sulfite"
                ).beverages;
                if ($.inArray(beverageNr, beveragesWithSulfite) > -1) {
                    continue;
                }
            }

            // Check if the beverages fit the gluten filter
            if (allergies.Gluten == true) {
                const beveragesWithGluten = allergiesList.find(
                    (obj) => obj.name === "gluten"
                ).beverages;
                if ($.inArray(beverageNr, beveragesWithGluten) > -1) {
                    continue;
                }
            }

            // Check if the beverages fit the milk filter
            if (allergies.Milk == true) {
                const beveragesWithMilk = allergiesList.find(
                    (obj) => obj.name === "milk"
                ).beverages;
                if ($.inArray(beverageNr, beveragesWithMilk) > -1) {
                    continue;
                }
            }

            // Check if the beverages fit the nuts filter
            if (allergies.Nuts == true) {
                const beveragesWithNuts = allergiesList.find(
                    (obj) => obj.name === "nuts"
                ).beverages;
                if ($.inArray(beverageNr, beveragesWithNuts) > -1) {
                    continue;
                }
            }

            const beverageInfoHtml = getHtmlForMenuItem(
                beverage,
                typeFilter,
                config.allowDragItems
            );
            $viewMenuContainer.append(beverageInfoHtml);
        }

        EffectsController.updateFilterIconsInView(typeFilter);

        // Refresh all text strings
        LanguageController.refreshTextStrings();
    }

    /**
     * Creates the html string to display the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     * @param {string} typeFilter The optional type filter.
     * @param {boolean} allowDragItems The optional boolean value for allowing
     *   dragging of the items.
     * @returns {string} The html to display the menu item.
     */
    function getHtmlForMenuItem(beverage, typeFilter, allowDragItems) {
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
            (!typeFilter || typeFilter === Constants.BEER_filter)
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
                    dataLangKeyForLabel: "",
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
            (!typeFilter || typeFilter === Constants.WINE_filter)
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
                    dataLangKeyForLabel: "",
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
            (!typeFilter || typeFilter === Constants.DRINK_filter)
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
                    dataLangKeyForLabel: "",
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
            (!typeFilter || typeFilter === Constants.WATER_filter)
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
                    dataLangKeyForLabel: "",
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
        } else if (!typeFilter) {
            // Unknown type and no filter is set → Show some basic information of the beverage
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
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

        // E.g. when a filter is set, there is nothing to display → do nothing.
        if (!relevantInfoToDisplay) {
            return;
        }

        // Finally create the html for the menu item.
        let menuItemInfoHTML = "";
        for (const key in relevantInfoToDisplay) {
            if (Object.hasOwnProperty.call(relevantInfoToDisplay, key)) {
                const infoObject = relevantInfoToDisplay[key];
                const optDataLangHtml = infoObject.dataLangKeyForLabel
                    ? `data-lang="${infoObject.dataLangKeyForLabel}"`
                    : "";

                menuItemInfoHTML += `
                <div class="menu-item-info ${infoObject.classToAdd}">
                    <span class="menu-item-info-label" ${optDataLangHtml}></span>
                    <span>${infoObject.value} ${
                    infoObject.suffix ? infoObject.suffix : ""
                }</span>
                </div>
                `;
            }
        }

        let menuItemHTML = "";
        if (!allowDragItems) {
            menuItemHTML = `
            <div
                id="item-${beverage.nr}"
                data-beverage-nr="${beverage.nr}"
                class="item">
                <div>
                    ${menuItemInfoHTML}
                </div>
                <img src="${imageSource}" alt="">
            </div>
            `;
        } else {
            // Item should be draggable: Add respective info to the menu item so it will be draggable
            menuItemHTML = `
            <div
                id="item-${beverage.nr}"
                data-beverage-nr="${beverage.nr}"
                class="item drag-items"
                draggable=true
                ondragstart="dragItem(event)">
                <div>
                    ${menuItemInfoHTML}
                </div>
                <img draggable="false" src="${imageSource}" alt="">
            </div>
            `;
        }
        return menuItemHTML;
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
    exports.MenuController.filterMenuByType = filterMenuByType;
    exports.MenuController.initMenu = initMenu;
})(jQuery, window);
