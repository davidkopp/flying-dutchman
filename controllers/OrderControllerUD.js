/*
 * File: OrderControllerUD.js
 *
 * Extends the OrderController by operations with undo / redo functionalities...
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 1st March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals UNDOmanager */

(function ($, exports) {
    //=========================================================================
    // PUBLIC FUNCTIONS WITHOUT REDO FUNCTIONALITIES
    //=========================================================================

    /**
     * Get all undone orders.
     *
     * @returns {Array} Array with all undone orders
     */
    function getUndoneOrders() {
        return DatabaseAPI.Orders.getUndoneOrders();
    }

    /**
     * Get all undone orders for a certain table.
     *
     * @param {number} table The table number.
     * @returns {Array} The array with all undone orders for the table.
     */
    function getUndoneOrdersForTable(table) {
        return getUndoneOrders().filter((o) => (o.table = table));
    }

    //=========================================================================
    // UNDO REDO FUNCTION OBJECTS
    //=========================================================================

    /**
     * Creates a function object for the operation "create order" that can be
     * used with the UNDOmanager.
     *
     * @param {object} order The order object.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function createOrderFunc(order) {
        return {
            execute: function () {
                return _createOrder(order);
            },

            unexecute: function () {
                return _removeOrderById(order.id);
            },

            reexecute: function () {
                return _createOrder(order);
            },
        };
    }

    /**
     * Creates a function object for the operation "edit order" that can be used
     * with the UNDOmanager. *
     *
     * @param {object} order The order object.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function editOrderFunc(order) {
        return {
            oldOrder: _copyObject(order),

            execute: function () {
                return _editOrder(order);
            },

            unexecute: function () {
                return _editOrder(this.oldOrder);
            },

            reexecute: function () {
                return _editOrder(order);
            },
        };
    }

    /**
     * Creates a function object for the operation "remove order" that can be
     * used with the UNDOmanager. *
     *
     * @param {object} order The order object.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function removeOrderFunc(order) {
        return {
            oldOrder: _copyObject(order),

            execute: function () {
                return _removeOrderById(order.id);
            },

            unexecute: function () {
                return _restoreOrder(this.oldOrder);
            },

            reexecute: function () {
                return _removeOrderById(order.id);
            },
        };
    }

    /**
     * Creates a function object for the operation "add item to order" that can
     * be used with the UNDOmanager. *
     *
     * @param {number} orderId The order ID.
     * @param {object} item The order item object to add.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function addItemToOrderFunc(orderId, item) {
        return {
            execute: function () {
                return _addItemToOrder(orderId, item);
            },

            unexecute: function () {
                return _removeItemFromOrder(orderId, item);
            },

            reexecute: function () {
                return _addItemToOrder(orderId, item);
            },
        };
    }

    /**
     * Creates a function object for the operation "remove item from order" that
     * can be used with the UNDOmanager. *
     *
     * @param {number} orderId The order ID.
     * @param {object} item The order item object to remove.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function removeItemFromOrderFunc(orderId, item) {
        return {
            execute: function () {
                return _removeItemFromOrder(orderId, item);
            },

            unexecute: function () {
                // TODO: Check if it's a problem that a new ID for the item will be created. → Probably yes :(
                return _addItemToOrder(orderId, item);
            },

            reexecute: function () {
                return _removeItemFromOrder(orderId, item);
            },
        };
    }

    /**
     * Creates a function object for the operation "change note of order" that
     * can be used with the UNDOmanager. *
     *
     * @param {string} orderId The order ID
     * @param {string} newNote The new note
     * @returns {object} The stored order object with the note
     */
    function changeNoteOfOrderFunc(orderId, newNote) {
        return {
            oldNote: (function () {
                const order = DatabaseAPI.Orders.getOrderById(orderId);
                if (order) {
                    return order.note;
                } else {
                    return "";
                }
            })(),
            execute: function () {
                return _changeNoteOfOrder(orderId, newNote);
            },

            unexecute: function () {
                return _changeNoteOfOrder(orderId, this.oldNote);
            },

            reexecute: function () {
                return _changeNoteOfOrder(orderId, newNote);
            },
        };
    }

    /**
     * Creates a function object for the operation "declare item as product on
     * the house" that can be used with the UNDOmanager. *
     *
     * @param {string} orderId The order ID.
     * @param {string} itemId The item ID.
     * @returns {object} The stored order object with the updated item.
     */
    function declareItemAsProductOnTheHouseFunc(orderId, itemId) {
        return {
            execute: function () {
                return _declareItemAsProductOnTheHouse(orderId, itemId);
            },

            unexecute: function () {
                return _undeclareItemAsProductOnTheHouse(orderId, itemId);
            },

            reexecute: function () {
                return _declareItemAsProductOnTheHouse(orderId, itemId);
            },
        };
    }

    /**
     * Creates a function object for the operation "undeclare item as product on
     * the house" that can be used with the UNDOmanager. *
     *
     * @param {string} orderId The order ID.
     * @param {string} itemId The item ID.
     * @returns {object} The stored order object with the updated item.
     */
    function undeclareItemAsProductOnTheHouseFunc(orderId, itemId) {
        return {
            execute: function () {
                return _undeclareItemAsProductOnTheHouse(orderId, itemId);
            },

            unexecute: function () {
                return _declareItemAsProductOnTheHouse(orderId, itemId);
            },

            reexecute: function () {
                return _undeclareItemAsProductOnTheHouse(orderId, itemId);
            },
        };
    }

    //=========================================================================
    // VALIDATION FUNCTIONS
    //=========================================================================

    /**
     * Checks if the given order data structure is valid and contains all
     * required information.
     *
     * @param {object} order The order data structure
     * @returns {boolean} `true` if valid, `false` if invalid
     */
    function _validateOrder(order) {
        let valid = true;

        if (!order) {
            console.log("OrderControllerUD.validateOrder | Order is missing!");
            return false;
        }
        if (!order.table) {
            console.log(
                "OrderControllerUD.validateOrder | Order is not valid! Table is missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
        }
        if (!order.items && !Array.isArray(order.items)) {
            console.log(
                "OrderControllerUD.validateOrder | Order is not valid! Items are missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
        } else {
            order.items.forEach((item) => {
                let validItem = _validateItem(item);
                if (!validItem) {
                    valid = false;
                }
            });
        }

        return valid;
    }

    /**
     * Checks if the given item data structure is valid and contains all
     * required information.
     *
     * @param {object} item The item object
     * @returns {boolean} `true` if valid, `false` if invalid
     */
    function _validateItem(item) {
        let valid = true;
        if (!item) {
            console.log(
                "OrderControllerUD.validateItem | Order item is not valid!"
            );
            return false;
        }
        if (!item.beverageNr) {
            console.log(
                "OrderControllerUD.validateItem | Order is not valid! Beverage number is missing or invalid. Item:\n" +
                    JSON.stringify(item)
            );
            valid = false;
        } else if (!DatabaseAPI.Beverages.findBeverageByNr(item.beverageNr)) {
            console.log(
                "OrderControllerUD.validateItem | Order is not valid! Beverage with the item number '" +
                    item.beverageNr +
                    "' does not exist. Item:\n" +
                    JSON.stringify(item)
            );
            valid = false;
        }
        return valid;
    }

    //=========================================================================
    // FUNCTIONS TO UPDATE THE VIEW
    //=========================================================================

    /** Updates the view. */
    function _updateView() {
        // TODO: Implement logic for update view
    }

    //=========================================================================
    // PRIVATE FUNCTIONS FOR HANDLING THE ACTUAL LOGIC
    //=========================================================================

    /**
     * Creates a new order. Note: It directly updates the inventory on the basis
     * of the order items, to make sure that they are reserved and will
     * definitely be available for this order.
     *
     * @param {object} order The new order
     * @returns {object} The created order object, or null if there was an error.
     */
    function _createOrder(order) {
        if (!_validateOrder(order)) {
            // TODO: Error Handling
            return null;
        }
        if (order.id) {
            console.log(
                "OrderControllerUD.createOrder | To create a new order it must not have an ID! To change the order use `editOrder` instead."
            );
        }

        // Set an id to every item (→ removing an item with an id is easy)
        for (let i = 0; i < order.items.length; i++) {
            order.items[i].id = i + 1;
        }

        const newOrder = {
            table: order.table,
            items: order.items,
            notes: typeof order.notes == "string" ? order.notes : "",
            done: typeof order.done == "boolean" ? order.done : false,
            billId: order.billId ? order.billId : null,
        };

        // Try to update number in stock for the items
        try {
            _reduceNumberInStockOfItemsByOne(newOrder.items);
        } catch (error) {
            console.log(
                `OrderControllerUD.createOrder | Exception was thrown: ${error.message}`
            );
            return null;
        }

        return DatabaseAPI.Orders.saveOrder(newOrder);
    }

    /**
     * Restores a previous already existing order. This function should be only
     * used in the context of UNDO-REDO. Note: It directly updates the inventory
     * on the basis of the order items, to make sure that they are reserved and
     * will definitely be available for this order.
     *
     * @param {object} order The order object.
     * @returns {object} The restored order object in the database, or null if
     *   there was an error.
     */
    function _restoreOrder(order) {
        if (!_validateOrder(order)) {
            // TODO: Error Handling
            return null;
        }
        if (!order.id) {
            console.log(
                "OrderControllerUD._restoreOrder | To restore an order it must have an ID! To create a new order use `createOrder` instead."
            );
        }

        // Try to update number in stock for the items
        try {
            _reduceNumberInStockOfItemsByOne(order.items);
        } catch (error) {
            console.log(
                `OrderControllerUD._restoreOrder | Exception was thrown: ${error.message}`
            );
            return null;
        }

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Edits an order. It does not change the items of an order. To change the
     * items of an order use `addItemToOrder` or `removeItemFromOrder`.
     *
     * @param {object} order The order object
     * @returns {object} The edited order object, or null if there was an error.
     */
    function _editOrder(order) {
        if (!_validateOrder(order)) {
            // TODO: Error Handling
            return null;
        }
        if (typeof order.id != "number") {
            // TODO: Error Handling
            console.log(
                "OrderControllerUD.editOrder | Order is not valid! ID is missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            return null;
        }

        let orderToEdit = DatabaseAPI.Orders.getOrderById(order.id);

        orderToEdit.table = order.table;
        if (typeof order.notes == "string") {
            orderToEdit.notes = order.notes;
        }
        if (typeof order.done == "boolean") {
            orderToEdit.done = order.done;
        }
        if (order.billId) {
            orderToEdit.billId = order.billId;
        }

        return DatabaseAPI.Orders.saveOrder(orderToEdit);
    }

    /**
     * Remove an order by ID. Note: It directly updates the inventory on the
     * basis of the order items, so the items are available for other orders again.
     *
     * @param {number} orderId The ID of the order to remove
     */
    function _removeOrderById(orderId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD.removeOrderById | Order with id '${orderId}' does not exist!`
            );
            return;
        }

        // Update number in stock
        _increaseNumberInStockOfItemsByOne(order.items);

        DatabaseAPI.Orders.removeOrderById(order.id);
    }

    /**
     * Adds an item to an existing order. If there are not enough items left in
     * stock, the item won't be added. Note: It directly updates the inventory
     * on the basis of the provided item, to make sure that it is reserved and
     * will definitely be available for the order.
     *
     * @param {number} orderId The order ID.
     * @param {object} item The order item object to add.
     * @returns {object} The stored order object.
     */
    function _addItemToOrder(orderId, item) {
        if (!_validateItem(item)) {
            // TODO: Error Handling
            return null;
        }

        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD.addItemToOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        // Check if there are enough beverages left in the inventory
        const inventoryItem =
            DatabaseAPI.Inventory.getInventoryItemByBeverageNr(item.beverageNr);
        if (inventoryItem.quantity >= 1) {
            // TODO: Update number of beverages in stock
        }

        // Generate id for the item
        let newItemId = 1;
        if (order.items.length >= 1) {
            newItemId = order.items[order.items.length - 1].id + 1;
        }
        item.id = newItemId;

        // Try to update number in stock for this item
        try {
            _reduceNumberInStockOfItemsByOne([item]);
        } catch (error) {
            console.log(
                `OrderControllerUD.addItemToOrder | Exception was thrown: ${error.message}`
            );
            return null;
        }

        order.items.push(item);
        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Removes an item from an existing order. Note: It directly updates the
     * inventory on the basis of the provided item, so the item will be
     * available for other orders again.
     *
     * @param {number} orderId The order ID
     * @param {object} item The order item object to remove
     * @returns {object} The stored order object without the item
     */
    function _removeItemFromOrder(orderId, item) {
        if (!_validateItem(item)) {
            // TODO: Error Handling
            return null;
        }

        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD.addItemToOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        // Update number in stock for this item
        _increaseNumberInStockOfItemsByOne([item]);

        order.items = order.items.filter((i) => i.id != item.id);
        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Adds a new note to the order. Attention: It overwrites the old note!
     *
     * @param {string} orderId The order ID
     * @param {string} newNote The new note
     * @returns {object} The stored order object with the note
     */
    function _changeNoteOfOrder(orderId, newNote) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD.changeNoteOfOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        order.note = newNote;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Declares an item on the order as a "product on the house".
     *
     * @param {string} orderId The order ID.
     * @param {string} itemId The item ID.
     * @returns {object} The stored order object with the updated item.
     */
    function _declareItemAsProductOnTheHouse(orderId, itemId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD.declareItemAsProductOnTheHouse | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        let foundItem = order.items.find((i) => i.id === itemId);
        if (!foundItem) {
            console.log(
                `OrderControllerUD.declareItemAsProductOnTheHouse | Item with id '${itemId}' does not exist in the order with the id '${orderId}'!`
            );
            return null;
        }
        foundItem.productOnTheHouse = true;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Undeclare an item of the order as a "product on the house".
     *
     * @param {string} orderId The order ID
     * @param {string} itemId The item ID.
     * @returns {object} The stored order object with the updated item.
     */
    function _undeclareItemAsProductOnTheHouse(orderId, itemId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD._undeclareItemAsProductOnTheHouse | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        let foundItem = order.items.find((i) => i.id === itemId);
        if (!foundItem) {
            console.log(
                `OrderControllerUD._undeclareItemAsProductOnTheHouse | Item with id '${itemId}' does not exist in the order with the id '${orderId}'!`
            );
            return null;
        }
        foundItem.productOnTheHouse = false;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Creates a bill for an order.
     *
     * @param {number} orderId The order id.
     * @param {string} splittingType 'single' or 'group'. If omitted, 'single' is used.
     * @param {boolean} vipAccount 'true' if account balance of an VIP should be
     *   used for the bill. If omitted, 'false' is used.
     * @returns {object} The bill object stored in the database.
     */
    function createBillForOrder(orderId, splittingType, vipAccount) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD._createBillForOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        const totalAmountForOrder = _calculateTotalAmount(order.items);

        if (vipAccount) {
            // TODO: Check if the account balance is high enough for the order
        }

        const newBill = {
            type: splittingType ? splittingType : "single",
            vipAccount: vipAccount ? vipAccount : false,
            timestamp: new Date(),
            amountSEK: totalAmountForOrder,
        };

        return DatabaseAPI.Bills.saveBill(newBill);
    }

    /**
     * Completes an order: Add bill to an order, set order to done and reduce
     * account balance of VIP if the bill is for an VIP member.
     *
     * @param {number} orderId The order id.
     * @param {number} billId The bill id.
     * @returns {object} The updated order object.
     */
    function completeOrder(orderId, billId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderControllerUD._completeOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        const bill = DatabaseAPI.Bills.getBillById(billId);
        if (!bill) {
            console.log(
                `OrderControllerUD._completeOrder | Bill with id '${billId}' does not exist!`
            );
            return null;
        }

        order.billId = billId;
        order.done = true;

        if (bill.vipAccount) {
            // TODO: Reduce account balance for VIP
        }

        return DatabaseAPI.Orders.saveOrder(order);
    }

    //=========================================================================
    // PRIVATE HELPER FUNCTIONS
    //=========================================================================

    /**
     * Creates a clone of an object (deep copy).
     *
     * @param {object} obj The object to copy.
     * @returns {object} The cloned object.
     */
    function _copyObject(obj) {
        return $.extend(true, {}, obj);
    }

    /**
     * Calculates the total amount of order items. It considers if an item is a
     * product on the house.
     *
     * @param {Array} items The array with order items
     * @returns {number} The result as a float number
     */
    function _calculateTotalAmount(items) {
        let totalAmountForOrder = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.productOnTheHouse) {
                // Item is declared as a product on the house → skip it
                continue;
            }

            const beverage = DatabaseAPI.Beverages.findBeverageByNr(
                item.beverageNr
            );
            if (beverage) {
                const amount = parseFloat(beverage.priceinclvat);
                if (isNaN(amount)) {
                    console.log(
                        `OrderControllerUD._calculateTotalAmount | Beverage with number '${item.beverageNr}' does not have a valid price set ('${beverage.priceinclvat}')!`
                    );
                    continue;
                }
                totalAmountForOrder += amount;
            }
        }
        return totalAmountForOrder;
    }

    /**
     * Internal function to reduce the number in stock of the items by one each.
     *
     * @param {Array} items The items
     * @throws Will throw an error if there are not enough items left in the inventory.
     */
    function _reduceNumberInStockOfItemsByOne(items) {
        // Check first if there are enough items left in the inventory.
        let collector = {};
        for (let i = 0; i < items.length; i++) {
            const beverageNr = items[i].beverageNr;

            if (!Object.prototype.hasOwnProperty.call(collector, beverageNr)) {
                const inventoryItem =
                    DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                        beverageNr
                    );
                collector[beverageNr] = inventoryItem.quantity - 1;
            } else {
                collector[beverageNr] = collector[beverageNr] - 1;
            }
        }

        for (const beverageNr in collector) {
            if (Object.hasOwnProperty.call(collector, beverageNr)) {
                const newQuantityTemp = collector[beverageNr];
                if (newQuantityTemp < 0) {
                    throw new Error(
                        `Inventory has not enough items left for beverage '${beverageNr}'. Cancel operation.`
                    );
                }
            }
        }

        // Now we can finally reduce the quantity from the inventory.
        for (const beverageNr in collector) {
            if (Object.hasOwnProperty.call(collector, beverageNr)) {
                const newQuantityTemp = collector[beverageNr];
                DatabaseAPI.Inventory.updateNumberInStockForBeverage(
                    beverageNr,
                    newQuantityTemp
                );
            }
        }
    }

    /**
     * Internal function to increase the number in stock of the items by one each.
     *
     * @param {Array} items The items
     */
    function _increaseNumberInStockOfItemsByOne(items) {
        for (let i = 0; i < items.length; i++) {
            const beverageNr = items[i].beverageNr;
            const inventoryItem =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(beverageNr);
            const newQuantity = inventoryItem.quantity + 1;
            DatabaseAPI.Inventory.updateNumberInStockForBeverage(
                beverageNr,
                newQuantity
            );
        }
    }

    //=========================================================================
    // EXPORTS: MAKE FUNCTIONS PUBLIC
    //=========================================================================

    exports.OrderControllerUD = {};
    exports.OrderControllerUD.getUndoneOrders = getUndoneOrders;
    exports.OrderControllerUD.getUndoneOrdersForTable = getUndoneOrdersForTable;
    exports.OrderControllerUD.createOrderFunc = createOrderFunc;
    exports.OrderControllerUD.editOrderFunc = editOrderFunc;
    exports.OrderControllerUD.removeOrderFunc = removeOrderFunc;
    exports.OrderControllerUD.addItemToOrderFunc = addItemToOrderFunc;
    exports.OrderControllerUD.removeItemFromOrderFunc = removeItemFromOrderFunc;
    exports.OrderControllerUD.changeNoteOfOrderFunc = changeNoteOfOrderFunc;
    exports.OrderControllerUD.declareItemAsProductOnTheHouseFunc =
        declareItemAsProductOnTheHouseFunc;
    exports.OrderControllerUD.undeclareItemAsProductOnTheHouseFunc =
        undeclareItemAsProductOnTheHouseFunc;
    exports.OrderControllerUD.createBillForOrder = createBillForOrder;
    exports.OrderControllerUD.completeOrder = completeOrder;
})(jQuery, window);
