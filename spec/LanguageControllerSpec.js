/*
 * File: LanguageControllerSpec.js
 *
 * Author: David Kopp
 */
/* globals LanguageController */

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
        LanguageController.changeLang(Constants.LANGUAGE_CODE_ENGLISH);
        let firstString = $("#test-element").text();
        LanguageController.changeLang(Constants.LANGUAGE_CODE_GERMAN);
        let secondString = $("#test-element").text();

        expect(firstString).not.toEqual(secondString);
    });
});
