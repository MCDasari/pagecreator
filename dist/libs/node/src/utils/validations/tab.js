"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.create = joi_1.default.object({
    name: joi_1.default.string().optional(),
    names: joi_1.default.object().optional(),
    widgetId: joi_1.default.string().required(),
    collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.update = joi_1.default.object({
    name: joi_1.default.string().optional(),
    names: joi_1.default.object().optional(),
    widgetId: joi_1.default.string().optional(),
    collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
//# sourceMappingURL=tab.js.map