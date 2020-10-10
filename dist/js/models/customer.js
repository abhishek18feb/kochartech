"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('Customer', customerSchema);
