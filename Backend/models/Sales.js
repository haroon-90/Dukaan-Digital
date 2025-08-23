import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true
                },
                productName: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        customerName: {
            type: String
        },
        totalAmount: {
            type: Number,
            required: true
        },
        saleProfit: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;