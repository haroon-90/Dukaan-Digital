import express from "express";
import Auth from "../middlewares/Auth.js";
import { getDailyReport, getMonthlyReport } from '../controllers/reportControllers.js';

const router = express.Router();

router.get('/daily', Auth, getDailyReport);
router.get('/monthly', Auth, getMonthlyReport);

export default router;