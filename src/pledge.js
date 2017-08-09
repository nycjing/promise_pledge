'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/

// YOUR CODE HERE:
function $Promise(executor) {

    if (typeof executor !== 'function') throw new TypeError(/executor.+function/i);
    this._state = 'pending';
    this._value;
    var resolve = this._internalResolve.bind(this);
    var reject = this._internalReject.bind(this);
    executor(resolve, reject);
    this._handlerGroups = [];
    return true;
};

$Promise.prototype._internalResolve = function(data) {
    if (this._state === 'pending') {

        this._state = 'fulfilled';
        this._value = data;

    }
};

$Promise.prototype._internalReject = function(data) {
    if (this._state === 'pending') {

        this._state = 'rejected';
        this._value = data;

    }

};

$Promise.prototype.then = function(success, error) {
    var successCb, errorCb;
    if (typeof success === 'function') {
        successCb = success;
    } else {
        successCb = null;
    }
    if (typeof error === 'function') {
        errorCb = error;
    } else {
        errorCb = null;
    }
    this._handlerGroups.push({ successCb, errorCb });
};

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
