/*
 * File: DatabaseAPI.js
 *
 * Provides API functions for all databases: BeveragesDB and DB (includes users, orders, bills, inventory, etc.)
 * The functions with the suffix "Public" will be exported to the public.
 * Returned values of the "public" functions never have a direct reference to the database, so others aren't able to manipulate the database.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Thursday, 3rd March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* global DB, BeveragesDB */

DatabaseAPI = (function ($) {
    //=========================================================================
    // USERS
    //=========================================================================

    /**
     * Get an array with the user names of all users in our database.
     *
     * @returns {Array} The array with user names as strings.
     */
    function allUserNamesPublic() {
        let nameCollect = [];
        for (let i = 0; i < DB.users.length; i++) {
            nameCollect.push(DB.users[i].username);
        }
        return nameCollect;
    }

    /**
     * Get an array with some specific details about a selected user name. It
     * also includes the account status for the person.
     *
     * @param {string} userName The user name.
     * @returns {Array} Object with details about the user.
     */
    function userDetailsPublic(userName) {
        let userCollect = [];
        let userID;
        let userIndex;
        let account;

        // First we find the user ID of the selected user. We also save the
        // index number for the record in the JSON structure.
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username === userName) {
                userID = DB.users[i].user_id;
                userIndex = i;
            }
        }

        // We get the current account status from another table in the database,
        // account. We store this in a variable here for convenience.
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id === userID) {
                account = DB.account[i].creditSEK;
            }
        }

        // Add the details to an own data structure.
        userCollect.push(
            DB.users[userIndex].user_id,
            DB.users[userIndex].username,
            DB.users[userIndex].first_name,
            DB.users[userIndex].last_name,
            DB.users[userIndex].email,

            account
        );

        return userCollect;
    }

    /**
     * Checks if the given username and password are valid and if so, return the
     * user information.
     *
     * @param {string} username The user name.
     * @param {string} password The password.
     * @returns {object} The user information or `null` if the credentials are invalid.
     */
    function getUserDetailsIfCredentialsAreValidPublic(username, password) {
        let foundUser = DB.users.find((u) => u.username === username);
        if (!foundUser) {
            console.log(
                `DatabaseAPI.checkUserCredentials | User with username '${username}' does not exist in database.`
            );
            return null;
        }
        if (foundUser.password !== password) {
            console.log(
                `DatabaseAPI.checkUserCredentials | Password of user '${username}' is incorrect!`
            );
            return null;
        }

        return copy(foundUser);
    }

    //=========================================================================
    // VIP ACCOUNTING
    //=========================================================================

    /**
     * Change the credit amount in the user's account. Note that the amount
     * given as argument is the new balance and not the changed amount (± balance).
     *
     * @param {string} username The user name.
     * @param {string} newAmount The new amount.
     */
    function changeBalancePublic(username, newAmount) {
        let userID;

        // First we find the userID in the user data base.
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username === username) {
                userID = DB.users[i].user_id;
            }
        }

        // Then we match the userID with the account list. and change the
        // account balance.
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id === userID) {
                DB.account[i].creditSEK = newAmount;
            }
        }
    }

    //=========================================================================
    // Beverages
    //=========================================================================

    /**
     * Get a list of all the names (and categories) of the beverages in the database.
     *
     * @returns {Array} Array with all beverages (name + category).
     */
    function allBeveragesPublic() {
        let collector = [];

        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            collector.push([
                BeveragesDB.beverages[i].name,
                BeveragesDB.beverages[i].category,
            ]);
        }

        return collector;
    }

    /**
     * Get the names of all strong beverages (i.e. all that contain a percentage
     * of alcohol higher than the strength given in percent.
     *
     * @param {number} strength The alcohol strength.
     * @returns {Array} Array with the beverages.
     */
    function allStrongBeveragesPublic(strength) {
        let collector = [];

        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            // We check if the percentage alcohol strength stored in the
            // database is lower than the given limit strength. If the limit is
            // set to 14, also liqueuers are listed.
            if (
                percentToNumber(BeveragesDB.beverages[i].alcoholstrength) >
                strength
            ) {
                collector.push([
                    BeveragesDB.beverages[i].name,
                    BeveragesDB.beverages[i].category,
                ]);
            }
        }

        return collector;
    }

    /**
     * Finds a beverage by number in the database and returns it.
     *
     * @param {string} beverageNr Number of the beverage
     * @returns {object} Beverage object or undefined
     */
    function findBeverageByNr(beverageNr) {
        const beverage = BeveragesDB.beverages.find(
            (beverage) => beverage.nr === beverageNr
        );
        return beverage;
    }

    /**
     * Finds a beverage by number in the database and returns it.
     *
     * @param {string} beverageNr Number of the beverage
     * @returns {object} Beverage object or undefined
     */
    function findBeverageByNrPublic(beverageNr) {
        return copy(findBeverageByNr(beverageNr));
    }

    /**
     * Get the beverages sorted by popularity in descending order. It uses the
     * past orders to check how many times they have been bought.
     *
     * @returns {Array} Array with objects that consists of the beverage number
     *   and a count.
     */
    function beverageNumbersSortedByPopularityPublic() {
        let collectorWithCount = {};

        // Get the beverages from the order database and count them.
        for (let i = 0; i < DB.orders.length; i++) {
            const order = DB.orders[i];
            const beveragesInOrder = order.items.map((item) => item.nr);
            for (let j = 0; j < beveragesInOrder.length; j++) {
                const beverageNr = beveragesInOrder[j];
                if (
                    Object.prototype.hasOwnProperty.call(
                        collectorWithCount,
                        beverageNr
                    )
                ) {
                    collectorWithCount[beverageNr]++;
                } else {
                    collectorWithCount[beverageNr] = 1;
                }
            }
        }

        // Sort the beverages by count (create an array first, then sort it)
        let collectorSortable = [];
        for (let beverageNr in collectorWithCount) {
            collectorSortable.push({
                beverageNr: beverageNr,
                count: collectorWithCount[beverageNr],
            });
        }
        collectorSortable.sort(function (a, b) {
            return b.count - a.count;
        });

        return collectorSortable;
    }

    /**
     * Get beverage names sorted by popularity in descending order. It uses the
     * past orders to check how many times they have been bought.
     *
     * @returns {Array} Array with beverages names
     */
    function beverageNamesSortedByPopularityPublic() {
        const beveragesSortedByPopularity =
            beverageNumbersSortedByPopularityPublic();

        // Create a new collection out of it that only consists of the beverages name
        let collectorWithBeverageName = [];
        for (let i = 0; i < beveragesSortedByPopularity.length; i++) {
            const beverageNr = beveragesSortedByPopularity[i].beverageNr;
            let beverage = findBeverageByNr(beverageNr);
            if (beverage) {
                collectorWithBeverageName.push(beverage.name);
            } else {
                console.log(`Beverage with nr '${beverageNr}' is unknown!`);
            }
        }

        return collectorWithBeverageName;
    }

    /**
     * Get all beverage types we have in our database.
     *
     * @returns {Array} Array with all beverages types as strings.
     */
    function beverageTypesPublic() {
        let types = [];
        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            addToSet(types, BeveragesDB.beverages[i].category);
        }
        return types;
    }

    /**
     * Get all beverage types we have in our database in an alphabetical order.
     *
     * @returns {Array} Array with all beverages types sorted alphabetically.
     */
    function beverageTypesSortedByAlphabetPublic() {
        let types = beverageTypesPublic();
        return types.sort();
    }

    /**
     * Get all beverage types sorted by popularity in descending order. It uses
     * the past orders to check how many times beverages of a particular type
     * have been bought.
     *
     * @returns {Array} Array with objects that consists of the beverage type and a count
     */
    function beverageTypesSortedByPopularityPublic() {
        let allBeveragesTypes = beverageTypesPublic();

        // Create data structure with all existing beverage types
        let collectorWithTypeAndCount = {};
        for (let i = 0; i < allBeveragesTypes.length; i++) {
            const beverageType = allBeveragesTypes[i];
            collectorWithTypeAndCount[beverageType] = 0;
        }

        // Collect all beverages from the orders and count them.
        for (let i = 0; i < DB.orders.length; i++) {
            const order = DB.orders[i];
            const beveragesInOrder = order.items.map((item) => item.nr);
            for (let j = 0; j < beveragesInOrder.length; j++) {
                const beverageNr = beveragesInOrder[j];
                const beverage = findBeverageByNr(beverageNr);
                if (beverage) {
                    const beverageType = beverage.category;
                    if (
                        Object.prototype.hasOwnProperty.call(
                            collectorWithTypeAndCount,
                            beverageType
                        )
                    ) {
                        collectorWithTypeAndCount[beverageType]++;
                    } else {
                        collectorWithTypeAndCount[beverageType] = 1;
                    }
                } else {
                    console.log(`Beverage with nr '${beverageNr}' is unknown!`);
                }
            }
        }

        // Sort the beverage types by count (create an array first)
        let collectorSortable = [];
        for (let beverageType in collectorWithTypeAndCount) {
            collectorSortable.push({
                beverageType: beverageType,
                count: collectorWithTypeAndCount[beverageType],
            });
        }
        collectorSortable.sort(function (a, b) {
            return b.count - a.count;
        });

        return collectorSortable;
    }

    //=========================================================================
    // ORDERS
    //=========================================================================

    /**
     * Returns the last order in the database.
     *
     * @returns {object} Order object
     */
    function getLastOrder() {
        return DB.orders[DB.orders.length - 1];
    }

    /**
     * Function to get an order of the database with an ID.
     *
     * @param {number} id ID of an order
     * @returns {object} The order object, or `undefined` if there is no order
     *   with this id.
     */
    function getOrderById(id) {
        if (!id) {
            return undefined;
        }
        return DB.orders.find((order) => order.id === id);
    }

    /**
     * Function to get an order of the database with an ID.
     *
     * @param {number} id ID of an order
     * @returns {object} The order object, or `undefined` if there is no order
     *   with this id.
     */
    function getOrderByIdPublic(id) {
        return copy(getOrderById(id));
    }

    /**
     * Function to get all orders of the database.
     *
     * @returns {Array} The array with all order objects.
     */
    function getOrdersPublic() {
        return copy(DB.orders);
    }

    /**
     * Function to get all undone orders of the database.
     *
     * @returns {Array} The array with all undone order objects
     */
    function getUndoneOrdersPublic() {
        return copy(DB.orders.filter((order) => order.done === false));
    }

    /**
     * Function to save a order in the database.
     *
     * @param {object} order The order object.
     * @returns {object} The stored order object.
     */
    function saveOrderPublic(order) {
        if (!order) {
            return undefined;
        }
        let result;
        let existingOrder = getOrderById(order.id);
        if (!existingOrder) {
            // Create new order object in database
            const lastOrder = getLastOrder();
            const newId = lastOrder.id + 1;
            order.id = newId;
            DB.orders.push(order);
            result = order;
        } else {
            // Replace the existing order object in the database.
            const indexOf = DB.orders.indexOf(existingOrder);
            DB.orders[indexOf] = order;
            result = DB.orders[indexOf];
        }
        // Return a deep copy of the stored order object so the caller can't manipulate the database object.
        return copy(result);
    }

    /**
     * Function to remove an order in the database by ID.
     *
     * @param {number} id The order ID
     */
    function removeOrderByIdPublic(id) {
        DB.orders = DB.orders.filter((o) => o.id != id);
    }

    //=========================================================================
    // INVENTORY
    //=========================================================================

    /**
     * Get all beverages including the information about the quantity in the
     * desired inventory and if they should be hidden from the menu and are set
     * to active. Note: Also beverages are included, that have a `quantity` of 0.
     *
     * @param {string} inventoryName The name of the inventory (`barInventory`
     *   or `vipInventory`)
     * @returns {Array} Array that contains all beverages in inventory.
     */
    function getInventoryPublic(inventoryName) {
        return copy(DB[inventoryName]);
    }

    /**
     * Returns the inventory item for a specific beverage. Internal: No deep copy.
     *
     * @param {string} inventoryName The name of the inventory (`barInventory`
     *   or `vipInventory`)
     * @param {string} beverageNr The beverage number
     * @returns {object} Inventory item if beverage number exists in inventory.
     *   Otherwise `undefined`
     */
    function getInventoryItemByBeverageNr(inventoryName, beverageNr) {
        return DB[inventoryName].find((item) => item.beverageNr === beverageNr);
    }

    /**
     * Returns the inventory item for a specific beverage.
     *
     * @param {string} inventoryName The name of the inventory (`barInventory`
     *   or `vipInventory`)
     * @param {string} beverageNr The beverage number
     * @returns {object} Inventory item if beverage number exists in inventory.
     *   Otherwise `undefined`
     */
    function getInventoryItemByBeverageNrPublic(inventoryName, beverageNr) {
        return copy(getInventoryItemByBeverageNr(inventoryName, beverageNr));
    }

    /**
     * Updates the number in stock for a specific beverage. Note: The provided
     * `newQuantity` replaces the number in stock, no calculation and no check
     * for validity.
     *
     * @param {string} inventoryName The name of the inventory (`barInventory`
     * @param {string} beverageNr The beverage number
     * @param {number} newQuantity The new quantity
     * @returns {object} The updated inventory item
     */
    function updateNumberInStockForBeveragePublic(
        inventoryName,
        beverageNr,
        newQuantity
    ) {
        let inventoryItem = getInventoryItemByBeverageNr(
            inventoryName,
            beverageNr
        );
        if (inventoryItem) {
            inventoryItem.quantity = newQuantity;
        }
        return copy(inventoryItem);
    }

    //=========================================================================
    // HIDE FROM MENU
    //=========================================================================

    /**
     * Returns the list of beverages that should be hidden in the menu.
     *
     * @returns {Array} The array with beverages numbers
     */
    function getHideFromMenuListPublic() {
        return copy(DB.hideFromMenu);
    }

    /**
     * Adds a beverage number to the "hideFromMenu" list.
     *
     * @param {string} beverageNr The beverage number.
     */
    function addBeverageNrToListPublic(beverageNr) {
        if (!beverageNr) {
            return;
        }

        DB.hideFromMenu = addToSet(DB.hideFromMenu, beverageNr);
    }

    /**
     * Removes a beverage number from the "hideFromMenu" list.
     *
     * @param {string} beverageNr The beverage number.
     */
    function removeBeverageNrFromListPublic(beverageNr) {
        if (!beverageNr) {
            return;
        }

        DB.hideFromMenu = removeFromArray(DB.hideFromMenu, beverageNr);
    }

    //=========================================================================
    // ACTIVE/NOT-ACTIVE
    //=========================================================================

    /**
     * Gets the status of a beverage (active: true/false)
     *
     * @param {string} beverageNr The beverage number.
     */
    function getStatusOfBeverage(beverageNr) {
        if (!beverageNr) {
            console.log("DatabaseAPI | Enter a valid Beverage Number");
            return;
        }
        var beverage = getInventoryItemByBeverageNr(beverageNr);
        return beverage.active;
    }

    /**
     * Changes the status of a beverage (active: true/false)
     *
     * @param {string} beverageNr The beverage number.
     */
    function changeStatusOfBeverage(beverageNr) {
        var active = DatabaseAPI.ActiveCheck.getStatusOfBeverage(beverageNr);

        for (let index = 0; index < DB.inventory.length; index++) {
            if (DB.inventory[index].beverageNr == beverageNr) {
                DB.inventory[index].active = !active;
            }
        }

        // var beverage = getInventoryItemByBeverageNrInternal(beverageNr);
        // active == true ? beverage.active = false : beverage.active = true;
        // beverage.active = !active;
    }

    //=========================================================================
    // BILLS
    //=========================================================================

    /**
     * Returns the last bill in the database.
     *
     * @returns {object} Bill object
     */
    function getLastBill() {
        return DB.bills[DB.bills.length - 1];
    }

    /**
     * Get a bill by its id.
     *
     * @param {number} id The bill id.
     * @returns {object} The bill object.
     */
    function getBillById(id) {
        if (!id) {
            return undefined;
        }
        return DB.bills.find((bill) => bill.id === id);
    }

    /**
     * Get a bill by its id.
     *
     * @param {number} id The bill id.
     * @returns {object} The bill object.
     */
    function getBillByIdPublic(id) {
        return copy(getBillById(id));
    }

    /**
     * Saves a bill to the database.
     *
     * @param {object} bill The bill object.
     * @returns {object} The stored bill object.
     */
    function saveBillPublic(bill) {
        if (!bill) {
            return undefined;
        }
        let result;
        let existingBill = getBillById(bill.id);
        if (!existingBill) {
            // Create new bill object in database
            const lastBill = getLastBill();
            const newId = lastBill.id + 1;
            bill.id = newId;
            DB.bills.push(bill);
            result = bill;
        } else {
            // Replace the existing bill object in the database.
            // Replace the existing order object in the database.
            const indexOf = DB.bills.indexOf(existingBill);
            DB.bills[indexOf] = bill;
            result = DB.bills[indexOf];
        }
        // Return a deep copy of the stored bill object so the caller can't manipulate the database object.
        return copy(result);
    }

    //=========================================================================
    // HELPER FUNCTIONS
    //=========================================================================

    /**
     * Creates a deep copy of an given object or array. If it's not an object or
     * an array it returns the parameter.
     *
     * @param {object} obj The object or array to copy
     * @returns {object} The copied object or array
     */
    function copy(obj) {
        if (Array.isArray(obj)) {
            return $.extend(true, [], obj);
        }
        if (typeof obj === "object") {
            return $.extend(true, {}, obj);
        }
        return obj;
    }

    /**
     * Adds an item to a set, only if the item is not already there. The set is
     * modelled using an array.
     *
     * @param {Array} set The set.
     * @param {object} item The item.
     * @returns {Array} Set that contains the item.
     */
    function addToSet(set, item) {
        if (!set.includes(item)) {
            set.push(item);
        }
        return set;
    }

    /**
     * Removes an item from an array (or set).
     *
     * @param {Array} array The array.
     * @param {object} item The item.
     * @returns {Array} Array without the item.
     */
    function removeFromArray(array, item) {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
        return array;
    }

    /**
     * Convenience function to change "xx%" into the percentage in whole numbers
     * (non-strings).
     *
     * @param {string} percentStr The percentage as a string.
     * @returns {number} The percentage as a number.
     */
    function percentToNumber(percentStr) {
        return Number(percentStr.slice(0, -1));
    }

    /**
     * Make functions available to others (especially controllers) Usage: e.g.
     * `DatabaseAPI.Users.getAllUserUserNames();`
     */
    return {
        Users: {
            getAllUserNames: allUserNamesPublic,
            getUserDetailsByUserName: userDetailsPublic,
            getUserDetailsIfCredentialsAreValid:
                getUserDetailsIfCredentialsAreValidPublic,
            changeBalance: changeBalancePublic,
        },
        Beverages: {
            findBeverageByNr: findBeverageByNrPublic,
            getAllBeverages: allBeveragesPublic,
            getAllStrongBeverages: allStrongBeveragesPublic,
            getBeverageNumbersSortedByPopularity:
                beverageNumbersSortedByPopularityPublic,
            getBeverageNamesSortedByPopularity:
                beverageNamesSortedByPopularityPublic,
            getBeverageTypes: beverageTypesPublic,
            getBeverageTypesSortedByAlphabet:
                beverageTypesSortedByAlphabetPublic,
            getBeverageTypesSortedByPopularity:
                beverageTypesSortedByPopularityPublic,
        },
        Orders: {
            getOrders: getOrdersPublic,
            getUndoneOrders: getUndoneOrdersPublic,
            getOrderById: getOrderByIdPublic,
            saveOrder: saveOrderPublic,
            removeOrderById: removeOrderByIdPublic,
        },
        Bills: {
            getBillById: getBillByIdPublic,
            saveBill: saveBillPublic,
        },
        Inventory: {
            getInventory: getInventoryPublic,
            getInventoryItemByBeverageNr: getInventoryItemByBeverageNrPublic,
            updateNumberInStockForBeverage:
                updateNumberInStockForBeveragePublic,
        },
        HideFromMenu: {
            getList: getHideFromMenuListPublic,
            addBeverageNrToList: addBeverageNrToListPublic,
            removeBeverageNrFromList: removeBeverageNrFromListPublic,
        },
        ActiveCheck: {
            getStatusOfBeverage: getStatusOfBeverage,
            changeStatusOfBeverage: changeStatusOfBeverage,
        },
    };
})(jQuery);
