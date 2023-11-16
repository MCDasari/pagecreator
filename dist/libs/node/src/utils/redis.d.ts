export declare const getRedisValue: (key: string) => Promise<any>;
export declare const setRedisValue: (key: string, value: JSON) => Promise<"OK" | null>;
export declare const deleteRedisValue: (key: string) => Promise<number | null>;
