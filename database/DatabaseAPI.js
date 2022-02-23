/* global DB, BeveragesDB */

DatabaseAPI = (function ($) {
    /**
     * Creates a deep copy of an given object.
     *
     * @param {object} obj The object to copy
     * @returns The copied object
     */
    function copy(obj) {
        return $.extend(true, {}, obj);
    }

    // This function will return an array with the user names
    // of all users in our database.
    //
    function allUserNames() {
        var nameCollect = [];
        for (let i = 0; i < DB.users.length; i++) {
            nameCollect.push(DB.users[i].username);
        }
        return nameCollect;
    }

    // This function will return an array with some specific details about a
    // selected user name (not the first name/last name). It will also add details from another "database"
    // which contains the current account status for the person.
    //
    function userDetails(userName) {
        var userCollect = [];
        var userID;
        var userIndex;
        var account;

        // First we find the user ID of the selected user. We also save the index number for the record in the JSON
        // structure.
        //
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username == userName) {
                userID = DB.users[i].user_id;
                userIndex = i;
            }
        }

        // We get the current account status from another table in the database, account. We store this in
        // a variable here for convenience.
        //
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id == userID) {
                account = DB.account[i].creditSEK;
            }
        }

        // This is the way to add the details you want from the db into your own data structure.
        // If you want to change the details, then just add or remove items accordingly below.
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

    // =====================================================================================================
    // This function will change the credit amount in the user's account. Note that the amount given as argument is the new
    // balance and not the changed amount (± balance).
    //
    function changeBalance(userName, newAmount) {
        // We use this variable to store the userID, since that is the link between the two data bases.
        var userID;

        // First we find the userID in the user data base.
        //
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username == userName) {
                userID = DB.users[i].user_id;
            }
        }

        // Then we match the userID with the account list.
        // and change the account balance.
        //
        for (let i = 0; i < DB.account.length; i++) {
            if (DB.account[i].user_id == userID) {
                DB.account[i].creditSEK = newAmount; // This changes the value in the JSON object.
            }
        }
    }

    // =====================================================================================================
    // Returns a list of all the names of the beverages in the database. This function can be used as a
    // recipe for similar functions.
    //
    function allBeverages() {
        // Using a local variable to collect the items.
        var collector = [];

        // The DB is stored in the variable BeveragesDB, with "beverages" as key element. If you need to select only certain
        // items, you may introduce filter functions in the loop... see the template within comments.
        //
        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            collector.push([
                BeveragesDB.beverages[i].name,
                BeveragesDB.beverages[i].category,
            ]);
        }
        //
        return collector;
    }

    // =====================================================================================================
    // This function returns the names of all strong beverages (i.e. all that contain a percentage of alcohol
    // higher than the strength given in percent.
    //
    function allStrongBeverages(strength) {
        // Using a local variable to collect the items.
        //
        var collector = [];

        // The DB is stored in the variable BeveragesDB, with "beverages" as key element. If you need to select only certain
        // items, you may introduce filter functions in the loop... see the template within comments.
        //
        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            // We check if the percentage alcohol strength stored in the data base is lower than the
            // given limit strength. If the limit is set to 14, also liqueuers are listed.
            //
            if (
                percentToNumber(BeveragesDB.beverages[i].alcoholstrength) >
                strength
            ) {
                // The key for the beverage name is "name", and beverage type is "category".
                //
                collector.push([
                    BeveragesDB.beverages[i].name,
                    BeveragesDB.beverages[i].category,
                ]);
            }
        }

        // Don't forget to return the result.
        //
        return collector;
    }

    /**
     * Finds a beverage by number in the database and returns it.
     *
     * @param {string} beverageNr Number of the beverage
     * @returns Beverage object or undefined
     */
    function findBeverageByNr(beverageNr) {
        return BeveragesDB.beverages.find(
            (beverage) => beverage.nr === beverageNr
        );
    }

    /**
     * Returns beverage numbers sorted by popularity in descending order.
     * It uses the past orders to check how many times they have been bought.
     *
     * @returns Array with objects that consists of the beverage number and a count
     */
    function beverageNumbersSortedByPopularity() {
        // Collect all beverages from the orders and count them.
        var collectorWithCount = {};
        for (let i = 0; i < DB.orders.length; i++) {
            const order = DB.orders[i];
            var beveragesInOrder = order.items.map((item) => item.nr);
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

        // Sort the beverages by count (create an array first)
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
     * Returns beverage names sorted by popularity in descending order.
     * It uses the past orders to check how many times they have been bought.
     *
     * @returns Array with beverages names
     */
    function beverageNamesSortedByPopularity() {
        var beveragesSortedByPopularity = beverageNumbersSortedByPopularity();

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

    // =====================================================================================================
    // Lists all beverage types in the database. As you will see, there are quite a few, and you might want
    // select only a few of them for your data.
    //
    function beverageTypes() {
        var types = [];
        for (let i = 0; i < BeveragesDB.beverages.length; i++) {
            addToSet(types, BeveragesDB.beverages[i].category);
        }
        return types;
    }

    function beverageTypesSortedByAlphabet() {
        var types = beverageTypes();
        return types.sort();
    }

    /**
     * Returns all beverage types sorted by popularity in descending order.
     * It uses the past orders to check how many times beverages of a particular type have been bought.
     *
     * @returns Array with objects that consists of the beverage type and a count
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
            var beveragesInOrder = order.items.map((item) => item.nr);
            for (let j = 0; j < beveragesInOrder.length; j++) {
                const beverageNr = beveragesInOrder[j];
                let beverage = findBeverageByNr(beverageNr);
                if (beverage) {
                    var beverageType = beverage.category;
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

    // =====================================================================================================
    // Adds an item to a set, only if the item is not already there.
    // The set is modelled using an array.
    //
    function addToSet(set, item) {
        if (!set.includes(item)) {
            set.push(item);
        }
        return set;
    }

    // =====================================================================================================
    // Convenience function to change "xx%" into the percentage in whole numbers (non-strings).
    //
    function percentToNumber(percentStr) {
        return Number(percentStr.slice(0, -1));
    }

    //=====================================================================================================
    // ORDERS
    //=====================================================================================================

    /**
     * Returns the last order in the database.
     *
     * @returns Order object
     */
    function getLastOrder() {
        return DB.orders[DB.orders.length - 1];
    }

    /**
     * Function to get an order of the database with an ID.
     *
     * @param {number} id ID of an order
     * @returns The order object, or `undefined` if there is no order with this id.
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
     * @returns The array with all order objects
     */
    function getOrders() {
        return copy(DB.orders);
    }

    /**
     * Function to get all undone orders of the database.
     *
     * @returns The array with all undone order objects
     */
    function getUndoneOrders() {
        return copy(DB.orders.filter((order) => order.done === false));
    }

    /**
     * Function to save a order in the database.
     *
     * @param {object} order The order object
     */
    function saveOrder(order) {
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

    //=====================================================================================================
    // Make functions available to others (especially controllers)
    // Usage: e.g. `DatabaseAPI.Users.getAllUserUserNames();`
    return {
        Users: {
            getAllUserNames: allUserNames,
            getUserDetailsByUserName: userDetails,
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
    };
})(jQuery);
