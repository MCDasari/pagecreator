"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const softDelete_1 = require("../plugins/softDelete");
const types_1 = require("../types");
const defaults_1 = require("../utils/defaults");
const titlesSchema = ((_a = defaults_1.defaults.languages) === null || _a === void 0 ? void 0 : _a.reduce((acc, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
}, {})) || {};
const imagesSchema = ((_b = defaults_1.defaults.languages) === null || _b === void 0 ? void 0 : _b.reduce((acc, lang) => {
    acc[lang.code] = { type: mongoose_1.Schema.Types.ObjectId, ref: 'file' };
    return acc;
}, {})) || {};
const altTextsSchema = ((_c = defaults_1.defaults.languages) === null || _c === void 0 ? void 0 : _c.reduce((acc, lang) => {
    acc[lang.code] = { type: String };
    return acc;
}, {})) || {};
const ItemSchema = new mongoose_1.Schema({
    widgetId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Widget',
    },
    title: String,
    titles: titlesSchema,
    subtitle: String,
    subtitles: titlesSchema,
    altText: String,
    altTexts: altTextsSchema,
    link: String,
    sequence: Number,
    img: { type: mongoose_1.Schema.Types.ObjectId, ref: 'file' },
    imgs: imagesSchema,
    itemType: {
        type: String,
        enum: Object.values(types_1.ItemTypes),
        default: types_1.ItemTypes.Web,
        required: true,
    },
});
ItemSchema.plugin(softDelete_1.softDeletePlugin);
ItemSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = ItemSchema;
//# sourceMappingURL=Item.js.map