import express from "express";
import Auth from "../middlewares/Auth.js";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productControllers.js';

const router = express.Router();

router.post('/', Auth, addProduct);
router.get('/', Auth, getProducts);
router.get('/:id', Auth, getProductById);
router.put('/:id', Auth, updateProduct);
router.delete('/:id', Auth, deleteProduct);

export default router;