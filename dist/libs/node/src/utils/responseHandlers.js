"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inValidParam = exports.recordNotFound = exports.createdDocumentResponse = exports.successResponse = exports.failureResponse = void 0;
const constants_1 = require("../constants");
const failureResponse = (data, res) => {
    let i = 0;
    if (data.name === 'ValidationError') {
        Object.keys(data.errors).forEach((key) => {
            if (i !== 1) {
                data.message = data.errors[key].message;
            }
            i++;
        });
    }
    res.message = data.message;
    return res.status(constants_1.validationError).json({
        code: constants_1.RESPONSE_CODES.ERROR,
        message: data.message ? data.message : data,
    });
};
exports.failureResponse = failureResponse;
const successResponse = (data, res) => {
    return res.status(constants_1.success).json({
        code: constants_1.RESPONSE_CODES.DEFAULT,
        message: res.message,
        data: data,
    });
};
exports.successResponse = successResponse;
const createdDocumentResponse = (data, res) => {
    return res.status(constants_1.create).json({
        code: constants_1.RESPONSE_CODES.DEFAULT,
        message: res.message,
        data: data,
    });
};
exports.createdDocumentResponse = createdDocumentResponse;
const recordNotFound = (res) => {
    return res.status(constants_1.notFoundError).json({
        code: constants_1.RESPONSE_CODES.ERROR,
        message: res.message,
        data: {},
    });
};
exports.recordNotFound = recordNotFound;
const inValidParam = (message, res) => {
    /* eslint-disable no-useless-escape */
    message = message.replace(/\"/g, '');
    res.message = message;
    return res.status(constants_1.validationError).json({
        code: constants_1.RESPONSE_CODES.ERROR,
        message: message,
        data: undefined,
    });
};
exports.inValidParam = inValidParam;
//# sourceMappingURL=responseHandlers.js.map