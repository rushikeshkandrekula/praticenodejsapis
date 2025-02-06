"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrResponseobject = exports.Responsewithobject = void 0;
class Responsewithobject {
    constructor(status = 200, message = '', details = {}) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
}
exports.Responsewithobject = Responsewithobject;
class ErrResponseobject {
    constructor(status = 400, message = '', details = {}) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
}
exports.ErrResponseobject = ErrResponseobject;
