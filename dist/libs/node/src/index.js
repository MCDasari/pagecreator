"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateData = exports.handleResetData = exports.setConfig = exports.TabSchema = exports.SrcSetSchema = exports.PageSchema = exports.ItemSchema = exports.WidgetSchema = exports.UserRoutes = exports.PageRoutes = exports.WidgetRoutes = void 0;
const tslib_1 = require("tslib");
const defaults_1 = require("./utils/defaults");
const WidgetRoute_1 = tslib_1.__importDefault(require("./routes/WidgetRoute"));
exports.WidgetRoutes = WidgetRoute_1.default;
const PageRoute_1 = tslib_1.__importDefault(require("./routes/PageRoute"));
exports.PageRoutes = PageRoute_1.default;
const UserRoute_1 = tslib_1.__importDefault(require("./routes/UserRoute"));
exports.UserRoutes = UserRoute_1.default;
const models_1 = require("./models");
Object.defineProperty(exports, "WidgetSchema", { enumerable: true, get: function () { return models_1.WidgetSchema; } });
Object.defineProperty(exports, "ItemSchema", { enumerable: true, get: function () { return models_1.ItemSchema; } });
Object.defineProperty(exports, "PageSchema", { enumerable: true, get: function () { return models_1.PageSchema; } });
Object.defineProperty(exports, "SrcSetSchema", { enumerable: true, get: function () { return models_1.SrcSetSchema; } });
Object.defineProperty(exports, "TabSchema", { enumerable: true, get: function () { return models_1.TabSchema; } });
const dataService_1 = require("./services/dataService");
Object.defineProperty(exports, "handleUpdateData", { enumerable: true, get: function () { return dataService_1.handleUpdateData; } });
Object.defineProperty(exports, "handleResetData", { enumerable: true, get: function () { return dataService_1.handleResetData; } });
function setConfig(config) {
    if (config.logger) {
        defaults_1.defaults.logger = config.logger;
    }
    if (typeof config.catchAsync === 'function')
        defaults_1.defaults.catchAsync = config.catchAsync;
    if (Array.isArray(config.collections)) {
        defaults_1.defaults.collections = config.collections;
    }
    if (Array.isArray(config.customWidgetTypes)) {
        defaults_1.defaults.customWidgetTypes = config.customWidgetTypes;
    }
    if (typeof config.redis === 'string' || typeof config.redis === 'object') {
        defaults_1.defaults.redis = config.redis;
    }
    if (Array.isArray(config.languages) && config.languages.length > 0) {
        defaults_1.defaults.languages = config.languages;
    }
}
exports.setConfig = setConfig;
//# sourceMappingURL=index.js.map