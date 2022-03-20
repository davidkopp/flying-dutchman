/*
 * File: UNDOmanager.js
 *
 * Manager for Undo/Redo operations.
 * The manager requires that the functions are stored as objects with three functions each: execute, unexecute and reexecute. Since the model is very small here, the functions are also necessarily simple.
 *
 * Author: Lars Oestreicher
 */
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/

/**
 * The constructor function for the UNDOmanager.
 *
 * @param {Function} [updateViewCallback] A optional callback function that
 *   updates a view.
 */
var UNDOmanager = function (updateViewCallback) {
    /**
     * The data base for the UNDO-REDO mechanism is stored in two stacks. Both
     * of these are empty to start with.
     */
    let undostack = [];
    let redostack = [];

    let callback = function () {
        if (typeof updateViewCallback === "function") {
            this.updateViewCallback();
        }
    };

    /**
     * Executes the desired operation by calling the `execute` function inside
     * the provided function object and add it to the undo stack. Note that the
     * REDO-stack is resetted!
     *
     * @param {Function} funcobj The function object conists of three functions...
     * @param {Function} funcobj.execute The function that actually executes the
     *   desired operation.
     * @param {Function} funcobj.unexecute The function to be able to undo the execution.
     * @param {Function} funcobj.reexecute The function to be able to redo the execution.
     * @returns {any} The return value of the execution function.
     */
    this.doit = function (funcobj) {
        const retVal = funcobj.execute();
        undostack.push(funcobj);
        redostack = [];
        callback();
        return retVal;
    };

    /**
     * Undo the operation by calling the `unexecute` function inside the
     * function object that's on top of the UNDO-stack. The function object will
     * be removed from the UNDO-stack and added to the REDO-stack.
     *
     * @returns {any} The return value of the unexecution function.
     */
    this.undoit = function () {
        const funcobj = undostack.pop();
        if (!funcobj) return;
        const retVal = funcobj.unexecute();
        redostack.push(funcobj);
        callback();
        return retVal;
    };

    /**
     * Redo the operation by calling the `reexecute` function inside the
     * function object that's on top of the REDO-stack. The function object will
     * be removed from the REDO-stack and added to the UNDO-stack.
     *
     * @returns {any} The return value of the reexecution function.
     */
    this.redoit = function () {
        const funcobj = redostack.pop();
        if (!funcobj) return;
        const retVal = funcobj.reexecute();
        undostack.push(funcobj);
        callback();
        return retVal;
    };

    /** Cleans up the undo and redo stacks. Can be helpful for testing. */
    this.cleanup = function () {
        undostack = [];
        redostack = [];
    };

    /**
     * Returns the number of operations in the undo stack. Can be helpful for testing.
     *
     * @returns {number} The number of operations in the undo stack.
     */
    this.getNumberOfOperationsInUndoStack = function () {
        return undostack.length;
    };

    /**
     * Returns the number of operations in the redo stack. Can be helpful for testing.
     *
     * @returns {number} The number of operations in the redo stack.
     */
    this.getNumberOfOperationsInRedoStack = function () {
        return redostack.length;
    };
};
