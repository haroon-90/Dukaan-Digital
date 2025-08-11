import User from "../models/User.js";
import bcrypt from 'bcrypt'

const GetProfile = async (req, res) => {
    const id = req.user;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }

    res.json({
        name: user.name,
        email: user.email,
        role: user.role,
        shopname: user.shopname,
        phone: user.phone,
        createdAt: user.createdAt
    });
}

const getAllUsers = async (req, res) => {
    const id = req.user;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }

    if (user.role === 'admin') {
        const allUsers = await User.find().select("-password");
        res.status(200).json(allUsers);
    } else {
        res.status(403).json({ msg: "Access denied" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const id = req.params.id;

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        if (user.role != 'admin') {
            return res.status(403).json({ msg: "Access denied" })
        }
        const updateData = { name, phone };
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            updateData.password = hashed;
        }
        await User.findByIdAndUpdate(id, updateData,
            { new: true }
        );
        res.status(200).json({ message: 'User profile updated successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
        console.log(err)
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user);
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    if (user.role != 'admin') {
        return res.status(403).json({ msg: "Access denied" })
    }
    const delUser = await User.findByIdAndDelete(id);
    if (!delUser) {
        return res.status(404).json({ msg: "User not found" })
    }
    res.status(200).json({ msg: "User deleted successfully" })
}

export {
    GetProfile,
    getAllUsers,
    updateProfile,
    deleteUser
}