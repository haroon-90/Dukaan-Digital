import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";

import AuthRoutes from './routes/authRoutes.js'
import ProfileRoutes from './routes/profileRoute.js'
import ProductRoutes from './routes/ProductRoutes.js'
import SalesRoutes from './routes/SalesRoutes.js'
import UdhaarRoutes from './routes/UdhaarRoutes.js'
import ExpenseRoutes from './routes/ExpenseRoutes.js'
import ReportRoutes from './routes/ReportRoutes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
    res.send("Welcome to server")
})

app.use('/api/auth', AuthRoutes)
app.use('/api/profile', ProfileRoutes)
app.use('/api/products', ProductRoutes)
app.use('/api/sales', SalesRoutes)
app.use('/api/udhaar', UdhaarRoutes)
app.use('/api/expense', ExpenseRoutes)
app.use('/api/report', ReportRoutes)

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(() => {
        console.log("Error connecting with MongoDB");
    })
