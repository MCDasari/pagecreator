"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express_1.default);
const validate_1 = tslib_1.__importDefault(require("../utils/validate"));
const tabValidation = tslib_1.__importStar(require("../utils/validations/tab"));
const widgetValidation = tslib_1.__importStar(require("../utils/validations/widget"));
const widgetController = tslib_1.__importStar(require("../controllers/WidgetController"));
const tabController = tslib_1.__importStar(require("../controllers/TabController"));
const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express_1.default.Router();
routes.use(express_1.default.json());
// Widget Routes
// Get widget types
routes
    .get('/widget-types', widgetController.getItemsTypes)
    .descriptor(`${descriptorPrefix}widget.getItemsTypes`);
// Get widget selection types
routes
    .get('/selection-types', widgetController.getWidgetTypes)
    .descriptor(`${descriptorPrefix}widget.getWidgetTypes`);
// Get all widgets
routes
    .post(`/list`, (0, validate_1.default)(widgetValidation.list), widgetController.getWidgets)
    .descriptor(`${descriptorPrefix}widget.getAll`);
// Create a widget
routes
    .post(`/`, (0, validate_1.default)(widgetValidation.create), widgetController.createWidget)
    .descriptor(`${descriptorPrefix}widget.create`);
// Update a widget
routes
    .put(`/:id`, (0, validate_1.default)(widgetValidation.update), widgetController.updateWidget)
    .descriptor(`${descriptorPrefix}widget.update`);
// Partial Update a widget
routes
    .patch(`/:id`, (0, validate_1.default)(widgetValidation.partialUpdate), widgetController.partialUpdateWidget)
    .descriptor(`${descriptorPrefix}widget.partialUpdate`);
// Delete a widget
routes
    .delete(`/:id`, widgetController.deleteWidget)
    .descriptor(`${descriptorPrefix}widget.delete`);
// Get dynamic collection data
routes
    .post('/collection-data', (0, validate_1.default)(widgetValidation.getCollectionData), widgetController.getCollectionData)
    .descriptor(`${descriptorPrefix}widget.getCollectionData`);
// Tabs
routes
    .post('/tabs', (0, validate_1.default)(tabValidation.create), tabController.createTab)
    .descriptor(`${descriptorPrefix}tab.create`);
routes
    .put('/tabs/:tabId', (0, validate_1.default)(tabValidation.update), tabController.updateTab)
    .descriptor(`${descriptorPrefix}tab.update`);
routes
    .delete('/tabs/:tabId', tabController.deleteTab)
    .descriptor(`${descriptorPrefix}tab.delete`);
routes
    .get('/tabs/:widgetId', tabController.getTabs)
    .descriptor(`${descriptorPrefix}tab.getAll`);
// Get all languages
routes.get(`/languages`, widgetController.getLanguages);
// Get single widget
routes
    .get(`/:id`, widgetController.getSingleWidget)
    .descriptor(`${descriptorPrefix}widget.getOne`);
exports.default = routes;
//# sourceMappingURL=WidgetRoute.js.map