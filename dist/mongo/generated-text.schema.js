"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratedTextSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GeneratedTextSchema = new mongoose_1.Schema({
    userId: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
});
//# sourceMappingURL=generated-text.schema.js.map