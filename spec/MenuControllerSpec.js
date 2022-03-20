/*
 * File: MenuControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 20th March 2022
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
});
