/*
 * File: OrderControllerUDSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 1st March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals DB, OrderControllerUD, UNDOmanager */

describe("OrderControllerUD", function () {
    let savedOrders;
    let savedInventory;
    let undoManager;

    beforeEach(function () {
        savedOrders = $.extend(true, [], DB.orders);
        savedInventory = $.extend(true, [], DB.inventory);
        undoManager = new UNDOmanager();
    });

    afterEach(function () {
        DB.orders = $.extend(true, [], savedOrders);
        DB.inventory = $.extend(true, [], savedInventory);
        undoManager.cleanup();
    });

    it("should be able to get undone orders", function () {
        const undoneOrders = OrderControllerUD.getUndoneOrders();

        expect(undoneOrders).toBeTruthy();
        expect(undoneOrders.length).toBeGreaterThan(0);
    });

    it("should be able to get undone orders for a certain table", function () {
        const newOrder = {
            table: 42,
            items: [],
        };

        const createdOrder = OrderControllerUD.createOrder(newOrder);

        const result = OrderControllerUD.getUndoneOrdersForTable(
            newOrder.table
        );

        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        expect(result[result.length - 1]).toEqual(createdOrder);
    });

    it("should be able to create a simple order", function () {
        const newOrder = {
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
        const createdOrder = OrderControllerUD.createOrder(newOrder);

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
        const newOrder = {
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
        const createdOrder = OrderControllerUD.createOrder(newOrder);

        const orderEdited = {
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

        const editOrderFunc = OrderControllerUD.editOrderUNDOFunc(orderEdited);
        const editedOrder = undoManager.doit(editOrderFunc);

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.id).toBeTruthy();
        expect(editedOrder.id).toBe(createdOrder.id);
        expect(editedOrder.table).toBe(4);
        expect(editedOrder.items).toEqual(createdOrder.items);
        expect(editedOrder.notes).toBe("Note2");
        expect(editedOrder.done).toBe(false);
    });

    it("should be able to remove an existing order", function () {
        const newOrder = {
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
        const createdOrder = OrderControllerUD.createOrder(newOrder);

        const numberOfOrdersBeforeRemoving =
            OrderControllerUD.getUndoneOrders().length;

        OrderControllerUD.removeOrderById(createdOrder.id);

        const numberOfOrdersAfterRemoving =
            OrderControllerUD.getUndoneOrders().length;

        expect(numberOfOrdersAfterRemoving).toBe(
            numberOfOrdersBeforeRemoving - 1
        );
    });

    it("should be able to add an item to an existing order", function () {
        const newOrder = {
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

        const createdOrder = OrderControllerUD.createOrder(newOrder);

        const newItem = {
            beverageNr: "8507802",
        };

        const addItemToOrderFunc = OrderControllerUD.addItemToOrderUNDOFunc(
            createdOrder.id,
            newItem
        );
        const editedOrder = undoManager.doit(addItemToOrderFunc);

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.items).toBeTruthy();
        expect(editedOrder.items.length).toBe(3);
        expect(editedOrder.items[2]).toBeTruthy();
        expect(editedOrder.items[2].beverageNr).toBe("8507802");
        expect(editedOrder.items[2].id).toBeTruthy();
    });

    it("should be able to remove an item from an existing order", function () {
        const newOrder = {
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

        const createdOrder = OrderControllerUD.createOrder(newOrder);

        const removeItemFromOrderFunc =
            OrderControllerUD.removeItemFromOrderUNDOFunc(
                createdOrder.id,
                createdOrder.items[0]
            );
        const editedOrder = undoManager.doit(removeItemFromOrderFunc);

        expect(editedOrder).toBeTruthy();
        expect(editedOrder.items).toBeTruthy();
        expect(editedOrder.items.length).toBe(1);
        expect(editedOrder.items[0]).toBeTruthy();
        expect(editedOrder.items[0].beverageNr).toBe("1202501");
    });

    it("should be able to add / update a note from an existing order", function () {
        const order = {
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

        const createdOrder = OrderControllerUD.createOrder(order);

        const updatedNote = "Note updated";

        const changeNoteOfOrderFunc =
            OrderControllerUD.changeNoteOfOrderUNDOFunc(
                createdOrder.id,
                updatedNote
            );
        const updatedOrder = undoManager.doit(changeNoteOfOrderFunc);

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.note).toBeTruthy();
        expect(updatedOrder.note).toBe(updatedNote);
    });

    it("should be able to declare an item from an order as a product on the house", function () {
        const order = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
            ],
        };

        const createdOrder = OrderControllerUD.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(undefined);

        const declareItemAsProductOnTheHouseFunc =
            OrderControllerUD.declareItemAsProductOnTheHouseUNDOFunc(
                createdOrder.id,
                createdOrder.items[0].id
            );
        const updatedOrder = undoManager.doit(
            declareItemAsProductOnTheHouseFunc
        );

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.items).toBeTruthy();
        expect(updatedOrder.items[0]).toBeTruthy();
        expect(updatedOrder.items[0].productOnTheHouse).toBeTruthy();
    });

    it("should be able to undeclare an item from an order as a product on the house", function () {
        const order = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                    productOnTheHouse: true,
                },
            ],
        };

        const createdOrder = OrderControllerUD.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(true);

        const undeclareItemAsProductOnTheHouseFunc =
            OrderControllerUD.undeclareItemAsProductOnTheHouseUNDOFunc(
                createdOrder.id,
                createdOrder.items[0].id
            );
        const updatedOrder = undoManager.doit(
            undeclareItemAsProductOnTheHouseFunc
        );

        expect(updatedOrder).toBeTruthy();
        expect(updatedOrder.items).toBeTruthy();
        expect(updatedOrder.items[0]).toBeTruthy();
        expect(updatedOrder.items[0].productOnTheHouse).toBeFalsy();
    });

    describe("that updates the number in stock (inventory)", function () {
        it("when new order is created", function () {
            const beverageNr = "120003";
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: beverageNr,
                    },
                    {
                        beverageNr: beverageNr,
                        productOnTheHouse: true,
                    },
                ],
            };

            const numberInStockBeforeOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            OrderControllerUD.createOrder(newOrder);

            const actualNumberInStockAfterOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;
            const expectedNumberInStockAfterOrderCreation =
                numberInStockBeforeOrderCreation - 2;

            expect(actualNumberInStockAfterOrderCreation).toBe(
                expectedNumberInStockAfterOrderCreation
            );
        });

        it("when order is removed", function () {
            const beverageNr = "120003";
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: beverageNr,
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(newOrder);

            const numberInStockOfBeverageBeforeOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            OrderControllerUD.removeOrderById(createdOrder.id);

            const actualNumberInStockOfBeverageAfterOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;
            const expectedNumberInStockOfBeverageAfterOrderIsRemoved =
                numberInStockOfBeverageBeforeOrderIsRemoved + 1;

            expect(actualNumberInStockOfBeverageAfterOrderIsRemoved).toBe(
                expectedNumberInStockOfBeverageAfterOrderIsRemoved
            );
        });

        it("when an item is added to an order", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(newOrder);

            const newItem = {
                beverageNr: "8507802",
            };

            const numberInStockBeforeItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    newItem.beverageNr
                ).quantity;

            const addItemToOrderFunc = OrderControllerUD.addItemToOrderUNDOFunc(
                createdOrder.id,
                newItem
            );
            undoManager.doit(addItemToOrderFunc);

            const actualNumberInStockAfterItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    newItem.beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsAddedToOrder =
                numberInStockBeforeItemIsAddedToOrder - 1;

            expect(actualNumberInStockAfterItemIsAddedToOrder).toBe(
                expectedNumberInStockAfterItemIsAddedToOrder
            );
        });

        it("when an item is removed from an order", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(newOrder);

            const numberInStockBeforeItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    createdOrder.items[0].beverageNr
                ).quantity;

            const removeItemFromOrderFunc =
                OrderControllerUD.removeItemFromOrderUNDOFunc(
                    createdOrder.id,
                    createdOrder.items[0]
                );
            undoManager.doit(removeItemFromOrderFunc);

            const actualNumberInStockAfterItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    createdOrder.items[0].beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsRemovedFromOrder =
                numberInStockBeforeItemIsRemovedFromOrder + 1;

            expect(actualNumberInStockAfterItemIsRemovedFromOrder).toBe(
                expectedNumberInStockAfterItemIsRemovedFromOrder
            );
        });

        it("and checks if quantity in inventory is high enough", function () {
            const beverageNr = "1217401";
            const numberOfBeveragesInInventoryBeforeChange =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            let items = [];
            for (let i = 0; i < numberOfBeveragesInInventoryBeforeChange; i++) {
                items.push({
                    beverageNr: beverageNr,
                });
            }

            const order1 = {
                table: 42,
                items: items,
            };

            const createdOrder1 = OrderControllerUD.createOrder(order1);

            const numberOfBeveragesInInventoryAfterCreateOrder1 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            expect(createdOrder1).toBeTruthy();
            expect(numberOfBeveragesInInventoryAfterCreateOrder1).toBe(0);

            // Try to create another order with the same beverage → should not be possible, because there are no items left in the inventory.
            const order2 = {
                table: 43,
                items: [
                    {
                        beverageNr: beverageNr,
                    },
                ],
            };

            const createdOrder2 = OrderControllerUD.createOrder(order2);

            const numberOfBeveragesInInventoryAfterCreateOrder2 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            expect(createdOrder2).toBeFalsy();
            expect(numberOfBeveragesInInventoryAfterCreateOrder2).toBe(0);
        });
    });

    describe("that handles also the bills", function () {
        let savedBills;

        beforeEach(function () {
            savedBills = $.extend(true, [], DB.bills);
        });

        afterEach(function () {
            DB.bills = $.extend(true, [], savedBills);
        });

        it("should be able to create a new bill for an order", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                    {
                        beverageNr: "1202501",
                    },
                    {
                        beverageNr: "120003",
                        productOnTheHouse: true,
                    },
                ],
            };

            const expectedTotalAmount = 13.9 + 62.0 + 0;

            const createdOrder = OrderControllerUD.createOrder(order);
            const createdBill = OrderControllerUD.createBillForOrder(
                createdOrder.id
            );

            expect(createdBill).toBeTruthy();
            expect(createdBill.id).toBeTruthy();
            expect(createdBill.vipAccount).toBe(false);
            expect(createdBill.timestamp instanceof Date).toBe(true);
            expect(createdBill.amountSEK).toBe(expectedTotalAmount);
        });

        it("should be able to create a new bill for an order of a VIP member", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(order);
            const createdBill = OrderControllerUD.createBillForOrder(
                createdOrder.id,
                "single",
                true
            );

            expect(createdBill).toBeTruthy();
            expect(createdBill.vipAccount).toBe(true);
        });

        it("should be able to create a new bill for an order with group splitting", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                    {
                        beverageNr: "120003",
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(order);
            const createdBill = OrderControllerUD.createBillForOrder(
                createdOrder.id,
                "group"
            );

            expect(createdBill).toBeTruthy();
            expect(createdBill.type).toBe("group");
        });

        it("should be able to complete an order", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                    {
                        beverageNr: "120003",
                        productOnTheHouse: true,
                    },
                ],
            };

            const createdOrder = OrderControllerUD.createOrder(order);
            const createdBill = OrderControllerUD.createBillForOrder(
                createdOrder.id
            );

            const completedOrder = OrderControllerUD.completeOrder(
                createdOrder.id,
                createdBill.id
            );

            expect(completedOrder).toBeTruthy();
            expect(completedOrder.done).toBe(true);
            expect(completedOrder.billId).toBe(createdBill.id);
        });
    });
});
