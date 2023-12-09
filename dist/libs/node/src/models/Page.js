"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const softDelete_1 = require("../plugins/softDelete");
const PageSchema = new mongoose_1.Schema({
    name: String,
    code: { type: String, index: true },
    slug: String,
    widgets: [{ type: mongoose_1.Types.ObjectId,
            // ref: 'Widget' 
        }],
});
PageSchema.plugin(softDelete_1.softDeletePlugin);
PageSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = PageSchema;
//# sourceMappingURL=Page.js.map