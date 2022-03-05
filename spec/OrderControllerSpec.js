/*
 * File: OrderControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 5th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals OrderController, UNDOmanager */

describe("OrderController", function () {
    let savedOrders;
    let savedInventories = {};
    const inventoryNames = Object.values(Constants.INVENTORIES);

    beforeEach(function () {
        savedOrders = DatabaseAPI.Orders.getOrders();

        inventoryNames.forEach((inventoryName) => {
            savedInventories[inventoryName] =
                DatabaseAPI.Inventory.getInventory(inventoryName);
        });
    });

    afterEach(function () {
        DatabaseAPI.Orders.saveOrders(savedOrders);

        for (const inventoryName in savedInventories) {
            if (Object.hasOwnProperty.call(savedInventories, inventoryName)) {
                DatabaseAPI.Inventory.saveInventory(
                    inventoryName,
                    savedInventories[inventoryName]
                );
            }
        }
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
            inventory: Constants.INVENTORIES.BAR,
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
            inventory: Constants.INVENTORIES.BAR,
        };
        const createdOrder = OrderController.createOrder(newOrder);

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
        expect(createdOrder.inventory).toBe(Constants.INVENTORIES.BAR);
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
            inventory: Constants.INVENTORIES.BAR,
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
            inventory: Constants.INVENTORIES.BAR,
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
            inventory: Constants.INVENTORIES.BAR,
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

    it("should be able to add items to an existing order", function () {
        const newOrder = {
            table: 42,
            items: [
                {
                    beverageNr: "120003",
                },
            ],
            inventory: Constants.INVENTORIES.BAR,
        };

        const createdOrder = OrderController.createOrder(newOrder);

        const newItem1 = {
            beverageNr: "8507802",
        };

        const result1 = OrderController.addItemToOrder(
            createdOrder.id,
            newItem1
        );

        expect(result1).toBeTruthy();
        expect(result1.items).toBeTruthy();
        expect(result1.items.length).toBe(2);
        expect(result1.items[1]).toBeTruthy();
        expect(result1.items[1].beverageNr).toBe(newItem1.beverageNr);
        expect(result1.items[1].id).toBeTruthy();
        expect(result1.items[1].id).not.toBe(result1.items[0].id);

        const newItem2 = {
            beverageNr: "1202501",
        };

        const result2 = OrderController.addItemToOrder(
            createdOrder.id,
            newItem2
        );

        expect(result2).toBeTruthy();
        expect(result2.items).toBeTruthy();
        expect(result2.items.length).toBe(3);
        expect(result2.items[2]).toBeTruthy();
        expect(result2.items[2].beverageNr).toBe(newItem2.beverageNr);
        expect(result2.items[2].id).toBeTruthy();
        expect(result2.items[2].id).not.toBe(result2.items[1].id);
    });

    it("should be able to remove items from an existing order", function () {
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
            inventory: Constants.INVENTORIES.BAR,
        };

        const createdOrder = OrderController.createOrder(newOrder);

        // Remove item 2
        const result1 = OrderController.removeItemFromOrder(
            createdOrder.id,
            createdOrder.items[1]
        );

        expect(result1).toBeTruthy();
        expect(result1.items).toBeTruthy();
        expect(result1.items.length).toBe(1);
        expect(result1.items[0]).toBeTruthy();
        expect(result1.items[0].beverageNr).toBe("120003");

        // Remove item 1
        const result2 = OrderController.removeItemFromOrder(
            createdOrder.id,
            createdOrder.items[0]
        );

        expect(result2).toBeTruthy();
        expect(result2.items).toBeTruthy();
        expect(result2.items.length).toBe(0);
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
            inventory: Constants.INVENTORIES.BAR,
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
            inventory: Constants.INVENTORIES.BAR,
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
            inventory: Constants.INVENTORIES.BAR,
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

    describe("that updates the number in bar inventory", function () {
        it("when new order is created (bar inventory)", function () {
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
                inventory: Constants.INVENTORIES.BAR,
            };

            const numberInStockBeforeOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    beverageNr
                ).quantity;

            OrderController.createOrder(newOrder);

            const actualNumberInStockAfterOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    beverageNr
                ).quantity;
            const expectedNumberInStockAfterOrderCreation =
                numberInStockBeforeOrderCreation - 2;

            expect(actualNumberInStockAfterOrderCreation).toBe(
                expectedNumberInStockAfterOrderCreation
            );
        });

        it("when order is removed (bar inventory)", function () {
            const beverageNr = "120003";
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: beverageNr,
                    },
                ],
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockOfBeverageBeforeOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    beverageNr
                ).quantity;

            OrderController.removeOrderById(createdOrder.id);

            const actualNumberInStockOfBeverageAfterOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    beverageNr
                ).quantity;
            const expectedNumberInStockOfBeverageAfterOrderIsRemoved =
                numberInStockOfBeverageBeforeOrderIsRemoved + 1;

            expect(actualNumberInStockOfBeverageAfterOrderIsRemoved).toBe(
                expectedNumberInStockOfBeverageAfterOrderIsRemoved
            );
        });

        it("when an item is added to an order (bar inventory)", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const newItem = {
                beverageNr: "8507802",
            };

            const numberInStockBeforeItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    newItem.beverageNr
                ).quantity;

            OrderController.addItemToOrder(createdOrder.id, newItem);

            const actualNumberInStockAfterItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    newItem.beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsAddedToOrder =
                numberInStockBeforeItemIsAddedToOrder - 1;

            expect(actualNumberInStockAfterItemIsAddedToOrder).toBe(
                expectedNumberInStockAfterItemIsAddedToOrder
            );
        });

        it("when an item is removed from an order (bar inventory)", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockBeforeItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    createdOrder.items[0].beverageNr
                ).quantity;

            OrderController.removeItemFromOrder(
                createdOrder.id,
                createdOrder.items[0]
            );

            const actualNumberInStockAfterItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    createdOrder.items[0].beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsRemovedFromOrder =
                numberInStockBeforeItemIsRemovedFromOrder + 1;

            expect(actualNumberInStockAfterItemIsRemovedFromOrder).toBe(
                expectedNumberInStockAfterItemIsRemovedFromOrder
            );
        });

        it("and checks if quantity in inventory is high enough (bar inventory)", function () {
            const beverageNr = "1217401";
            const numberOfBeveragesInInventoryBeforeChange =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
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
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder1 = OrderController.createOrder(order1);

            const numberOfBeveragesInInventoryAfterCreateOrder1 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
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
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder2 = OrderController.createOrder(order2);

            const numberOfBeveragesInInventoryAfterCreateOrder2 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.BAR,
                    beverageNr
                ).quantity;

            expect(createdOrder2).toBeFalsy();
            expect(numberOfBeveragesInInventoryAfterCreateOrder2).toBe(0);
        });
    });

    describe("that updates the number in VIP inventory", function () {
        it("when new order is created (VIP inventory)", function () {
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
                inventory: Constants.INVENTORIES.VIP,
            };

            const numberInStockBeforeOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    beverageNr
                ).quantity;

            OrderController.createOrder(newOrder);

            const actualNumberInStockAfterOrderCreation =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    beverageNr
                ).quantity;
            const expectedNumberInStockAfterOrderCreation =
                numberInStockBeforeOrderCreation - 2;

            expect(actualNumberInStockAfterOrderCreation).toBe(
                expectedNumberInStockAfterOrderCreation
            );
        });

        it("when order is removed (VIP inventory)", function () {
            const beverageNr = "120003";
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: beverageNr,
                    },
                ],
                inventory: Constants.INVENTORIES.VIP,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockOfBeverageBeforeOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    beverageNr
                ).quantity;

            OrderController.removeOrderById(createdOrder.id);

            const actualNumberInStockOfBeverageAfterOrderIsRemoved =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    beverageNr
                ).quantity;
            const expectedNumberInStockOfBeverageAfterOrderIsRemoved =
                numberInStockOfBeverageBeforeOrderIsRemoved + 1;

            expect(actualNumberInStockOfBeverageAfterOrderIsRemoved).toBe(
                expectedNumberInStockOfBeverageAfterOrderIsRemoved
            );
        });

        it("when an item is added to an order (VIP inventory)", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
                inventory: Constants.INVENTORIES.VIP,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const newItem = {
                beverageNr: "190715",
            };

            const numberInStockBeforeItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    newItem.beverageNr
                ).quantity;

            OrderController.addItemToOrder(createdOrder.id, newItem);

            const actualNumberInStockAfterItemIsAddedToOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    newItem.beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsAddedToOrder =
                numberInStockBeforeItemIsAddedToOrder - 1;

            expect(actualNumberInStockAfterItemIsAddedToOrder).toBe(
                expectedNumberInStockAfterItemIsAddedToOrder
            );
        });

        it("when an item is removed from an order (VIP inventory)", function () {
            const newOrder = {
                table: 42,
                items: [
                    {
                        beverageNr: "120003",
                    },
                ],
                inventory: Constants.INVENTORIES.VIP,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const numberInStockBeforeItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    createdOrder.items[0].beverageNr
                ).quantity;

            OrderController.removeItemFromOrder(
                createdOrder.id,
                createdOrder.items[0]
            );

            const actualNumberInStockAfterItemIsRemovedFromOrder =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    createdOrder.items[0].beverageNr
                ).quantity;
            const expectedNumberInStockAfterItemIsRemovedFromOrder =
                numberInStockBeforeItemIsRemovedFromOrder + 1;

            expect(actualNumberInStockAfterItemIsRemovedFromOrder).toBe(
                expectedNumberInStockAfterItemIsRemovedFromOrder
            );
        });

        it("and checks if quantity in inventory is high enough (VIP inventory)", function () {
            const beverageNr = "190715";
            const numberOfBeveragesInInventoryBeforeChange =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
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
                inventory: Constants.INVENTORIES.VIP,
            };

            const createdOrder1 = OrderController.createOrder(order1);

            const numberOfBeveragesInInventoryAfterCreateOrder1 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
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
                inventory: Constants.INVENTORIES.VIP,
            };

            const createdOrder2 = OrderController.createOrder(order2);

            const numberOfBeveragesInInventoryAfterCreateOrder2 =
                DatabaseAPI.Inventory.getInventoryItemByBeverageNr(
                    Constants.INVENTORIES.VIP,
                    beverageNr
                ).quantity;

            expect(createdOrder2).toBeFalsy();
            expect(numberOfBeveragesInInventoryAfterCreateOrder2).toBe(0);
        });
    });

    describe("that handles also the bills", function () {
        let savedBills;

        beforeEach(function () {
            savedBills = DatabaseAPI.Bills.getBills();
        });

        afterEach(function () {
            DatabaseAPI.Bills.saveBills(savedBills);
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
                inventory: Constants.INVENTORIES.BAR,
            };

            const expectedTotalAmount = 13.9 + 62.0 + 0;

            const createdOrder = OrderController.createOrder(order);
            const createdBill = OrderController.createBillForOrder(
                createdOrder.id
            );

            expect(createdBill).toBeTruthy();
            expect(createdBill.id).toBeTruthy();
            expect(createdBill.vipAccount).toBe(false);
            expect(Date.parse(createdBill.timestamp)).not.toBeNaN();
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
                inventory: Constants.INVENTORIES.VIP,
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
                inventory: Constants.INVENTORIES.BAR,
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
                inventory: Constants.INVENTORIES.BAR,
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

        beforeAll(function () {
            undoManager = new UNDOmanager();
        });

        beforeEach(function () {});

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
                inventory: Constants.INVENTORIES.BAR,
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

            const undoResult = undoManager.undoit();

            expect(undoResult).toEqual(createdOrder);

            const redoResult = undoManager.redoit();

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
                inventory: Constants.INVENTORIES.BAR,
            };

            const createdOrder = OrderController.createOrder(newOrder);

            const removeItemFromOrderFunc =
                OrderController.removeItemFromOrderUNDOFunc(
                    createdOrder.id,
                    createdOrder.items[0]
                );
            const editedOrder = undoManager.doit(removeItemFromOrderFunc);

            expect(editedOrder.items.length).toBe(1);

            const undoResult = undoManager.undoit();

            expect(undoResult.items.length).toBe(2);

            const redoResult = undoManager.redoit();

            expect(redoResult.items.length).toBe(1);
        });

        it("should be able to do and undo multiple operations", function () {
            const order = OrderController.createOrder({
                table: 42,
                items: [],
                inventory: Constants.INVENTORIES.BAR,
            });

            // Add item 1
            const addItem1ToOrderFunc = OrderController.addItemToOrderUNDOFunc(
                order.id,
                {
                    beverageNr: "120003",
                }
            );
            const resultAfterAddingItem1 =
                undoManager.doit(addItem1ToOrderFunc);

            expect(resultAfterAddingItem1.items.length).toBe(1);

            // Add item 2
            const addItem2ToOrderFunc = OrderController.addItemToOrderUNDOFunc(
                order.id,
                {
                    beverageNr: "1202501",
                }
            );
            const resultAfterAddingItem2 =
                undoManager.doit(addItem2ToOrderFunc);

            expect(resultAfterAddingItem2.items.length).toBe(2);

            // Add item 3
            const addItem3ToOrderFunc = OrderController.addItemToOrderUNDOFunc(
                order.id,
                {
                    beverageNr: "190201",
                }
            );
            const resultAfterAddingItem3 =
                undoManager.doit(addItem3ToOrderFunc);

            expect(resultAfterAddingItem3.items.length).toBe(3);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(3);

            // Remove item 2
            const removeItemFromOrderFunc2 =
                OrderController.removeItemFromOrderUNDOFunc(
                    order.id,
                    resultAfterAddingItem3.items[1]
                );
            const resultAfterRemoveItem2 = undoManager.doit(
                removeItemFromOrderFunc2
            );

            expect(resultAfterRemoveItem2.items.length).toBe(2);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(4);

            // Undo last operation (remove of item 2)
            const resultAfterUndo1 = undoManager.undoit();

            expect(resultAfterUndo1.items.length).toBe(3);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(3);

            // Undo last operation (add of item 3)
            const resultAfterUndo2 = undoManager.undoit();

            expect(resultAfterUndo2.items.length).toBe(2);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(2);

            // Undo last operation (add of item 2)
            const resultAfterUndo3 = undoManager.undoit();

            expect(resultAfterUndo3.items.length).toBe(1);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(1);

            // Undo last operation (add of item 1)
            const resultAfterUndo4 = undoManager.undoit();

            expect(resultAfterUndo4.items.length).toBe(0);
            expect(undoManager.getNumberOfOperationsInUndoStack()).toBe(0);
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
                inventory: Constants.INVENTORIES.BAR,
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

            const undoResult = undoManager.undoit();

            expect(undoResult).toEqual(createdOrder);

            const redoResult = undoManager.redoit();

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
                inventory: Constants.INVENTORIES.BAR,
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

            const undoResult = undoManager.undoit();

            expect(undoResult.items[0].productOnTheHouse).toBe(false);

            const redoResult = undoManager.redoit();

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
                inventory: Constants.INVENTORIES.BAR,
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

            const undoResult = undoManager.undoit();

            expect(undoResult.items[0].productOnTheHouse).toBe(true);

            const redoResult = undoManager.redoit();

            expect(redoResult.items[0].productOnTheHouse).toBe(false);
        });
    });
});
