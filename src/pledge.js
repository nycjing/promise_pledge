'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/

// YOUR CODE HERE:
function $Promise(executor) {

    if (typeof executor !== 'function') throw new TypeError(/executor.+function/i);
    this._state = 'pending';
    this._value;
    return true;
};

$Promise.prototype._internalResolve = function (data) {
    if (this._state === 'pending') {

        this._state = 'fulfilled';
        this._value = data;

    }
};

$Promise.prototype._internalReject = function (data) {
    if (this._state === 'pending') {

        this._state = 'rejected';
        this._value = data;

    }

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
