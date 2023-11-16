"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeletePlugin = void 0;
const tslib_1 = require("tslib");
const softDeletePlugin = (schema) => {
    schema.add({
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    });
    const typesFindQueryMiddleware = [
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
    const setDocumentIsDeleted = (doc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        doc.isDeleted = true;
        doc.deletedAt = new Date();
        doc.$isDeleted(true);
        yield doc.save();
    });
    const excludeInFindQueriesIsDeleted = function (next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this['where']({ isDeleted: false });
            next();
        });
    };
    const excludeInDeletedInAggregateMiddleware = function (next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.pipeline().unshift({ $match: { isDeleted: false } });
            next();
        });
    };
    schema.pre('remove', function (next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield setDocumentIsDeleted(this);
            next();
        });
    });
    typesFindQueryMiddleware.forEach((type) => {
        schema.pre(type, excludeInFindQueriesIsDeleted);
    });
    schema.pre('aggregate', excludeInDeletedInAggregateMiddleware);
    schema.method('toJSON', function () {
        const obj = this.toObject();
        delete obj.isDeleted;
        delete obj.deletedAt;
        return obj;
    });
};
exports.softDeletePlugin = softDeletePlugin;
//# sourceMappingURL=softDelete.js.map