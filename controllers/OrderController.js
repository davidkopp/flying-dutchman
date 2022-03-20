/*
 * File: OrderController.js
 *
 * Extends the OrderController by operations with undo / redo functionalities...
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 20th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    //=========================================================================
    // PUBLIC FUNCTIONS WITHOUT REDO FUNCTIONALITIES
    //=========================================================================

    /**
     * Function to get an order of the database with an ID.
     *
     * @param {number} orderId ID of an order.
     * @returns {object} The order object, or `undefined` if there is no order
     *   with this id.
     */
    function getOrderById(orderId) {
        return DatabaseAPI.Orders.getOrderById(orderId);
    }

    /**
     * Get all undone orders.
     *
     * @returns {Array} Array with all undone orders
     */
    function getUndoneOrders() {
        return DatabaseAPI.Orders.getUndoneOrders();
    }

    /**
     * Get all undone orders sorted by table.
     *
     * @returns {object} The object with keys for every table that contains an
     *   array with the undone orders.
     */
    function getUndoneOrdersSortedByTable() {
        const undoneOrders = getUndoneOrders();
        let ordersSorted = {};
        undoneOrders.forEach((order) => {
            if (
                !Object.prototype.hasOwnProperty.call(ordersSorted, order.table)
            ) {
                ordersSorted[order.table] = [order];
            } else {
                ordersSorted[order.table].push(order);
            }
        });
        return ordersSorted;
    }

    /**
     * Get all undone orders for a certain table.
     *
     * @param {number} table The table number.
     * @returns {Array} The array with all undone orders for the table.
     */
    function getUndoneOrdersForTable(table) {
        return getUndoneOrders().filter((o) => o.table === table);
    }

    //=========================================================================
    // UNDO REDO FUNCTION OBJECTS
    //=========================================================================

    /**
     * Creates a function object for the operation "edit order" that can be used
     * with the UNDOmanager. *
     *
     * @param {object} order The order object.
     * @returns {object} Object with the three functions `execute`, `unexecute`
     *   and `reexecute`.
     */
    function editOrderUNDOFunc(order) {
        return {
            oldOrder: copyObject(order),

            execute: function () {
                return editOrder(order);
            },

            unexecute: function () {
                return editOrder(this.oldOrder);
            },

            reexecute: function () {
                return editOrder(order);
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
    function addItemToOrderUNDOFunc(orderId, item) {
        return {
            execute: function () {
                return addItemToOrder(orderId, item);
            },

            unexecute: function () {
                return removeItemFromOrder(orderId, item);
            },

            reexecute: function () {
                return addItemToOrder(orderId, item);
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
    function removeItemFromOrderUNDOFunc(orderId, item) {
        return {
            oldItem: item,

            execute: function () {
                return removeItemFromOrder(orderId, item);
            },

            unexecute: function () {
                return addItemToOrder(orderId, this.oldItem);
            },

            reexecute: function () {
                return removeItemFromOrder(orderId, item);
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
    function changeNoteOfOrderUNDOFunc(orderId, newNote) {
        return {
            oldNote: (function () {
                const order = DatabaseAPI.Orders.getOrderById(orderId);
                if (order) {
                    return order.notes;
                } else {
                    return "";
                }
            })(),
            execute: function () {
                return changeNoteOfOrder(orderId, newNote);
            },

            unexecute: function () {
                return changeNoteOfOrder(orderId, this.oldNote);
            },

            reexecute: function () {
                return changeNoteOfOrder(orderId, newNote);
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
    function declareItemAsProductOnTheHouseUNDOFunc(orderId, itemId) {
        return {
            execute: function () {
                return declareItemAsProductOnTheHouse(orderId, itemId);
            },

            unexecute: function () {
                return undeclareItemAsProductOnTheHouse(orderId, itemId);
            },

            reexecute: function () {
                return declareItemAsProductOnTheHouse(orderId, itemId);
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
    function undeclareItemAsProductOnTheHouseUNDOFunc(orderId, itemId) {
        return {
            execute: function () {
                return undeclareItemAsProductOnTheHouse(orderId, itemId);
            },

            unexecute: function () {
                return declareItemAsProductOnTheHouse(orderId, itemId);
            },

            reexecute: function () {
                return undeclareItemAsProductOnTheHouse(orderId, itemId);
            },
        };
    }

    //=========================================================================
    // PUBLIC FUNCTIONS WITHOUT UNDO CAPABILITIES
    //=========================================================================

    /**
     * Creates a new order. Note: It directly updates the inventory on the basis
     * of the order items, to make sure that they are reserved and will
     * definitely be available for this order.
     *
     * @param {object} order The new order
     * @returns {object} The created order object, or null if there was an error.
     */
    function createOrder(order) {
        if (!validateOrder(order)) {
            console.log(
                "OrderController.createOrder | Invalid order:\n" +
                    JSON.stringify(order)
            );
            return null;
        }
        if (order.id) {
            console.log(
                "OrderController.createOrder | To create a new order it must not have an ID! To change the order use `editOrder` instead."
            );
            return null;
        }

        // Set an id to every item (→ removing an item with an id is easy)
        for (let i = 0; i < order.items.length; i++) {
            order.items[i].id = i + 1;
        }

        const newOrder = {
            table: order.table,
            items: order.items,
            notes: typeof order.notes === "string" ? order.notes : "",
            inventory: order.inventory,
            done: typeof order.done === "boolean" ? order.done : false,
            billId: order.billId ? order.billId : null,
        };

        // Try to update number in stock for the items
        try {
            reduceNumberInStockOfItemsByOne(order.inventory, newOrder.items);
        } catch (error) {
            console.log(
                `OrderController.createOrder | Exception was thrown: ${
                    error.message
                }
                Order object: ${JSON.stringify(order)}`
            );
            return null;
        }

        return DatabaseAPI.Orders.saveOrder(newOrder);
    }

    /**
     * Remove an order by ID. Note: It directly updates the inventory on the
     * basis of the order items, so the items are available for other orders again.
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
        increaseNumberInStockOfItemsByOne(order.inventory, order.items);

        DatabaseAPI.Orders.removeOrderById(order.id);
    }

    /**
     * Returns the bill with the given bill id.
     *
     * @param {number} billId The bill id.
     * @returns {object} The bill object.
     */
    function getBillById(billId) {
        return DatabaseAPI.Bills.getBillById(billId);
    }

    /**
     * Creates a bill for an order.
     *
     * @example <caption>Optional argument `split`</caption>
     *     {
     *         "1": {
     *             "amountSEK": 40,
     *             "paid": false
     *         },
     *         "2": {
     *             "amountSEK": 40,
     *             "paid": false
     *         }
     *     }
     *
     * @param {number} orderId The order id.
     * @param {object} split Optional object with information about splitting
     *   the bill. If omitted or null, the bill is considered to be a single
     *   bill without a split. As an example see the description.
     * @param {number} vipAccountId Optional user id of a vip account. If given,
     *   the bill will be paid with the account of the vip.
     * @returns {object} The bill object stored in the database.
     */
    function createBillForOrder(orderId, split, vipAccountId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.createBillForOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        if (order.billId) {
            console.log(
                `OrderController.createBillForOrder | A bill already exists for the order '${orderId}'! BillId: ${order.billId}`
            );
            return getBillById(order.billId);
        }

        const totalAmountForOrder = calculateTotalAmount(order.items);
        if (vipAccountId) {
            const accountBalance =
                DatabaseAPI.Users.getBalanceByUserId(vipAccountId);
            if (typeof accountBalance !== "number") {
                console.log(
                    `OrderController.createBillForOrder | Order with id '${orderId}' should be paid with a VIP account, however their is no account balance for vip account '${vipAccountId}'!`
                );
                return null;
            }

            if (accountBalance < totalAmountForOrder) {
                console.log(
                    `OrderController.createBillForOrder | Order with id '${orderId}' has a total amount of '${totalAmountForOrder}', however the account balance of the vip account '${vipAccountId}' only has '${accountBalance}'! Bill will be created, but to complete the order the account balance has to be increased first.`
                );
            }
        }

        const newBill = {
            split: harmonizeBillSplitObject(split, totalAmountForOrder),
            vipAccountId: vipAccountId,
            timestamp: new Date().toISOString(),
            amountSEK: totalAmountForOrder,
        };

        const createdBill = DatabaseAPI.Bills.saveBill(newBill);

        // Save bill id to the order
        order.billId = createdBill.id;
        DatabaseAPI.Orders.saveOrder(order);

        return createdBill;
    }

    /**
     * Edits the split object that is part of a bill.
     *
     * @example <caption>Argument `split`</caption>
     *     {
     *         "1": {
     *             "amountSEK": 40,
     *             "paid": false
     *         },
     *         "2": {
     *             "amountSEK": 40,
     *             "paid": false
     *         }
     *     }
     *
     * @param {number} billId The bill id.
     * @param {object} split Edited split object.
     * @returns {object} The bill object stored in the database.
     */
    function editBillSplit(billId, split) {
        let bill = DatabaseAPI.Bills.getBillById(billId);
        if (!bill) {
            console.log(
                `OrderController.editBillSplit | Bill with id '${billId}' does not exist!`
            );
            return null;
        }

        bill.split = harmonizeBillSplitObject(split, bill.amountSEK);

        return DatabaseAPI.Bills.saveBill(bill);
    }

    /**
     * Completes an order: Set order to done and reduce account balance of VIP
     * if the bill is for an VIP member.
     *
     * @param {number} orderId The order id.
     * @returns {object} The updated order object.
     */
    function completeOrder(orderId) {
        let order = DatabaseAPI.Orders.getOrderById(orderId);
        if (!order) {
            console.log(
                `OrderController.completeOrder | Order with id '${orderId}' does not exist!`
            );
            return null;
        }

        const billId = order.billId;
        const bill = DatabaseAPI.Bills.getBillById(billId);
        if (!bill) {
            console.log(
                `OrderController.completeOrder | Bill with id '${billId}' does not exist!`
            );
            return null;
        }

        if (bill.vipAccountId) {
            // TODO: Reduce account balance for VIP
        }

        if (bill.split) {
            let allPaid = true;
            for (const splitIt in bill.split) {
                if (Object.hasOwnProperty.call(bill.split, splitIt)) {
                    const splitInfo = bill.split[splitIt];
                    if (splitInfo.paid != true) {
                        allPaid = false;
                    }
                }
            }
            if (allPaid != true) {
                console.log(
                    `OrderController.completeOrder | Bill with id '${billId}' is not yet fully paid! Can't complete order`
                );
                return null;
            }
        }

        order.done = true;

        return DatabaseAPI.Orders.saveOrder(order);
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
        const validInventoryNames = Object.values(Constants.INVENTORIES);
        if (!order.inventory) {
            console.log(
                "OrderController.validateOrder | Inventory name is missing! Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
        } else if (!validInventoryNames.includes(order.inventory)) {
            console.log(
                "OrderController.validateOrder | Inventory name is invalid! It has to be one of the following names: '" +
                    validInventoryNames.join(", ") +
                    "' . Order:\n" +
                    JSON.stringify(order)
            );
            valid = false;
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

    //=========================================================================
    // PRIVATE FUNCTIONS FOR HANDLING THE ACTUAL LOGIC
    //=========================================================================

    /**
     * Harmonizes the split object of a bill, e.g. adding the properties
     * `amountSEK` and `paid` if they don't exist).
     *
     * @param {object} splitObj The split object.
     * @param {number} totalAmount The total amount of the bill.
     * @returns {object} The harmonized split object.
     */
    function harmonizeBillSplitObject(splitObj, totalAmount) {
        if (!splitObj) {
            return undefined;
        }

        const splitBy = Object.keys(splitObj).length;
        // By default split the bill equally
        const equalAmountPerPerson = totalAmount / splitBy;
        for (const splitId in splitObj) {
            if (Object.hasOwnProperty.call(splitObj, splitId)) {
                const splitInfo = splitObj[splitId];
                splitObj[splitId].amountSEK = splitInfo.amountSEK
                    ? splitInfo.amountSEK
                    : equalAmountPerPerson;
                splitObj[splitId].paid =
                    splitInfo.paid === true ? splitInfo.paid : false;
            }
        }
        return splitObj;
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
            return null;
        }
        if (typeof order.id != "number") {
            console.log(
                "OrderController.editOrder | Order is not valid! ID is missing or invalid. Order:\n" +
                    JSON.stringify(order)
            );
            return null;
        }

        let orderToEdit = DatabaseAPI.Orders.getOrderById(order.id);

        if (order.inventory !== orderToEdit.inventory) {
            console.log(
                "OrderController.editOrder | Change of the inventory is not possible! Order:\n" +
                    JSON.stringify(order)
            );
            return null;
        }

        orderToEdit.table = order.table;
        if (typeof order.notes === "string") {
            orderToEdit.notes = order.notes;
        }
        if (typeof order.done === "boolean") {
            orderToEdit.done = order.done;
        }
        if (order.billId) {
            orderToEdit.billId = order.billId;
        }

        return DatabaseAPI.Orders.saveOrder(orderToEdit);
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
    function addItemToOrder(orderId, item) {
        if (!validateItem(item)) {
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
            DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                order.inventory,
                item.beverageNr
            );
        if (inventoryItem.quantity >= 1) {
            // TODO: Update number of beverages in stock
        }

        if (!item.id) {
            // Generate id for the item
            let newItemId;
            if (order.items.length === 0) {
                newItemId = 1;
            } else {
                newItemId = order.items[order.items.length - 1].id + 1;
            }
            item.id = newItemId;
        }

        // Try to update number in stock for this item
        try {
            reduceNumberInStockOfItemsByOne(order.inventory, [item]);
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
     * Removes an item from an existing order. Note: It directly updates the
     * inventory on the basis of the provided item, so the item will be
     * available for other orders again.
     *
     * @param {number} orderId The order ID
     * @param {object} item The order item object to remove
     * @returns {object} The stored order object without the item
     */
    function removeItemFromOrder(orderId, item) {
        if (!validateItem(item)) {
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
        increaseNumberInStockOfItemsByOne(order.inventory, [item]);

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

        order.notes = newNote;

        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Declares an item on the order as a "product on the house".
     *
     * @param {string} orderId The order ID.
     * @param {string} itemId The item ID.
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
     * @param {string} itemId The item ID.
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

    //=========================================================================
    // PRIVATE HELPER FUNCTIONS
    //=========================================================================

    /**
     * Creates a clone of an object (deep copy).
     *
     * @param {object} obj The object to copy.
     * @returns {object} The cloned object.
     */
    function copyObject(obj) {
        return $.extend(true, {}, obj);
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
     * Internal function to reduce the number in stock of the items by one each.
     *
     * @param {string} inventoryName The inventory name.
     * @param {Array} items The items.
     * @throws Will throw an error if there are not enough items left in the inventory.
     */
    function reduceNumberInStockOfItemsByOne(inventoryName, items) {
        // Check first if there are enough items left in the inventory.
        let collector = {};
        for (let i = 0; i < items.length; i++) {
            const beverageNr = items[i].beverageNr;

            if (!Object.prototype.hasOwnProperty.call(collector, beverageNr)) {
                const inventoryItem =
                    DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                        inventoryName,
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
                        `Inventory '${inventoryName}' has not enough items left for beverage '${beverageNr}'. Cancel operation.`
                    );
                }
            }
        }

        // Now we can finally reduce the quantity from the inventory.
        for (const beverageNr in collector) {
            if (Object.hasOwnProperty.call(collector, beverageNr)) {
                const newQuantityTemp = collector[beverageNr];
                DatabaseAPI.Inventory.updateNumberInStockForBeverage(
                    inventoryName,
                    beverageNr,
                    newQuantityTemp
                );
            }
        }
    }

    /**
     * Internal function to increase the number in stock of the items by one each.
     *
     * @param {string} inventoryName The inventory name.
     * @param {Array} items The items
     */
    function increaseNumberInStockOfItemsByOne(inventoryName, items) {
        for (let i = 0; i < items.length; i++) {
            const beverageNr = items[i].beverageNr;
            const inventoryItem =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    inventoryName,
                    beverageNr
                );
            const newQuantity = inventoryItem.quantity + 1;
            DatabaseAPI.Inventory.updateNumberInStockForBeverage(
                inventoryName,
                beverageNr,
                newQuantity
            );
        }
    }

    //=========================================================================
    // EXPORTS: MAKE FUNCTIONS PUBLIC
    //=========================================================================

    exports.OrderController = {};

    // Public functions without UNDO capabilities
    exports.OrderController.getOrderById = getOrderById;
    exports.OrderController.getUndoneOrders = getUndoneOrders;
    exports.OrderController.getUndoneOrdersSortedByTable =
        getUndoneOrdersSortedByTable;
    exports.OrderController.getUndoneOrdersForTable = getUndoneOrdersForTable;
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
    exports.OrderController.getBillById = getBillById;
    exports.OrderController.createBillForOrder = createBillForOrder;
    exports.OrderController.editBillSplit = editBillSplit;
    exports.OrderController.completeOrder = completeOrder;

    // Public functions with UNDO capabilities
    exports.OrderController.editOrderUNDOFunc = editOrderUNDOFunc;
    exports.OrderController.addItemToOrderUNDOFunc = addItemToOrderUNDOFunc;
    exports.OrderController.removeItemFromOrderUNDOFunc =
        removeItemFromOrderUNDOFunc;
    exports.OrderController.changeNoteOfOrderUNDOFunc =
        changeNoteOfOrderUNDOFunc;
    exports.OrderController.declareItemAsProductOnTheHouseUNDOFunc =
        declareItemAsProductOnTheHouseUNDOFunc;
    exports.OrderController.undeclareItemAsProductOnTheHouseUNDOFunc =
        undeclareItemAsProductOnTheHouseUNDOFunc;
})(jQuery, window);
