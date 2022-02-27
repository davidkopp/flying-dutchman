/*
 * File: OrderController.js
 *
 * Controller that is responsible for everything around an order: retrieving, adding, removing, etc.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 27th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /**
     * Get all undone orders.
     *
     * @returns {Array} Array with all undone orders
     */
    function getUndoneOrders() {
        return DatabaseAPI.Orders.getUndoneOrders();
    }

    /**
     * Checks if the given order data structure is valid and contains all
     * required information.
     *
     * @param {object} order The order data structure
     * @returns {boolean} `true` if valid, `false` if invalid
     */
    function validateOrder(order) {
        let valid = true;

        if (!order) {
            console.log("OrderController.validateOrder | Order is missing!");
            return false;
        }
        if (!order.table) {
            console.log(
                "OrderController.validateOrder | Order is not valid! Table is missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
        }
        if (!order.items && !Array.isArray(order.items)) {
            console.log(
                "OrderController.validateOrder | Order is not valid! Items are missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
        } else {
            order.items.forEach((item) => {
                let validItem = validateItem(item);
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
    function validateItem(item) {
        let valid = true;
        if (!item) {
            console.log(
                "OrderController.validateItem | Order item is not valid!"
            );
            return false;
        }
        if (!item.beverageNr) {
            console.log(
                "OrderController.validateItem | Order is not valid! Beverage number is missing or invalid. Item:\n" +
                    JSON.stringify(item)
            );
            valid = false;
        } else if (!DatabaseAPI.Beverages.findBeverageByNr(item.beverageNr)) {
            console.log(
                "OrderController.validateItem | Order is not valid! Beverage with the item number '" +
                    item.beverageNr +
                    "' does not exist. Item:\n" +
                    JSON.stringify(item)
            );
            valid = false;
        }
        return valid;
    }

    /**
     * Creates a new order.
     *
     * @param {object} order The new order
     * @returns {object} The created order object, or null if there was an error.
     */
    function createOrder(order) {
        if (!validateOrder(order)) {
            // TODO: Error Handling
            return null;
        }
        if (order.id) {
            console.log(
                "OrderController.createOrder | To create a new order it must not have a ID! To change the order use `editOrder` instead"
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
            reduceNumberInStockOfItemsByOne(newOrder.items);
        } catch (error) {
            console.log(
                `OrderController.createOrder | Exception was thrown: ${error.message}`
            );
            return null;
        }

        return DatabaseAPI.Orders.saveOrder(newOrder);
    }

    /**
     * Edits an order. It does not change the items of an order. To change the
     * items of an order use `addItemToOrder` or `removeItemFromOrder`.
     *
     * @param {object} order The order object
     * @returns {object} The edited order object, or null if there was an error.
     */
    function editOrder(order) {
        if (!validateOrder(order)) {
            // TODO: Error Handling
            return null;
        }
        if (typeof order.id != "number") {
            // TODO: Error Handling
            console.log(
                "OrderController.editOrder | Order is not valid! ID is missing or invalid. Order:\n" +
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
     * Remove an order by ID.
     *
     * @param {number} orderId The ID of the order to remove
     */
    function removeOrderById(orderId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.removeOrderById | Order with id '${orderId}' does not exist!`
            );
            return;
        }

        // Update number in stock
        increaseNumberInStockOfItemsByOne(order.items);

        DatabaseAPI.Orders.removeOrderById(order.id);
    }

    /**
     * Adds an item to an existing order. If there are not enough items left in
     * stock, the item won't be added.
     *
     * @param {number} orderId The order ID.
     * @param {object} item The order item object to add.
     * @returns {object} The stored order object.
     */
    function addItemToOrder(orderId, item) {
        if (!validateItem(item)) {
            // TODO: Error Handling
            return null;
        }

        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.addItemToOrder | Order with id '${orderId}' does not exist!`
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
            reduceNumberInStockOfItemsByOne([item]);
        } catch (error) {
            console.log(
                `OrderController.addItemToOrder | Exception was thrown: ${error.message}`
            );
            return null;
        }

        order.items.push(item);
        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Removes an item from an existing order.
     *
     * @param {number} orderId The order ID
     * @param {object} item The order item object to remove
     * @returns {object} The stored order object without the item
     */
    function removeItemFromOrder(orderId, item) {
        if (!validateItem(item)) {
            // TODO: Error Handling
            return null;
        }

        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.addItemToOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        // Update number in stock for this item
        increaseNumberInStockOfItemsByOne([item]);

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
    function changeNoteOfOrder(orderId, newNote) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.changeNoteOfOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        order.note = newNote;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Declares an item on the order as a "product on the house".
     *
     * @param {string} orderId The order ID
     * @param {string} newNote The new note
     * @returns {object} The stored order object with the updated item.
     */
    function declareItemAsProductOnTheHouse(orderId, itemId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.declareItemAsProductOnTheHouse | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        let foundItem = order.items.find((i) => i.id === itemId);
        if (!foundItem) {
            console.log(
                `OrderController.declareItemAsProductOnTheHouse | Item with id '${itemId}' does not exist in the order with the id '${orderId}'!`
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
     * @param {string} newNote The new note
     * @returns {object} The stored order object with the updated item.
     */
    function undeclareItemAsProductOnTheHouse(orderId, itemId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.undeclareItemAsProductOnTheHouse | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        let foundItem = order.items.find((i) => i.id === itemId);
        if (!foundItem) {
            console.log(
                `OrderController.undeclareItemAsProductOnTheHouse | Item with id '${itemId}' does not exist in the order with the id '${orderId}'!`
            );
            return null;
        }
        foundItem.productOnTheHouse = false;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Calculates the total amount of order items. It considers if an item is a
     * product on the house.
     *
     * @param {Array} items The array with order items
     * @returns {number} The result as a float number
     */
    function calculateTotalAmount(items) {
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
                        `OrderController.calculateTotalAmount | Beverage with number '${item.beverageNr}' does not have a valid price set ('${beverage.priceinclvat}')!`
                    );
                    continue;
                }
                totalAmountForOrder += amount;
            }
        }
        return totalAmountForOrder;
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
                `OrderController.createBillForOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        const totalAmountForOrder = calculateTotalAmount(order.items);

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
                `OrderController.completeOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        const bill = DatabaseAPI.Bills.getBillById(billId);
        if (!bill) {
            console.log(
                `OrderController.completeOrder | Bill with id '${billId}' does not exist!`
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

    /**
     * Internal function to reduce the number in stock of the items by one each.
     *
     * @param {Array} items The items
     * @throws Will throw an error if there are not enough items left in the inventory.
     */
    function reduceNumberInStockOfItemsByOne(items) {
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
    function increaseNumberInStockOfItemsByOne(items) {
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

    exports.OrderController = {};
    exports.OrderController.getUndoneOrders = getUndoneOrders;
    exports.OrderController.createOrder = createOrder;
    exports.OrderController.editOrder = editOrder;
    exports.OrderController.removeOrderById = removeOrderById;
    exports.OrderController.addItemToOrder = addItemToOrder;
    exports.OrderController.removeItemFromOrder = removeItemFromOrder;
    exports.OrderController.changeNoteOfOrder = changeNoteOfOrder;
    exports.OrderController.declareItemAsProductOnTheHouse =
        declareItemAsProductOnTheHouse;
    exports.OrderController.undeclareItemAsProductOnTheHouse =
        undeclareItemAsProductOnTheHouse;
    exports.OrderController.createBillForOrder = createBillForOrder;
    exports.OrderController.completeOrder = completeOrder;
})(jQuery, window);
