/*
 * File: InventoryControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 5th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals InventoryController */

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
            savedBarInventory = DatabaseAPI.Inventory.getInventory(
                Constants.INVENTORIES.BAR
            );
        });

        afterEach(function () {
            DatabaseAPI.Inventory.saveInventory(
                Constants.INVENTORIES.BAR,
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
            savedVipInventory = DatabaseAPI.Inventory.getInventory(
                Constants.INVENTORIES.VIP
            );
        });

        afterEach(function () {
            DatabaseAPI.Inventory.saveInventory(
                Constants.INVENTORIES.VIP,
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
