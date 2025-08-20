import express from "express";
import Auth from "../middlewares/Auth.js";
import {addPurchase, getPurchase} from "../controllers/purchaseControllers.js"

const router = express.Router();

router.post('/', Auth, addPurchase);
router.post('/all', Auth, getPurchase);
// // router.get('/:id', Auth, getSingleSale);
// router.delete('/:id', Auth, deleteSale);

export default router;