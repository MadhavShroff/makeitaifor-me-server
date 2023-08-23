"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessedTextSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProcessedTextSchema = new mongoose_1.Schema({
    userId: String,
    text: String,
    Etag: String,
    timestamp: { type: Date, default: Date.now },
});
//# sourceMappingURL=processed-text.schema.js.map