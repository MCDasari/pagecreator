"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutePrefix = exports.notFoundError = exports.validationError = exports.internalServerError = exports.create = exports.success = exports.MONGOOSE_FIND_QUERIES = exports.REGEXS = exports.RESPONSE_CODES = exports.VALIDATION = void 0;
exports.VALIDATION = {
    WIDGET_EXISTS: 'Widget with same code is available!',
    SLUG_EXISTS: 'Widget with same slug is available!',
};
exports.RESPONSE_CODES = {
    DEFAULT: 'SUCCESS',
    ERROR: 'ERROR',
};
exports.REGEXS = {
    OBJECTID_CAST_FAILED: /Cast to ObjectId failed/gm,
};
exports.MONGOOSE_FIND_QUERIES = [
    'count',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany',
];
exports.success = 200;
exports.create = 201;
exports.internalServerError = 500;
exports.validationError = 422;
exports.notFoundError = 404;
exports.messageRoutePrefix = 'msg';
//# sourceMappingURL=index.js.map