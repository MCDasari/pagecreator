"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRedisValue = exports.setRedisValue = exports.getRedisValue = void 0;
const tslib_1 = require("tslib");
const lzutf8_1 = tslib_1.__importDefault(require("lzutf8"));
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
const defaults_1 = require("./defaults");
let redis = null;
const initRedis = () => {
    if (defaults_1.defaults.redis && typeof defaults_1.defaults.redis === 'string') {
        redis = new ioredis_1.default(defaults_1.defaults.redis);
    }
    else if (defaults_1.defaults.redis && typeof defaults_1.defaults.redis === 'object') {
        redis = new ioredis_1.default(defaults_1.defaults.redis.PORT, defaults_1.defaults.redis.HOST, {
            password: defaults_1.defaults.redis.PASSWORD,
            username: defaults_1.defaults.redis.USER,
            db: defaults_1.defaults.redis.DB,
        });
    }
    else
        redis = undefined;
};
const getRedisValue = (key) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (redis === null) {
        initRedis();
    }
    if (!redis) {
        return null;
    }
    const value = yield redis.get(key);
    if (!value) {
        return null;
    }
    const str = lzutf8_1.default.decompress(lzutf8_1.default.decodeBase64(value));
    return JSON.parse(str);
});
exports.getRedisValue = getRedisValue;
const setRedisValue = (key, value) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (redis === null) {
        initRedis();
    }
    if (!redis) {
        return null;
    }
    const compressed = lzutf8_1.default.encodeBase64(lzutf8_1.default.compress(JSON.stringify(value)));
    return yield redis.set(key, compressed);
});
exports.setRedisValue = setRedisValue;
const deleteRedisValue = (key) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (redis === null) {
        initRedis();
    }
    if (!redis) {
        return null;
    }
    return yield redis.del(key);
});
exports.deleteRedisValue = deleteRedisValue;
//# sourceMappingURL=redis.js.map