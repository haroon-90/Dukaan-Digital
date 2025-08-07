import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true
    },
    period: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    totalSales: {
        type: Number,
        default: 0
    },
    totalUdhaar: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    totalPurchase: {
        type: Number,
        default: 0
    },
    lowStockItems: {
        type: Number,
        default: 0
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Report = mongoose.model("Report", reportSchema);
export default Report;