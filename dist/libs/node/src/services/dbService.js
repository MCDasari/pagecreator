"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkInsert = exports.getOne = exports.list = exports.getAll = exports.deleteAll = exports.remove = exports.update = exports.create = void 0;
const tslib_1 = require("tslib");
// create
function create(Modal, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const modalInstance = new Modal(data);
        return yield modalInstance.save();
    });
}
exports.create = create;
// update
function update(Modal, query, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield getOne(Modal, query);
        const result = yield Modal.findOneAndUpdate(query, data, { new: true });
        return result || undefined;
    });
}
exports.update = update;
// soft-delete
function remove(Modal, query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const modalInstance = yield getOne(Modal, query);
        return yield modalInstance.remove();
    });
}
exports.remove = remove;
// delete-all
function deleteAll(Modal, query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Modal.deleteMany(query);
    });
}
exports.deleteAll = deleteAll;
// get-all
function getAll(Modal, query = {}, options, projection
// eslint-disable-next-line @typescript-eslint/ban-types
) {
    return Modal.find(query, projection, options);
}
exports.getAll = getAll;
// list
function list(Modal, where, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const documents = Modal.paginate(where, options);
            return documents;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
exports.list = list;
// get-one
function getOne(Modal, query, projection) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const modalInstance = yield Modal.findOne(query, projection);
        if (!modalInstance)
            throw new Error(`Record not found ${Modal.name ? `in ${Modal.name}` : ''}`);
        return modalInstance;
    });
}
exports.getOne = getOne;
// bulk-insert
function bulkInsert(Modal, docs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield Modal.insertMany(docs);
    });
}
exports.bulkInsert = bulkInsert;
//# sourceMappingURL=dbService.js.map