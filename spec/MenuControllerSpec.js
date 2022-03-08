/*
 * File: MenuControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 8th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals MenuController */

describe("MenuController", function () {
    /**
     * Checks if the string is somehow part of the menu container in the DOM.
     *
     * @param {string} string The string.
     * @returns {boolean} `true` if string is contained in menu container, `false` if not.
     */
    function checkIfMenuInDOMContains(string) {
        return $(`#menu-container:contains(${string})`).length >= 1;
    }

    beforeAll(function (done) {
        $(document).ready(function () {
            // Wait until the DOM is ready before executing the unit tests.
            done();
        });
    });

    beforeEach(function () {
        $("body").append("<div id='menu-container'></div>");
    });

    afterEach(function () {
        $("#menu-container").remove();
    });

    it("should be able to initialize the menu without a filter", function () {
        MenuController.initMenu();

        const htmlMenuItems = $(".item");

        expect(htmlMenuItems.length).toBeGreaterThan(0);
    });

    describe("that accesses the `hideFromMenu` database", function () {
        let savedHideFromMenuList;

        beforeEach(function () {
            savedHideFromMenuList = DatabaseAPI.HideFromMenu.getList();
        });

        afterEach(function () {
            DatabaseAPI.HideFromMenu.saveList(savedHideFromMenuList);
        });

        it("should be able to hide a beverage from the menu", function () {
            const beverageNr = "76901";
            MenuController.showBeverageInMenu(beverageNr);

            const listContainsBeverageAfterShowOperation =
                DatabaseAPI.HideFromMenu.getList().includes(beverageNr);
            const menuContainsBeverageAfterShowOperation =
                checkIfMenuInDOMContains(beverageNr);

            expect(listContainsBeverageAfterShowOperation).toBe(false);
            expect(menuContainsBeverageAfterShowOperation).toBe(true);

            // MenuController.hideBeverageFromMenu(beverageNr);

            // const listContainsBeverageAfterHideOperation =
            //     DatabaseAPI.HideFromMenu.getList().includes(beverageNr);
            // const menuContainsBeverageAfterHideOperation =
            //     checkIfMenuInDOMContains(beverageNr);

            // expect(listContainsBeverageAfterHideOperation).toBe(true);
            // expect(menuContainsBeverageAfterHideOperation).toBe(false);
        });
    });
});
