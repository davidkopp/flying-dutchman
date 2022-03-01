/*
 * File: OrderController.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 1st March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals DB, InventoryController */

describe("InventoryController", function () {
    describe("that handles the bar inventory", function () {
        let barInventoryController;
        let savedBarInventory;

        beforeAll(function () {
            barInventoryController = new InventoryController(
                Constants.INVENTORIES.BAR
            );
        });

        beforeEach(function () {
            savedBarInventory = $.extend(
                true,
                [],
                DB[Constants.INVENTORIES.BAR]
            );
        });

        afterEach(function () {
            DB[Constants.INVENTORIES.BAR] = $.extend(
                true,
                [],
                savedBarInventory
            );
        });

        it("should be able to get the bar inventory", function () {
            const inventory = barInventoryController.getInventory();

            expect(inventory).toBeTruthy();
            expect(inventory.length).toBeGreaterThan(0);
        });
    });

    describe("that handles the VIP inventory", function () {
        let vipInventoryController;
        let savedVipInventory;

        beforeAll(function () {
            vipInventoryController = new InventoryController(
                Constants.INVENTORIES.VIP
            );
        });

        beforeEach(function () {
            savedVipInventory = $.extend(
                true,
                [],
                DB[Constants.INVENTORIES.VIP]
            );
        });

        afterEach(function () {
            DB[Constants.INVENTORIES.VIP] = $.extend(
                true,
                [],
                savedVipInventory
            );
        });

        it("should be able to get the VIP inventory", function () {
            const inventory = vipInventoryController.getInventory();

            expect(inventory).toBeTruthy();
            expect(inventory.length).toBeGreaterThan(0);
        });
    });
});
