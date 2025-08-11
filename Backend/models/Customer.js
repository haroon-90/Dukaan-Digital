import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    totalDue: {
        type: Number,
        default: 0,
        min: 0
    },
    lastPaymentDate: {
        type: Date,
    }
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
