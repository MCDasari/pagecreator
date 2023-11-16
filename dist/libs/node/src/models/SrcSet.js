"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SrcSetSchema = new mongoose_1.Schema({
    width: Number,
    height: Number,
    screenSize: Number,
    itemId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Item',
    },
});
exports.default = SrcSetSchema;
//# sourceMappingURL=SrcSet.js.map