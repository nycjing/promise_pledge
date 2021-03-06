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

$Promise.prototype._internalResolve = function (data) {
    if (this._state === 'pending') {

        this._state = 'fulfilled';
        this._value = data;
        this._callHandlers();
    }
};

$Promise.prototype._internalReject = function (data) {
    if (this._state === 'pending') {

        this._state = 'rejected';
        this._value = data;
        this._callHandlers();
    }

};

$Promise.prototype.then = function (success, error) {
    var successCb, errorCb;
    // var newPromise = new $Promise();
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
    var downstreamPromise = new $Promise(function(){});
    this._handlerGroups.push({successCb: successCb, errorCb: errorCb, downstreamPromise});

    this._callHandlers();
    return downstreamPromise;

};


$Promise.prototype.catch = function (error) {

    return this.then(null,error);

};

$Promise.resolve = function (value) {
     var newPromise = new $Promise(()=>{});
     if (value instanceof $Promise) {
         return value;
     }
    newPromise._internalResolve(value);
    return newPromise;
};

$Promise.all = function(value){
    console.log(typeof value);
    var results =[];
    var total = value.length;
    var completed = 0;
    if (!Array.isArray(value)) throw new TypeError('need an array');
    return new $Promise(function (resolve, reject) {
        value.forEach((item, idx) => {
            $Promise.resolve(item)
            .then((val) => {
            results[idx] = val;
            if (++completed === total) resolve(results);
            })
            .catch(function (err) {
                 reject(err);
            });
        })

    })
};

$Promise.prototype._callHandlers = function () {

    if (this._state === 'pending') return
    if (this._handlerGroups) {
        this._handlerGroups.forEach(handler => {
            if(this._state === 'fulfilled')
             {
                if (typeof handler.successCb === 'function') {
                    try{
                        var promiseAResult= handler.successCb(this._value);
                        if (promiseAResult instanceof $Promise ){
                            promiseAResult.then((value,reseaon)=>{
                                handler.downstreamPromise._internalResolve(value),
                                handler.downstreamPromise._internalReject(reseaon)

                            }).catch((error)=>{
                                handler.downstreamPromise._internalReject(error)
                            })

                        }
                        else

                            handler.downstreamPromise._internalResolve(promiseAResult);
                    }
                    catch(err){
                        handler.downstreamPromise._internalReject(err);
                    }

                }
                else{
                    handler.downstreamPromise._internalResolve(this._value)
                }
            };

              if(this._state === 'rejected')
            {
            if (typeof handler.errorCb === 'function') {
                try {
                    var promiseAResult = handler.errorCb(this._value);
                    if (promiseAResult instanceof $Promise ){
                        promiseAResult.then((value,reseaon)=>{
                            handler.downstreamPromise._internalResolve(value),
                            handler.downstreamPromise._internalReject(reseaon)

                    }).catch((error)=>{
                            handler.downstreamPromise._internalReject(error)
                    })

                    }
                    else

                    handler.downstreamPromise._internalResolve(promiseAResult)
                }
                catch(err){
                    handler.downstreamPromise._internalReject(err);
                }

            }
            else{
                handler.downstreamPromise._internalReject(this._value)
            }
            }
    })
        ;
    }

    this._handlerGroups = [];
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
