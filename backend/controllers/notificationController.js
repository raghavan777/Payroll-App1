const Notification = require("../models/Notification");

/* ===============================
   CREATE NOTIFICATION (Internal)
=============================== */
exports.createNotification = async ({ userId, organizationId, title, message, type = "SYSTEM" }) => {
    try {
        await Notification.create({
            userId,
            organizationId,
            title,
            message,
            type,
        });
    } catch (err) {
        console.error("CREATE NOTIFICATION ERROR:", err);
    }
};

/* ===============================
   GET MY NOTIFICATIONS
=============================== */
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user.id,
            organizationId: req.user.organizationId,
        }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        console.error("GET NOTIFICATIONS ERROR:", err);
        res.status(500).json({ message: "Failed to load notifications" });
    }
};

/* ===============================
   MARK AS READ
=============================== */
exports.markAsRead = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
                organizationId: req.user.organizationId,
            },
            { read: true },
            { new: true }
        );

        if (!notif) return res.status(404).json({ message: "Notification not found" });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to mark as read" });
    }
};

/* ===============================
   MARK ALL AS READ
=============================== */
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                userId: req.user.id,
                organizationId: req.user.organizationId,
                read: false,
            },
            { read: true }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to mark all as read" });
    }
};

/* ===============================
   CLEAR ALL
=============================== */
exports.clearAll = async (req, res) => {
    try {
        await Notification.deleteMany({
            userId: req.user.id,
            organizationId: req.user.organizationId,
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear notifications" });
    }
};
