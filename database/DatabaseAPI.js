/*
 * File: DatabaseAPI.js
 *
 * Provides API functions for all databases: BeveragesDB and DB (includes users, orders, bills, inventory, etc.)
 *
 * Author: David Kopp
 * -----
 * Last Modified: Monday, 28th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* global DB, BeveragesDB */

DatabaseAPI = (function ($) {
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

    //=========================================================================
    // USERS
    //=========================================================================

    /**
     * Get an array with the user names of all users in our database.
     *
     * @returns {Array} The array with user names as strings.
     */
    function allUserNames() {
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
    function userDetails(userName) {
        let userCollect = [];
        let userID;
        let userIndex;
        let account;

        // First we find the user ID of the selected user. We also save the
        // index number for the record in the JSON structure.
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username == userName) {
                userID = DB.users[i].user_id;
                userIndex = i;
            }
        }

        // We get the current account status from another table in the database,
        // account. We store this in a variable here for convenience.
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id == userID) {
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
    function getUserDetailsIfCredentialsAreValid(username, password) {
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
    function changeBalance(username, newAmount) {
        let userID;

        // First we find the userID in the user data base.
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username == username) {
                userID = DB.users[i].user_id;
            }
        }

        // Then we match the userID with the account list. and change the
        // account balance.
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id == userID) {
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
    function allBeverages() {
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
    function allStrongBeverages(strength) {
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
        return copy(beverage);
    }

    /**
     * Get the beverages sorted by popularity in descending order. It uses the
     * past orders to check how many times they have been bought.
     *
     * @returns {Array} Array with objects that consists of the beverage number
     *   and a count.
     */
    function beverageNumbersSortedByPopularity() {
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
    function beverageNamesSortedByPopularity() {
        const beveragesSortedByPopularity = beverageNumbersSortedByPopularity();

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
    function beverageTypes() {
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
    function beverageTypesSortedByAlphabet() {
        let types = beverageTypes();
        return types.sort();
    }

    /**
     * Get all beverage types sorted by popularity in descending order. It uses
     * the past orders to check how many times beverages of a particular type
     * have been bought.
     *
     * @returns {Array} Array with objects that consists of the beverage type and a count
     */
    function beverageTypesSortedByPopularity() {
        let allBeveragesTypes = beverageTypes();

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
     * Convenience function to change "xx%" into the percentage in whole numbers
     * (non-strings).
     *
     * @param {string} percentStr The percentage as a string.
     * @returns {number} The percentage as a number.
     */
    function percentToNumber(percentStr) {
        return Number(percentStr.slice(0, -1));
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
        return copy(DB.orders[DB.orders.length - 1]);
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
        return copy(DB.orders.find((order) => order.id === id));
    }

    /**
     * Function to get all orders of the database.
     *
     * @returns {Array} The array with all order objects.
     */
    function getOrders() {
        return copy(DB.orders);
    }

    /**
     * Function to get all undone orders of the database.
     *
     * @returns {Array} The array with all undone order objects
     */
    function getUndoneOrders() {
        return copy(DB.orders.filter((order) => order.done === false));
    }

    /**
     * Function to save a order in the database.
     *
     * @param {object} order The order object.
     * @returns {object} The stored order object.
     */
    function saveOrder(order) {
        if (!order) {
            return undefined;
        }
        let existingOrder = getOrderById(order.id);
        if (!existingOrder) {
            // Create new order object in database
            const lastOrder = getLastOrder();
            const newId = lastOrder.id + 1;
            order.id = newId;
            DB.orders.push(order);
        } else {
            // Replace the existing order object in the database.
            existingOrder = order;
        }
        // Return a deep copy of the stored order object so the caller can't manipulate the database object.
        return copy(order);
    }

    /**
     * Function to remove an order in the database by ID.
     *
     * @param {number} id The order ID
     */
    function removeOrderById(id) {
        DB.orders = DB.orders.filter((o) => o.id != id);
    }

    //=========================================================================
    // INVENTORY
    //=========================================================================

    /**
     * Get all beverages including the information about the quantity in the
     * inventory and if they should be hidden from the menu and are set to
     * active. Note: Also beverages are included, that have a `quantity` of 0.
     *
     * @returns {Array} Array that contains all beverages in inventory.
     */
    function getInventory() {
        return copy(DB.inventory);
    }

    /**
     * Returns the inventory item for a specific beverage. Internal: No deep copy.
     *
     * @param {string} beverageNr The beverage number
     * @returns Inventory item if beverage number exists in inventory. Otherwise
     *   `undefined`
     */
    function getInventoryItemByBeverageNrInternal(beverageNr) {
        return DB.inventory.find((item) => (item.beverageNr = beverageNr));
    }

    /**
     * Returns the inventory item for a specific beverage.
     *
     * @param {string} beverageNr The beverage number
     * @returns Inventory item if beverage number exists in inventory. Otherwise
     *   `undefined`
     */
    function getInventoryItemByBeverageNr(beverageNr) {
        return copy(getInventoryItemByBeverageNrInternal(beverageNr));
    }

    /**
     * Updates the number in stock for a specific beverage. Note: The provided
     * `newQuantity` replaces the number in stock, no calculation and no check
     * for validity.
     *
     * @param {string} beverageNr The beverage number
     * @param {number} newQuantity The new quantity
     * @returns The updated inventory item
     */
    function updateNumberInStockForBeverage(beverageNr, newQuantity) {
        let inventoryItem = getInventoryItemByBeverageNrInternal(beverageNr);
        if (inventoryItem) {
            inventoryItem.quantity = newQuantity;
        }
        return copy(inventoryItem);
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
        return copy(DB.bills[DB.bills.length - 1]);
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
        return copy(DB.bills.find((bill) => bill.id === id));
    }

    function saveBill(bill) {
        if (!bill) {
            return undefined;
        }
        let existingBill = getBillById(bill.id);
        if (!existingBill) {
            // Create new bill object in database
            const lastBill = getLastBill();
            const newId = lastBill.id + 1;
            bill.id = newId;
            DB.bills.push(bill);
        } else {
            // Replace the existing bill object in the database.
            existingBill = bill;
        }
        // Return a deep copy of the stored bill object so the caller can't manipulate the database object.
        return copy(bill);
    }

    /**
     * Make functions available to others (especially controllers) Usage: e.g.
     * `DatabaseAPI.Users.getAllUserUserNames();`
     */
    return {
        Users: {
            getAllUserNames: allUserNames,
            getUserDetailsByUserName: userDetails,
            getUserDetailsIfCredentialsAreValid:
                getUserDetailsIfCredentialsAreValid,
            changeBalance: changeBalance,
        },
        Beverages: {
            findBeverageByNr: findBeverageByNr,
            getAllBeverages: allBeverages,
            getAllStrongBeverages: allStrongBeverages,
            getBeverageNumbersSortedByPopularity:
                beverageNumbersSortedByPopularity,
            getBeverageNamesSortedByPopularity: beverageNamesSortedByPopularity,
            getBeverageTypes: beverageTypes,
            getBeverageTypesSortedByAlphabet: beverageTypesSortedByAlphabet,
            getBeverageTypesSortedByPopularity: beverageTypesSortedByPopularity,
        },
        Orders: {
            getOrders: getOrders,
            getUndoneOrders: getUndoneOrders,
            getOrderById: getOrderById,
            saveOrder: saveOrder,
            removeOrderById: removeOrderById,
        },
        Bills: {
            getBillById: getBillById,
            saveBill: saveBill,
        },
        Inventory: {
            getInventory: getInventory,
            getInventoryItemByBeverageNr: getInventoryItemByBeverageNr,
            updateNumberInStockForBeverage: updateNumberInStockForBeverage,
        },
    };
})(jQuery);
