/*
 * File: OrderControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 1st March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals DB, OrderController, UNDOmanager */

describe("OrderController", function () {
    let savedOrders;
    let savedInventory;

    beforeEach(function () {
        savedOrders = $.extend(true, [], DB.orders);
        savedInventory = $.extend(true, [], DB.inventory);
    });

    afterEach(function () {
        DB.orders = $.extend(true, [], savedOrders);
        DB.inventory = $.extend(true, [], savedInventory);
    });

    it("should be able to get undone orders", function () {
        const undoneOrders = OrderController.getUndoneOrders();

        expect(undoneOrders).toBeTruthy();
        expect(undoneOrders.length).toBeGreaterThan(0);
    });

    it("should be able to get undone orders for a certain table", function () {
        const newOrder = {
            table: 42,
            items: [],
        };

        const createdOrder = OrderController.createOrder(newOrder);

        const result = OrderController.getUndoneOrdersForTable(newOrder.table);

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
        const createdOrder = OrderController.createOrder(newOrder);

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
        const createdOrder = OrderController.createOrder(newOrder);

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

        const editedOrder = OrderController.editOrder(orderEdited);

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
        const createdOrder = OrderController.createOrder(newOrder);

        const numberOfOrdersBeforeRemoving =
            OrderController.getUndoneOrders().length;

        OrderController.removeOrderById(createdOrder.id);

        const numberOfOrdersAfterRemoving =
            OrderController.getUndoneOrders().length;

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

        const createdOrder = OrderController.createOrder(newOrder);

        const newItem = {
            beverageNr: "8507802",
        };

        const editedOrder = OrderController.addItemToOrder(
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

        const createdOrder = OrderController.createOrder(newOrder);

        const editedOrder = OrderController.removeItemFromOrder(
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

        const createdOrder = OrderController.createOrder(order);

        const updatedNote = "Note updated";

        const updatedOrder = OrderController.changeNoteOfOrder(
            createdOrder.id,
            updatedNote
        );

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

        const createdOrder = OrderController.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(undefined);

        const updatedOrder = OrderController.declareItemAsProductOnTheHouse(
            createdOrder.id,
            createdOrder.items[0].id
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

        const createdOrder = OrderController.createOrder(order);

        expect(createdOrder.items[0].productOnTheHouse).toBe(true);

        const updatedOrder = OrderController.undeclareItemAsProductOnTheHouse(
            createdOrder.id,
            createdOrder.items[0].id
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

            OrderController.createOrder(newOrder);

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

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockOfBeverageBeforeOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    beverageNr
                ).quantity;

            OrderController.removeOrderById(createdOrder.id);

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

            const createdOrder = OrderController.createOrder(newOrder);

            const newItem = {
                beverageNr: "8507802",
            };

            const numberInStockBeforeItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    newItem.beverageNr
                ).quantity;

            OrderController.addItemToOrder(createdOrder.id, newItem);

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

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockBeforeItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    createdOrder.items[0].beverageNr
                ).quantity;

            OrderController.removeItemFromOrder(
                createdOrder.id,
                createdOrder.items[0]
            );

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

            const createdOrder1 = OrderController.createOrder(order1);

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

            const createdOrder2 = OrderController.createOrder(order2);

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

            const createdOrder = OrderController.createOrder(order);
            const createdBill = OrderController.createBillForOrder(
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

            const createdOrder = OrderController.createOrder(order);
            const createdBill = OrderController.createBillForOrder(
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

            const createdOrder = OrderController.createOrder(order);
            const createdBill = OrderController.createBillForOrder(
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

            const createdOrder = OrderController.createOrder(order);
            const createdBill = OrderController.createBillForOrder(
                createdOrder.id
            );

            const completedOrder = OrderController.completeOrder(
                createdOrder.id,
                createdBill.id
            );

            expect(completedOrder).toBeTruthy();
            expect(completedOrder.done).toBe(true);
            expect(completedOrder.billId).toBe(createdBill.id);
        });
    });

    describe("with UNDO REDO capabilities", function () {
        let undoManager;

        beforeEach(function () {
            undoManager = new UNDOmanager();
        });

        afterEach(function () {
            undoManager.cleanup();
        });

        it("should be able to undo and redo the operation 'add an item to an order'", function () {
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

            const createdOrder = OrderController.createOrder(newOrder);

            const newItem = {
                beverageNr: "8507802",
            };

            const addItemToOrderFunc = OrderController.addItemToOrderUNDOFunc(
                createdOrder.id,
                newItem
            );
            const editedOrder = undoManager.doit(addItemToOrderFunc);

            expect(editedOrder).not.toEqual(createdOrder);

            const undoResult = undoManager.undoit(addItemToOrderFunc);

            expect(undoResult).toEqual(createdOrder);

            const redoResult = undoManager.redoit(addItemToOrderFunc);

            expect(redoResult).toEqual(editedOrder);
        });

        it("should be able to undo and redo the operation 'remove an item from an order'", function () {
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

            const createdOrder = OrderController.createOrder(newOrder);

            const removeItemFromOrderFunc =
                OrderController.removeItemFromOrderUNDOFunc(
                    createdOrder.id,
                    createdOrder.items[0]
                );
            const editedOrder = undoManager.doit(removeItemFromOrderFunc);

            expect(editedOrder).not.toEqual(createdOrder);

            const undoResult = undoManager.undoit(removeItemFromOrderFunc);

            expect(undoResult).toEqual(createdOrder);

            const redoResult = undoManager.redoit(removeItemFromOrderFunc);

            expect(redoResult).toEqual(editedOrder);
        });

        it("should be able to undo and redo the operation 'add / update a note from an order'", function () {
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

            const createdOrder = OrderController.createOrder(order);

            const updatedNote = "Note updated";

            const changeNoteOfOrderFunc =
                OrderController.changeNoteOfOrderUNDOFunc(
                    createdOrder.id,
                    updatedNote
                );
            const updatedOrder = undoManager.doit(changeNoteOfOrderFunc);

            expect(updatedOrder).not.toEqual(createdOrder);

            const undoResult = undoManager.undoit(changeNoteOfOrderFunc);

            expect(undoResult).toEqual(createdOrder);

            const redoResult = undoManager.redoit(changeNoteOfOrderFunc);

            expect(redoResult).toEqual(updatedOrder);
        });

        it("should be able to undo and redo the operation 'declare an item from an order as a product on the house'", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
            };

            const createdOrder = OrderController.createOrder(order);

            expect(createdOrder.items[0].productOnTheHouse).toBe(undefined);

            const declareItemAsProductOnTheHouseFunc =
                OrderController.declareItemAsProductOnTheHouseUNDOFunc(
                    createdOrder.id,
                    createdOrder.items[0].id
                );
            const updatedOrder = undoManager.doit(
                declareItemAsProductOnTheHouseFunc
            );

            expect(updatedOrder.items[0].productOnTheHouse).toBe(true);

            const undoResult = undoManager.undoit(
                declareItemAsProductOnTheHouseFunc
            );

            expect(undoResult.items[0].productOnTheHouse).toBe(false);

            const redoResult = undoManager.redoit(
                declareItemAsProductOnTheHouseFunc
            );

            expect(redoResult.items[0].productOnTheHouse).toBe(true);
        });

        it("should be able to undo and redo the operation 'undeclare an item from an order as a product on the house'", function () {
            const order = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                        productOnTheHouse: true,
                    },
                ],
            };

            const createdOrder = OrderController.createOrder(order);

            expect(createdOrder.items[0].productOnTheHouse).toBe(true);

            const undeclareItemAsProductOnTheHouseFunc =
                OrderController.undeclareItemAsProductOnTheHouseUNDOFunc(
                    createdOrder.id,
                    createdOrder.items[0].id
                );
            const updatedOrder = undoManager.doit(
                undeclareItemAsProductOnTheHouseFunc
            );

            expect(updatedOrder.items[0].productOnTheHouse).toBe(false);

            const undoResult = undoManager.undoit(
                undeclareItemAsProductOnTheHouseFunc
            );

            expect(undoResult.items[0].productOnTheHouse).toBe(true);

            const redoResult = undoManager.redoit(
                undeclareItemAsProductOnTheHouseFunc
            );

            expect(redoResult.items[0].productOnTheHouse).toBe(false);
        });
    });
});
