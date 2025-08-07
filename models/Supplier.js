import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    productsSupplied: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
