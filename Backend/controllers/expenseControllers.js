import { json } from "express";
import Expense from "../models/Expense.js";

const addExpense = async (req, res) => {
    try {
        const userId = req.user;
        const { title, description, amount } = req.body;
        if (!title || !amount) {
            return res.status(402).json({ msg: "Title and amount are required" })
        }
        const newExpense = new Expense({
            userId,
            title,
            description: description || "Description not available",
            amount
        })
        await newExpense.save();
        res.status(200).json({ msg: "Expense saved successfully!" })
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const getExpenses = async (req, res) => {
    try {
        const userId = req.user;
        const expenses = await Expense.find({ userId });
        if (!expenses || expenses.length == 0) {
            return res.status(404).json({ msg: "No record found" })
        }
        res.status(200).json(expenses);
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: "Required expense not found" })
        }
        if (expense.userId != req.user) {
            return res.status(403).json({ msg: "Access denied" })
        }
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Expense deleted successfully" })
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export {
    addExpense,
    getExpenses,
    deleteExpense
};
