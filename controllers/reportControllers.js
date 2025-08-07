import Sale from "../models/Sales.js";
import Expense from "../models/Expense.js";
import Udhaar from "../models/Udhaar.js";

import { FindDailyReport } from "../utils/DailyReport.js";

const getDailyReport = async (req, res) => {
    try {
        const userId = req.user;
        const createdAt = {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999))
        };
        const sale = await Sale.find({ userId, createdAt });
        // console.log(sale)
        const expense = await Expense.find({ userId, createdAt });
        // console.log(expense)
        const udhaar = await Udhaar.find({ userId, createdAt });
        // console.log(udhaar)

        const report = await FindDailyReport(sale, expense, udhaar);

        res.status(200).json(report)
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const getMonthlyReport = async (req, res) => {
    res.send("getMonthlyReport");
};

export {
    getDailyReport,
    getMonthlyReport
};
