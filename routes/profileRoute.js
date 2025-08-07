import express from "express";
import Auth from "../middlewares/Auth.js";
import { GetProfile, getAllUsers, updateProfile, deleteUser } from "../controllers/profileControllers.js";

const router = express.Router();

router.get('/', Auth, GetProfile)
router.get('/allusers', Auth, getAllUsers)
router.put('/update/:id', Auth, updateProfile)
router.delete('/delete/:id', Auth, deleteUser)

export default router