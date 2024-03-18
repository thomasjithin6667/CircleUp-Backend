"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
const asyncHandler = require('express-async-handler');
const first = (req, res) => {
    res.send("userside");
};
exports.first = first;
