DatabaseAPI = (function () {
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

    // Make functions available to others (especially controllers)
    return {
        allUserNames: allUserNames,
        userDetails: userDetails,
        changeBalance: changeBalance,
        allBeverages: allBeverages,
        allStrongBeverages: allStrongBeverages,
        beverageTypes: beverageTypes,
    };
})();
