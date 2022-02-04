// This is a template file for the use of data from JSON files. It is defined
// to use the AJAX asynchronous loading. This means that it will not block other
// functions. However, this also means that the loading is not guaranteed to be
// finished before other commands are given.
//
// NOTE: JSON DOES NOT ALLOW COMMENTS IN THE FILE!
//
//
// The Data object holds the database.
//
function loadJSON(callback, file) {

    // We load the file using an XMLHttpRequest, which is part of AJAX
    //
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");

    // Open the file for reading. Filename is relative to the script file.
    //
    xobj.open('GET', file, true);

    xobj.onreadystatechange = function () {

        if (xobj.readyState == 4 && xobj.status == "200") {

            // It is necessary to use an anonymous callback as .open will NOT
            // return a value but simply returns undefined in asynchronous mode.
            //
            callback(xobj.responseText);
        }
    };

    xobj.send(null);
};

var db = new Data();

function Data() {
    this.users = [];
    this.beverages = [];
    this.payments = [];
    this.bought = [];
    this.sold = [];


// Sample function to load all the users into the global users variable.
//
    this.loadUsers = function () {
        loadJSON(function (response) {

            // The use of a JSON-parser means that there must not be anything but a proper
            // JSON-structure in the file.
            //
            this.users = JSON.parse(response);
            console.log(this.users[2].username);

        }, 'DBFilesJSON/dutchman_table_users.json');
    };

// Sample function to load all the beverages into the global beverages variable.
//
    this.loadBeverages = function () {
        loadJSON(function (response) {

            this.beverages = JSON.parse(response);
            console.log(this.beverages[1].nr);

        }, 'DBFilesJSON/dutchman_table_sbl_beer.json');
    };

// Sample function to access a user from the database.
//
    this.getUser = function (index) {
        return db.users[index].username;
    };
}

// Execute the loading of the files
//
db.loadUsers();
db.loadBeverages();

function getUsers(ix) {
    return db.getUser(ix);
}