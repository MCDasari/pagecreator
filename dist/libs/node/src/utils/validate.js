"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const defaults_1 = require("./defaults");
const responseHandlers_1 = require("./responseHandlers");
const validate = (validator) => {
    return function (req, res, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                req.body = yield validator.validateAsync(req.body);
                next();
            }
            catch (err) {
                defaults_1.defaults.logger.error('ValidationError', err);
                if (err.isJoi)
                    (0, responseHandlers_1.inValidParam)(err.message, res);
                else
                    (0, responseHandlers_1.failureResponse)(err.message, res);
            }
        });
    };
};
exports.default = validate;
//# sourceMappingURL=validate.js.map