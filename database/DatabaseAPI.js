/*
 * File: DatabaseAPI.js
 *
 * API functions to the databases `DBLoaded` and `BeveragesAPI`.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Wednesday, 23rd February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

DatabaseAPI = (function () {
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
     * Change the credit amount in the user's account. Note that the amount
     * given as argument is the new balance and not the changed amount (± balance).
     *
     * @param {string} userName The user name.
     * @param {string} newAmount The new amount.
     */
    function changeBalance(userName, newAmount) {
        let userID;

        // First we find the userID in the user data base.
        for (let i = 0; i < DB.users.length; i++) {
            if (DB.users[i].username == userName) {
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
        return BeveragesDB.beverages.find(
            (beverage) => beverage.nr === beverageNr
        );
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

    /**
     * Make functions available to others (especially controllers) Usage: e.g.
     * `DatabaseAPI.Users.getAllUserUserNames();`
     */
    return {
        Users: {
            getAllUserNames: allUserNames,
            getUserDetailsByUserName: userDetails,
            changeBalance: changeBalance,
        },
        Beverages: {
            getAllBeverages: allBeverages,
            getAllStrongBeverages: allStrongBeverages,
            getBeverageNumbersSortedByPopularity:
                beverageNumbersSortedByPopularity,
            getBeverageNamesSortedByPopularity: beverageNamesSortedByPopularity,
            getBeverageTypes: beverageTypes,
            getBeverageTypesSortedByAlphabet: beverageTypesSortedByAlphabet,
            getBeverageTypesSortedByPopularity: beverageTypesSortedByPopularity,
        },
    };
})();
