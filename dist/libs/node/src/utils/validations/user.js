"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageData = exports.getWidgetData = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.getWidgetData = joi_1.default.object({
    code: joi_1.default.string().required(),
});
exports.getPageData = joi_1.default.object({
    code: joi_1.default.string().required(),
});
//# sourceMappingURL=user.js.map