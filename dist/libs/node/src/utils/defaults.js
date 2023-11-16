"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonExcludedFields = exports.defaults = void 0;
const constants_1 = require("../constants");
exports.defaults = {
    logger: console,
    catchAsync: (fn, modal = '') => (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            let message = err.message;
            if (message.match(constants_1.REGEXS.OBJECTID_CAST_FAILED)) {
                message = `${modal} not found with given id!`;
            }
            // this.logger.error(err.message);
            res.status(constants_1.internalServerError).json({
                code: constants_1.RESPONSE_CODES.ERROR,
                message,
                data: undefined,
            });
        });
    },
    collections: [],
    customWidgetTypes: [],
    redis: undefined,
    languages: [],
};
exports.commonExcludedFields = {
    __v: 0,
    isDeleted: 0,
    deletedAt: 0,
};
//# sourceMappingURL=defaults.js.map