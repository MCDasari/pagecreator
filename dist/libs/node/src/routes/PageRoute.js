"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express_1.default);
const validate_1 = tslib_1.__importDefault(require("../utils/validate"));
const pageValidation = tslib_1.__importStar(require("../utils/validations/page"));
const pageController = tslib_1.__importStar(require("../controllers/PageController"));
const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express_1.default.Router();
routes.use(express_1.default.json());
// Get all pages
routes
    .post(`/list`, (0, validate_1.default)(pageValidation.list), pageController.getPages)
    .descriptor(`${descriptorPrefix}page.getAll`);
// Create a page
routes
    .post(`/`, (0, validate_1.default)(pageValidation.create), pageController.createPage)
    .descriptor(`${descriptorPrefix}page.create`);
// Update a page
routes
    .put(`/:id`, (0, validate_1.default)(pageValidation.update), pageController.updatePage)
    .descriptor(`${descriptorPrefix}page.update`);
// Delete a page
routes
    .delete(`/:id`, pageController.deletePage)
    .descriptor(`${descriptorPrefix}page.delete`);
exports.default = routes;
//# sourceMappingURL=PageRoute.js.map