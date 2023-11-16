"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express_1.default);
const validate_1 = tslib_1.__importDefault(require("../utils/validate"));
const userValidation = tslib_1.__importStar(require("../utils/validations/user"));
const userController = tslib_1.__importStar(require("../controllers/UserController"));
const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express_1.default.Router();
routes.use(express_1.default.json());
// Item Routes
// Get Widget Data
routes
    .post(`/widget-data`, (0, validate_1.default)(userValidation.getWidgetData), userController.getWidgetData)
    .descriptor(`${descriptorPrefix}user.getWidgetData`);
// Get Page Data
routes
    .post('/page-data', (0, validate_1.default)(userValidation.getPageData), userController.getPageData)
    .descriptor(`${descriptorPrefix}user.getPageData`);
exports.default = routes;
//# sourceMappingURL=UserRoute.js.map