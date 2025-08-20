import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        suppliername: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        items: [
            {
                itemname: {
                    type: String,
                    required: true
                },
                purchasePrice: {
                    type: Number,
                    required: true,
                    min: 0
                },
                quantity: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Purchase = mongoose.model('purchase', purchaseSchema);
export default Purchase;