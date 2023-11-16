import mongoose from 'mongoose';
export type TWithSoftDeleted = {
    isDeleted?: boolean;
    deletedAt?: Date | null;
};
declare const softDeletePlugin: (schema: mongoose.Schema) => void;
export { softDeletePlugin };
