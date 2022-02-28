/*
 * File: InventoryController.js
 *
 * Controller that is responsible for everything around managing the inventory: getting inventory items, set items to hide from menu, etc. *
 * Author: David Kopp
 * -----
 * Last Modified: Monday, 28th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /**
     * Get all inventory items.
     *
     * @returns {Array} Array with all inventory items
     */
    function getInventory() {
        return DatabaseAPI.Inventory.getInventory();
    }

    /**
     * Get the inventory item for a specific beverage.
     *
     * @param {string} beverageNr The beverage number.
     * @returns Inventory item if beverage number exists in inventory. Otherwise
     *   `undefined`.
     */
    function getInventoryItemByBeverageNr(beverageNr) {
        return DatabaseAPI.Inventory.getInventoryItemByBeverageNr(beverageNr);
    }

    /**
     * Updates the number in stock for a specific beverage, if the number is valid.
     *
     * @param {string} beverageNr The beverage number
     * @param {number} newQuantity The new quantity
     * @returns {object} The updated inventory item, or `null` if there was an error.
     */
    function updateNumberInStockForBeverage(beverageNr, newQuantity) {
        if (typeof newQuantity !== "number" || newQuantity < 0) {
            return null;
        }

        const result = DatabaseAPI.Inventory.updateNumberInStockForBeverage(
            beverageNr,
            newQuantity
        );

        if (!result) {
            return null;
        }
        return result;
    }

    exports.InventoryController = {};
    exports.InventoryController.getInventory = getInventory;
    exports.InventoryController.getInventoryItemByBeverageNr =
        getInventoryItemByBeverageNr;
    exports.InventoryController.updateNumberInStockForBeverage =
        updateNumberInStockForBeverage;
})(jQuery, window);
