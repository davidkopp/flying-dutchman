/*
 * File: DatabaseAPI.js
 *
 * Provides API functions for all databases: BeveragesDB and DB (includes users, orders, bills, inventory, etc.).
 * Returned values of the "public" functions never have a direct reference to the database, so others aren't able to manipulate the database.
 *
 * Author: David Kopp
 */
/* global DB, BeveragesDB */

DatabaseAPI = (function () {
    /**
     * Either the browsers `localStorage` or `sessionStorage` is used to store
     * the databases. If the constant `STORAGE_TYPE` is defined and equals
     * 'session', `sessionStorage` is used, otherwise `localStorage` (default).
     */
    const storage =
        Constants.STORAGE_TYPE == "session" ? sessionStorage : localStorage;

    /**
     * Returns the object for the key from the storage. The 'short-circuit
     * evaluation' ensures that the function returns `null` immediately if the
     * key is not in storage and there will be no error.
     *
     * @param {string} key The key.
     * @returns {object} The object.
     */
    function getObject(key) {
        var value = storage.getItem(key);
        return value && JSON.parse(value);
    }

    /**
     * Saves the object for the key into the storage.
     *
     * @param {string} key The key.
     * @param {object} value The object.
     */
    function saveObject(key, value) {
        storage.setItem(key, JSON.stringify(value));
    }

    /**
     * Removes the object with the given key from the storage.
     *
     * @param {string} key The key.
     */
    function removeObject(key) {
        storage.removeItem(key);
    }

    /** Load all databases into the storage when they don't exist yet. */
    function loadDatabases() {
        if (!getObject(Constants.STORAGE_DB_USERS_KEY)) {
            saveObject(Constants.STORAGE_DB_USERS_KEY, DB.users);
        }
        if (!getObject(Constants.STORAGE_DB_ACCOUNT_KEY)) {
            saveObject(Constants.STORAGE_DB_ACCOUNT_KEY, DB.account);
        }
        if (!getObject(Constants.STORAGE_DB_ORDERS_KEY)) {
            saveObject(Constants.STORAGE_DB_ORDERS_KEY, DB.orders);
        }
        if (!getObject(Constants.STORAGE_DB_BILLS_KEY)) {
            saveObject(Constants.STORAGE_DB_BILLS_KEY, DB.bills);
        }
        if (!getObject(Constants.STORAGE_DB_TANNINS_KEY)) {
            saveObject(Constants.STORAGE_DB_TANNINS_KEY, DB.tannins);
        }
        if (!getObject(Constants.STORAGE_DB_ALLERGIES_KEY)) {
            saveObject(Constants.STORAGE_DB_ALLERGIES_KEY, DB.allergies);
        }
        if (!getObject(Constants.STORAGE_DB_INVENTORY_BAR_KEY)) {
            saveObject(Constants.STORAGE_DB_INVENTORY_BAR_KEY, DB.barInventory);
        }
        if (!getObject(Constants.STORAGE_DB_INVENTORY_VIP_KEY)) {
            saveObject(Constants.STORAGE_DB_INVENTORY_VIP_KEY, DB.vipInventory);
        }
        if (!getObject(Constants.STORAGE_DB_BEVERAGES_KEY)) {
            saveObject(
                Constants.STORAGE_DB_BEVERAGES_KEY,
                BeveragesDB.beverages
            );
        }
    }
    loadDatabases();

    /** Cleans up the databases by removing everything. */
    function cleanup() {
        removeObject(Constants.STORAGE_DB_USERS_KEY);
        removeObject(Constants.STORAGE_DB_ACCOUNT_KEY);
        removeObject(Constants.STORAGE_DB_ORDERS_KEY);
        removeObject(Constants.STORAGE_DB_BILLS_KEY);
        removeObject(Constants.STORAGE_DB_TANNINS_KEY);
        removeObject(Constants.STORAGE_DB_ALLERGIES_KEY);
        removeObject(Constants.STORAGE_DB_INVENTORY_BAR_KEY);
        removeObject(Constants.STORAGE_DB_INVENTORY_VIP_KEY);
        removeObject(Constants.STORAGE_DB_BEVERAGES_KEY);
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
        const users = getObject(Constants.STORAGE_DB_USERS_KEY);
        for (let i = 0; i < users.length; i++) {
            nameCollect.push(users[i].username);
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
    function userDetailsByUserName(userName) {
        const users = getObject(Constants.STORAGE_DB_USERS_KEY);
        const account = getObject(Constants.STORAGE_DB_ACCOUNT_KEY);

        let userID;
        let userIndex;
        let userAccount;

        // First we find the user ID of the selected user. We also save the
        // index number for the record in the JSON structure.
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === userName) {
                userID = users[i].user_id;
                userIndex = i;
            }
        }

        // We get the current account status from another table in the database,
        // account. We store this in a variable here for convenience.
        for (let i = 0; i < account.length; i++) {
            if (account[i].user_id === userID) {
                userAccount = account[i].creditSEK;
            }
        }

        // Create an own data structure with the details and return it.
        return {
            user_id: users[userIndex].user_id,
            username: users[userIndex].username,
            first_name: users[userIndex].first_name,
            last_name: users[userIndex].last_name,
            email: users[userIndex].email,
            creditSEK: userAccount,
        };
    }

    /**
     * Searches for users by checking multiple properties: username, first name,
     * last name and email address. Returns all users that have something in
     * common with the search text.
     *
     * @param {string} searchText Text to search for.
     * @returns {Array} Array with users objects.
     */
    function searchForUsers(searchText) {
        if (!searchText || typeof searchText != "string") {
            return;
        }
        const users = getObject(Constants.STORAGE_DB_USERS_KEY);

        let foundUsers = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let foundUser;
            if (
                user.username.toLowerCase().includes(searchText.toLowerCase())
            ) {
                foundUser = user;
            } else if (
                user.first_name.toLowerCase().includes(searchText.toLowerCase())
            ) {
                foundUser = user;
            } else if (
                user.last_name.toLowerCase().includes(searchText.toLowerCase())
            ) {
                foundUser = user;
            } else if (
                user.email.toLowerCase().includes(searchText.toLowerCase())
            ) {
                foundUser = user;
            }

            if (foundUser) {
                foundUsers.push({
                    user_id: foundUser.user_id,
                    username: foundUser.username,
                    first_name: foundUser.first_name,
                    last_name: foundUser.last_name,
                    email: foundUser.email,
                    credentials: foundUser.credentials,
                });
            }
        }

        return foundUsers;
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
        const users = getObject(Constants.STORAGE_DB_USERS_KEY);

        let foundUser = users.find((u) => u.username === username);
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

        return foundUser;
    }

    //=========================================================================
    // VIP ACCOUNTING
    //=========================================================================

    /**
     * Get the credit amount in the user's account.
     *
     * @param {number} userId The user id.
     * @returns {number} The credit amount.
     */
    function getBalanceByUserId(userId) {
        const accounts = getObject(Constants.STORAGE_DB_ACCOUNT_KEY);

        let creditSEK;
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].user_id === userId) {
                creditSEK = accounts[i].creditSEK;
                break;
            }
        }
        return creditSEK;
    }

    /**
     * Change the credit amount in the user's account. Note that the amount
     * given as argument is the new balance and not the changed amount (?? balance).
     *
     * @param {string} username The user name.
     * @param {string} newAmount The new amount.
     */
    function changeBalance(username, newAmount) {
        const users = getObject(Constants.STORAGE_DB_USERS_KEY);
        const accounts = getObject(Constants.STORAGE_DB_ACCOUNT_KEY);

        let userID;

        // First we find the userID in the user data base.
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                userID = users[i].user_id;
            }
        }

        // Then we match the userID with the account list and change the
        // account balance.
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].user_id === userID) {
                accounts[i].creditSEK = newAmount;
            }
        }
        saveObject(Constants.STORAGE_DB_ACCOUNT_KEY, accounts);
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
        const beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);

        let collector = [];

        for (let i = 0; i < beverages.length; i++) {
            collector.push({
                id: beverages[i].nr,
                name: beverages[i].name,
                price: beverages[i].priceinclvat,
                strength: beverages[i].alcoholstrength,
            });
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
        const beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);

        let collector = [];

        for (let i = 0; i < beverages.length; i++) {
            // We check if the percentage alcohol strength stored in the
            // database is lower than the given limit strength. If the limit is
            // set to 14, also liqueuers are listed.
            if (percentToNumber(beverages[i].alcoholstrength) > strength) {
                collector.push([beverages[i].name, beverages[i].category]);
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
        const beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);
        const beverage = beverages.find(
            (beverage) => beverage.nr === beverageNr
        );
        return beverage;
    }

    /**
     * Searches for beverages by checking multiple properties: nr, name,
     * category and producer. Returns all users that have something in common
     * with the search text.
     *
     * @param {string} searchText Text to search for.
     * @returns {Array} Array with beverages objects.
     */
    function searchForBeverage(searchText) {
        if (!searchText || typeof searchText != "string") {
            return;
        }
        const beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);

        let foundBeverages = [];
        for (let i = 0; i < beverages.length; i++) {
            const beverage = beverages[i];
            let foundBeverage;
            if (beverage.nr.toLowerCase().includes(searchText.toLowerCase())) {
                foundBeverage = beverage;
            } else if (
                beverage.name.toLowerCase().includes(searchText.toLowerCase())
            ) {
                foundBeverage = beverage;
            } else if (
                beverage.category
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            ) {
                foundBeverage = beverage;
            } else if (
                beverage.producer
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            ) {
                foundBeverage = beverage;
            }

            if (foundBeverage) {
                foundBeverages.push(foundBeverage);
            }
        }

        return foundBeverages;
    }

    /**
     * Get the beverages sorted by popularity in descending order. It uses the
     * past orders to check how many times they have been bought.
     *
     * @returns {Array} Array with objects that consists of the beverage number
     *   and a count.
     */
    function beverageNumbersSortedByPopularity() {
        const orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);

        let collectorWithCount = {};

        // Get the beverages from the order database and count them.
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
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
        const beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);

        let types = [];
        for (let i = 0; i < beverages.length; i++) {
            addToSet(types, beverages[i].category);
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
        const orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);

        let allBeveragesTypes = beverageTypes();

        // Create data structure with all existing beverage types
        let collectorWithTypeAndCount = {};
        for (let i = 0; i < allBeveragesTypes.length; i++) {
            const beverageType = allBeveragesTypes[i];
            collectorWithTypeAndCount[beverageType] = 0;
        }

        // Collect all beverages from the orders and count them.
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
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
     * Updates the price of a beverage. Note: No validation is made if the price
     * makes sense.
     *
     * @param {string} beverageNr The beverage number.
     * @param {number} newPrice The new price as a float number.
     */
    function setPriceOfBeverage(beverageNr, newPrice) {
        if (!beverageNr || !newPrice) {
            return;
        }
        let beverages = getObject(Constants.STORAGE_DB_BEVERAGES_KEY);
        let beverage = beverages.find((beverage) => beverage.nr === beverageNr);
        if (!beverage) {
            return;
        }
        // Update price of beverage
        beverage.priceinclvat = newPrice;
        saveObject(Constants.STORAGE_DB_BEVERAGES_KEY, beverages);
    }

    /**
     * Returns the list of beverages numbers that include tannins.
     *
     * @returns {Array} List of beverage numbers.
     */
    function getBeveragesWithTannins() {
        return getObject(Constants.STORAGE_DB_TANNINS_KEY);
    }

    /**
     * Returns the list of allergies objects including information about the
     * allergy name and beverage numbers.
     *
     * @returns {Array} List of allergies objects.
     */
    function getAllergiesList() {
        return getObject(Constants.STORAGE_DB_ALLERGIES_KEY);
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
        const orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);

        return orders[orders.length - 1];
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
        const orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);
        return orders.find((order) => order.id === id);
    }

    /**
     * Function to get all orders of the database.
     *
     * @returns {Array} The array with all order objects.
     */
    function getOrders() {
        return getObject(Constants.STORAGE_DB_ORDERS_KEY);
    }

    /**
     * Function to get all undone orders of the database.
     *
     * @returns {Array} The array with all undone order objects
     */
    function getUndoneOrders() {
        const orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);
        return orders.filter((order) => order.done === false);
    }

    /**
     * Overwrite all orders in the database.
     *
     * @param {Array} orders The array with all order objects.
     */
    function saveOrders(orders) {
        saveObject(Constants.STORAGE_DB_ORDERS_KEY, orders);
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

        let orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);
        const indexOf = orders.findIndex((o) => o.id === order.id);
        if (indexOf < 0) {
            // Create new order object in database
            let lastOrderId = 0;
            const lastOrder = getLastOrder();
            if (lastOrder) {
                lastOrderId = lastOrder.id;
            }
            const newId = lastOrderId + 1;
            order.id = newId;
            orders.push(order);
        } else {
            // Replace the existing order object in the database.
            orders[indexOf] = order;
        }
        saveOrders(orders);
        return getOrderById(order.id);
    }

    /**
     * Function to remove an order in the database by ID.
     *
     * @param {number} id The order ID
     */
    function removeOrderById(id) {
        let orders = getObject(Constants.STORAGE_DB_ORDERS_KEY);
        orders = orders.filter((o) => o.id != id);
        saveOrders(orders);
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
    function getInventory(inventoryName) {
        switch (inventoryName) {
            case Constants.INVENTORIES.BAR:
                return getObject(Constants.STORAGE_DB_INVENTORY_BAR_KEY);

            case Constants.INVENTORIES.VIP:
                return getObject(Constants.STORAGE_DB_INVENTORY_VIP_KEY);

            default:
                console.log(
                    "DatabaseAPI.getInventory | Unknown inventory '" +
                        inventoryName +
                        "'!"
                );
                return undefined;
        }
    }

    /**
     * Overwrites the inventory in the database.
     *
     * @param {string} inventoryName The name of the inventory (`barInventory`
     *   or `vipInventory`)
     * @param {object} inventory The inventory.
     */
    function saveInventory(inventoryName, inventory) {
        switch (inventoryName) {
            case Constants.INVENTORIES.BAR:
                saveObject(Constants.STORAGE_DB_INVENTORY_BAR_KEY, inventory);
                break;

            case Constants.INVENTORIES.VIP:
                saveObject(Constants.STORAGE_DB_INVENTORY_VIP_KEY, inventory);
                break;

            default:
                console.log(
                    "DatabaseAPI.saveInventory | Unknown inventory '" +
                        inventoryName +
                        "'!"
                );
        }
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
    function getInventoryItemByBeverageNr(inventoryName, beverageNr) {
        const inventory = getInventory(inventoryName);
        return inventory.find((item) => item.beverageNr === beverageNr);
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
    function updateNumberInStockForBeverage(
        inventoryName,
        beverageNr,
        newQuantity
    ) {
        let inventory = getInventory(inventoryName);
        let inventoryItem = inventory.find(
            (item) => item.beverageNr === beverageNr
        );
        if (inventoryItem) {
            inventoryItem.quantity = newQuantity;
        }
        saveInventory(inventoryName, inventory);
        return getInventoryItemByBeverageNr(inventoryName, beverageNr);
    }

    //=========================================================================
    // VISIBILITY IN MENU
    //=========================================================================

    /**
     * Gets the menu visibility status of a beverage from a specific inventory.
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     * @returns {boolean} Visibility status of the beverage (visible: true/false).
     */
    function getVisibilityStatusOfBeverage(inventoryName, beverageNr) {
        const inventoryItem = getInventoryItemByBeverageNr(
            inventoryName,
            beverageNr
        );
        return inventoryItem.visibleInMenu;
    }

    /**
     * Mark a beverage from a specific inventory as visible in the menu.
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     */
    function setBeverageToVisible(inventoryName, beverageNr) {
        let inventory = getInventory(inventoryName);
        let inventoryItem = inventory.find(
            (item) => item.beverageNr === beverageNr
        );
        inventoryItem.visibleInMenu = true;
        saveInventory(inventoryName, inventory);
    }

    /**
     * Mark a beverage from a specific inventory as hidden in the menu.
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     */
    function setBeverageToHidden(inventoryName, beverageNr) {
        let inventory = getInventory(inventoryName);
        let inventoryItem = inventory.find(
            (item) => item.beverageNr === beverageNr
        );
        inventoryItem.visibleInMenu = false;
        saveInventory(inventoryName, inventory);
    }

    //=========================================================================
    // ACTIVE/NOT-ACTIVE
    //=========================================================================

    /**
     * Gets the status of a beverage in a specific inventory (active: true/false)
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     * @returns {boolean} Status of the beverage (active: true/false).
     */
    function getStatusOfBeverage(inventoryName, beverageNr) {
        const beverage = getInventoryItemByBeverageNr(
            inventoryName,
            beverageNr
        );
        return beverage.active;
    }

    /**
     * Changes the status of a beverage (active: true/false)
     *
     * @param {string} inventoryName The inventory name.
     * @param {string} beverageNr The beverage number.
     * @returns {boolean} The new status.
     */
    function changeStatusOfBeverage(inventoryName, beverageNr) {
        let inventory = getInventory(inventoryName);
        let inventoryItem = inventory.find(
            (item) => item.beverageNr === beverageNr
        );
        if (inventoryItem) {
            inventoryItem.active = !inventoryItem.active;
        }
        saveInventory(inventoryName, inventory);
        const updatedInventoryItem = getInventoryItemByBeverageNr(
            inventoryName,
            beverageNr
        );
        return updatedInventoryItem.active;
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
        const bills = getObject(Constants.STORAGE_DB_BILLS_KEY);
        return bills[bills.length - 1];
    }

    /**
     * Get all bills.
     *
     * @returns {Array} The bills.
     */
    function getBills() {
        return getObject(Constants.STORAGE_DB_BILLS_KEY);
    }

    /**
     * Overwrites all bills.
     *
     * @param {Array} bills The bills.
     */
    function saveBills(bills) {
        saveObject(Constants.STORAGE_DB_BILLS_KEY, bills);
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
        const bills = getObject(Constants.STORAGE_DB_BILLS_KEY);
        return bills.find((bill) => bill.id === id);
    }

    /**
     * Saves a bill to the database.
     *
     * @param {object} bill The bill object.
     * @returns {object} The stored bill object.
     */
    function saveBill(bill) {
        if (!bill) {
            return undefined;
        }
        let bills = getObject(Constants.STORAGE_DB_BILLS_KEY);
        const indexOf = bills.findIndex((b) => b.id === bill.id);
        if (indexOf < 0) {
            // Create new bill object in database
            let lastBillId = 0;
            const lastBill = getLastBill();
            if (lastBill) {
                lastBillId = lastBill.id;
            }
            const newId = lastBillId + 1;
            bill.id = newId;
            bills.push(bill);
        } else {
            // Replace the existing bill object in the database.
            bills[indexOf] = bill;
        }
        saveBills(bills);
        return getBillById(bill.id);
    }

    //=========================================================================
    // HELPER FUNCTIONS
    //=========================================================================

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

    /**
     * Make functions available to others (especially controllers) Usage: e.g.
     * `DatabaseAPI.Users.getAllUserUserNames();`
     */
    return {
        cleanup: cleanup,
        Users: {
            getAllUserNames: allUserNames,
            getUserDetailsByUserName: userDetailsByUserName,
            getUserDetailsIfCredentialsAreValid:
                getUserDetailsIfCredentialsAreValid,
            changeBalance: changeBalance,
            getBalanceByUserId: getBalanceByUserId,
            searchForUsers: searchForUsers,
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
            setPriceOfBeverage: setPriceOfBeverage,
            searchForBeverage: searchForBeverage,
            getBeveragesWithTannins: getBeveragesWithTannins,
            getAllergiesList: getAllergiesList,
        },
        Orders: {
            getOrders: getOrders,
            getUndoneOrders: getUndoneOrders,
            getOrderById: getOrderById,
            saveOrders: saveOrders,
            saveOrder: saveOrder,
            removeOrderById: removeOrderById,
        },
        Bills: {
            getBillById: getBillById,
            saveBill: saveBill,
            getBills: getBills,
            saveBills: saveBills,
        },
        Inventory: {
            getInventory: getInventory,
            getInventoryItemByBeverageNr: getInventoryItemByBeverageNr,
            updateNumberInStockForBeverage: updateNumberInStockForBeverage,
            saveInventory: saveInventory,
        },
        VisibleInMenu: {
            getVisibilityStatusOfBeverage: getVisibilityStatusOfBeverage,
            setBeverageToVisible: setBeverageToVisible,
            setBeverageToHidden: setBeverageToHidden,
        },
        ActiveCheck: {
            getStatusOfBeverage: getStatusOfBeverage,
            changeStatusOfBeverage: changeStatusOfBeverage,
        },
    };
})();
