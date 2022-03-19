/*
 * File: MenuControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 19th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals MenuController */

describe("MenuController", function () {
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

            // First show the beverage in menu
            MenuController.showBeverageInMenu(beverageNr);
            const listContainsBeverageAfterShowOperation =
                DatabaseAPI.HideFromMenu.getList().includes(beverageNr);
            const menuContainsBeverageAfterShowOperation =
                $(`div[data-beverage-nr='${beverageNr}']`).length > 0;

            expect(listContainsBeverageAfterShowOperation).toBe(false);
            expect(menuContainsBeverageAfterShowOperation).toBe(true);

            // Now hide the beverage from the menu
            MenuController.hideBeverageFromMenu(beverageNr);
            const listContainsBeverageAfterHideOperation =
                DatabaseAPI.HideFromMenu.getList().includes(beverageNr);
            const menuContainsBeverageAfterHideOperation =
                $(`div[data-beverage-nr='${beverageNr}']`).length > 0;

            expect(listContainsBeverageAfterHideOperation).toBe(true);
            expect(menuContainsBeverageAfterHideOperation).toBe(false);
        });
    });
});
