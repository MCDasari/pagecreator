"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const softDelete_1 = require("../plugins/softDelete");
const defaults_1 = require("../utils/defaults");
const namesSchema = ((_a = defaults_1.defaults.languages) === null || _a === void 0 ? void 0 : _a.reduce((acc, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
}, {})) || {};
const TabSchema = new mongoose_1.Schema({
    name: String,
    names: namesSchema,
    widgetId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Widget',
    },
    collectionItems: [{ type: mongoose_1.Types.ObjectId }],
});
TabSchema.plugin(softDelete_1.softDeletePlugin);
TabSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = TabSchema;
//# sourceMappingURL=Tab.js.map