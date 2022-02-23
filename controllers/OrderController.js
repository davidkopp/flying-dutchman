(function ($, exports) {
    /**
     * Get all undone orders.
     *
     * @returns Array with all undone orders
     */
    function getUndoneOrders() {
        return DatabaseAPI.Orders.getUndoneOrders();
    }

    /**
     * Checks if the given order data structure is valid and contains all required information.
     *
     * @param {object} order The order data structure
     * @returns `true` if valid, `false` if invalid
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
     * Checks if the given item data structure is valid and contains all required information.
     *
     * @param {object} item The item object
     * @returns `true` if valid, `false` if invalid
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
     * @returns The created order object, or null if there was an error.
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

        return DatabaseAPI.Orders.saveOrder(newOrder);
    }

    /**
     * Edits an order.
     *
     * @param {object} order The order object
     * @returns The edited order object, or null if there was an error.
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
        orderToEdit.items = order.items;
        if (typeof order.notes == "string") {
            orderToEdit.notes = order.notes;
        }
        if (typeof order.done == "boolean") {
            orderToEdit.done = order.done;
        }
        if (order.billId) {
            orderToEdit.billId = order.billId;
        }

        DatabaseAPI.Orders.saveOrder(order);

        return orderToEdit;
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
            return null;
        }
        DatabaseAPI.Orders.removeOrderById(order.id);
    }

    /**
     * Adds an item to an existing order.
     *
     * @param {number} orderId The order ID
     * @param {object} item The order item object to add
     * @returns The stored order object containing the item
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

        // Generate id for the item
        let newItemId = 1;
        if (order.items.length >= 1) {
            newItemId = order.items[order.items.length - 1].id + 1;
        }
        item.id = newItemId;

        order.items.push(item);
        return DatabaseAPI.Orders.saveOrder(order);
    }

    /**
     * Removes an item from an existing order.
     *
     * @param {number} orderId The order ID
     * @param {object} item The order item object to remove
     * @returns The stored order object without the item
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

        order.items = order.items.filter((i) => i.id != item.id);
        return DatabaseAPI.Orders.saveOrder(order);
    }

    exports.OrderController = {};
    exports.OrderController.getUndoneOrders = getUndoneOrders;
    exports.OrderController.createOrder = createOrder;
    exports.OrderController.editOrder = editOrder;
    exports.OrderController.removeOrderById = removeOrderById;
    exports.OrderController.addItemToOrder = addItemToOrder;
    exports.OrderController.removeItemFromOrder = removeItemFromOrder;
})(jQuery, window);
