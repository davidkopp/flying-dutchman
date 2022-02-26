/*
 * File: OrderControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 26th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals DB, OrderController */

describe("OrderController", function () {
    let savedOrders;
    beforeEach(function () {
        savedOrders = $.extend(true, [], DB.orders);
    });

    afterEach(function () {
        DB.orders = $.extend(true, [], savedOrders);
    });

    it("should be able to get undone orders", function () {
        let undoneOrders = OrderController.getUndoneOrders();

        expect(undoneOrders).toBeTruthy();
        expect(undoneOrders.length).toBeGreaterThan(0);
    });

    it("should be able to create a simple order", function () {
        let newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };
        let createdOrder = OrderController.createOrder(newOrder);

        //console.log(JSON.stringify(createdOrder));

        expect(createdOrder).toBeTruthy();
        expect(createdOrder.id).toBeTruthy();
        expect(createdOrder.table).toBe(42);
        expect(createdOrder.items).toBeTruthy();
        expect(createdOrder.items.length).toBe(2);
        expect(createdOrder.items[0].beverageNr).toBe("120003");
        expect(createdOrder.items[0].id).toBeTruthy();
        expect(createdOrder.items[1].beverageNr).toBe("1202501");
        expect(createdOrder.items[1].id).toBeTruthy();
        expect(createdOrder.items[0].id).not.toEqual(createdOrder.items[1].id);
        expect(createdOrder.notes).toBe("Note");
        expect(createdOrder.done).toBe(false);
    });

    it("should be able to edit a simple order", function () {
        let newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };
        let createdOrder = OrderController.createOrder(newOrder);

        let orderEdited = {
            id: createdOrder.id,
            table: 4,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note2",
        };

        let editedOrder = OrderController.editOrder(orderEdited);

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.id).toBeTruthy();
        expect(editedOrder.id).toBe(createdOrder.id);
        expect(editedOrder.table).toBe(4);
        expect(editedOrder.items).toEqual(createdOrder.items);
        expect(editedOrder.notes).toBe("Note2");
        expect(editedOrder.done).toBe(false);
    });

    it("should be able to remove an existing order", function () {
        let newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };
        let createdOrder = OrderController.createOrder(newOrder);

        let numberOfOrdersBeforeRemoving =
            OrderController.getUndoneOrders().length;

        OrderController.removeOrderById(createdOrder.id);

        let numberOfOrdersAfterRemoving =
            OrderController.getUndoneOrders().length;

        expect(numberOfOrdersAfterRemoving).toBe(
            numberOfOrdersBeforeRemoving - 1
        );
    });

    it("should be able to add an item to an existing order", function () {
        let newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };

        let createdOrder = OrderController.createOrder(newOrder);

        let newItem = {
            beverageNr: "8507802",
        };

        let editedOrder = OrderController.addItemToOrder(
            createdOrder.id,
            newItem
        );

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.items).toBeTruthy();
        expect(editedOrder.items.length).toBe(3);
        expect(editedOrder.items[2]).toBeTruthy();
        expect(editedOrder.items[2].beverageNr).toBe("8507802");
        expect(editedOrder.items[2].id).toBeTruthy();
    });

    it("should be able to remove an item from an existing order", function () {
        let newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };

        let createdOrder = OrderController.createOrder(newOrder);

        let editedOrder = OrderController.removeItemFromOrder(
            createdOrder.id,
            createdOrder.items[0]
        );

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.items).toBeTruthy();
        expect(editedOrder.items.length).toBe(1);
        expect(editedOrder.items[0]).toBeTruthy();
        expect(editedOrder.items[0].beverageNr).toBe("1202501");
    });

    it("should be able to add / update a note from an existing order", function () {
        let order = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
                {
                    beverageNr: "1202501",
                },
            ],
            notes: "Note",
        };

        let createdOrder = OrderController.createOrder(order);

        let updatedNote = "Note updated";

        let updatedOrder = OrderController.changeNoteOfOrder(
            createdOrder.id,
            updatedNote
        );

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.note).toBeTruthy();
        expect(updatedOrder.note).toBe(updatedNote);
    });

    it("should be able to declare an item from an order as a product on the house", function () {
        let order = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
            ],
        };

        let createdOrder = OrderController.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(undefined);

        let updatedOrder = OrderController.declareItemAsProductOnTheHouse(
            createdOrder.id,
            createdOrder.items[0].id
        );

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.items).toBeTruthy();
        expect(updatedOrder.items[0]).toBeTruthy();
        expect(updatedOrder.items[0].productOnTheHouse).toBeTruthy();
    });

    it("should be able to undeclare an item from an order as a product on the house", function () {
        let order = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                    productOnTheHouse: true,
                },
            ],
        };

        let createdOrder = OrderController.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(true);

        let updatedOrder = OrderController.undeclareItemAsProductOnTheHouse(
            createdOrder.id,
            createdOrder.items[0].id
        );

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.items).toBeTruthy();
        expect(updatedOrder.items[0]).toBeTruthy();
        expect(updatedOrder.items[0].productOnTheHouse).toBeFalsy();
    });
});
