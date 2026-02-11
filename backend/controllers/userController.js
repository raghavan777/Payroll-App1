const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.inviteUser = async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // check if email exists
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            organizationId: req.user.organizationId
        });

        await user.save();
        return res.status(201).json({ message: "User invited successfully!" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getUsersByOrg = async (req, res) => {
    try {
        const users = await User.find({ organizationId: req.user.organizationId })
            .select("-password");
        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.userId, { role });
        res.status(200).json({ message: "Role updated successfully!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
