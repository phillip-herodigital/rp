/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, App) {
    var Subscription = (function () {
        function Subscription(id, message_id, alwaysFire, callback) {
            this.id = id;
            this.message_id = message_id;
            this.alwaysFire = alwaysFire;
            this.callback = callback;
        }
        Subscription.prototype.unSubscribe = function () {
            new Bus().unSubscribe(this);
        };
        return Subscription;
    })();

    var Message = (function () {
        function Message(message) {
            this.message = message;
            this._id = message;
            this._subscriptions = [];
            this._nextId = 0;
        }
        Message.prototype.subscribe = function (callback, alwaysFire) {
            if (typeof alwaysFire === "undefined") { alwaysFire = false; }
            var subscription = new Subscription(this._nextId++, this._id, alwaysFire, callback);
            this._subscriptions[subscription.id] = subscription;
            return this._subscriptions[subscription.id];
        };

        Message.prototype.unSubscribe = function (subRef) {
            var idx = 0, len = this._subscriptions.length;

            while (idx < len) {
                if (this._subscriptions[idx] === subRef) {
                    this._subscriptions.splice(idx, 1);
                    this._subscriptions[idx] = undefined;
                }
                break;
                idx += 1;
            }
        };

        Message.prototype.notify = function (payload, data, mute) {
            this._subscriptions.forEach(function (sub) {
                if (sub.alwaysFire || !mute) {
                    sub.callback(payload, data);
                }
            });
        };
        return Message;
    })();

    var Bus = (function () {
        function Bus() {
            if (Bus._instance === null) {
                this.init();
            }
            return Bus._instance;
        }
        Bus.prototype.init = function () {
            this._messages = {};
            Bus._instance = this;
        };

        Bus.prototype.subscribe = function (message, callback, alwaysFire) {
            if (typeof alwaysFire === "undefined") { alwaysFire = false; }
            var msg;
            msg = this._messages[message] || (this._messages[message] = new Message(message));
            return msg.subscribe(callback, alwaysFire);
        };

        Bus.prototype.unSubscribe = function (subRef) {
            if (!(subRef instanceof Subscription)) {
                return false;
            }
            (this._messages[subRef.message_id]).unSubscribe(subRef);
        };

        Bus.prototype.publish = function (message, payload, data) {
            var mute = App.AppState.pathSelected;
            if (data && data.ignoreMute) {
                mute = false;
            }

            if (this._messages[message]) {
                (this._messages[message]).notify(payload, data, mute);
            }
        };
        Bus._instance = null;
        return Bus;
    })();
    exports.Bus = Bus;
});
