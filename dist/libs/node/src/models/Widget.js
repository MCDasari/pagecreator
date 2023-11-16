"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const softDelete_1 = require("../plugins/softDelete");
const types_1 = require("../types");
const defaults_1 = require("../utils/defaults");
const languageTitlesSchema = ((_a = defaults_1.defaults.languages) === null || _a === void 0 ? void 0 : _a.reduce((acc, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
}, {})) || {};
const WidgetSchema = new mongoose_1.Schema({
    name: String,
    code: String,
    autoPlay: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    widgetTitle: String,
    widgetTitles: languageTitlesSchema,
    webPerRow: Number,
    mobilePerRow: Number,
    tabletPerRow: Number,
    collectionName: String,
    backgroundColor: String,
    collectionItems: [{ type: mongoose_1.Types.ObjectId, refPath: 'collectionName' }],
    itemsType: {
        type: String,
        default: types_1.ItemsType.Image,
        required: true,
    },
    widgetType: {
        type: String,
        default: types_1.WidgetTypes.FixedCard,
        required: true,
    },
    tabs: [
        {
            name: String,
            names: languageTitlesSchema,
            collectionItems: [{ type: mongoose_1.Types.ObjectId, refPath: 'collectionName' }],
        },
    ],
});
WidgetSchema.plugin(softDelete_1.softDeletePlugin);
WidgetSchema.plugin(mongoose_paginate_v2_1.default);
// const Widget = model(
//   'Widget',
//   WidgetSchema
// ) as unknown as IModel<IWidgetSchema>;
exports.default = WidgetSchema;
//# sourceMappingURL=Widget.js.map