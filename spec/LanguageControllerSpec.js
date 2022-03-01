/*
 * File: LanguageControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 1st March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals changeLang */

describe("LanguageController", function () {
    beforeEach(function () {
        $("body").append(
            "<span id='test-element' data-lang='unit-test'></span>"
        );
    });

    afterEach(function () {
        $("#test-element").remove();
    });

    it("should be able to change the language", function () {
        changeLang("en");
        let firstString = $("#test-element").text();
        changeLang("de");
        let secondString = $("#test-element").text();

        expect(firstString).not.toEqual(secondString);
    });
});
