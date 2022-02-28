/*
 * File: InventoryControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Monday, 28th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals DB, InventoryController */

describe("InventoryController", function () {
    let savedInventory;

    beforeEach(function () {
        savedInventory = $.extend(true, [], DB.inventory);
    });

    afterEach(function () {
        DB.inventory = $.extend(true, [], savedInventory);
    });

    it("should be able to get inventory", function () {
        const inventory = InventoryController.getInventory();

        expect(inventory).toBeTruthy();
        expect(inventory.length).toBeGreaterThan(0);
    });

    /*it("should be able to set the attribute `hideFromMenu` from an inventory item", function () {
        const inventoryItem = InventoryController.getInventory()[0];
        const result1 = InventoryController.setHideFromMenu(
            inventoryItem,
            true
        );

        expect(result1.hideFromMenu).toBe(true);

        const result2 = InventoryController.setHideFromMenu(
            inventoryItem,
            false
        );

        expect(result2.hideFromMenu).toBe(false);
    });*/
});
