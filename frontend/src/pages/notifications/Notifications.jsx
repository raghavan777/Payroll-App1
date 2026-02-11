import { useEffect, useState } from "react";
import {
    getNotifications,
    markNotificationRead,
    clearNotifications,
} from "../../api/notificationApi";

export default function Notifications() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await getNotifications();
            setList(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (id) => {
        await markNotificationRead(id);
        load();
    };

    const clearAll = async () => {
        await clearNotifications();
        setList([]);
    };

    if (loading) return <p className="p-6">Loading notifications...</p>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Notifications</h2>
                {list.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {list.length === 0 ? (
                <p>No notifications</p>
            ) : (
                <div className="space-y-3">
                    {list.map((n) => (
                        <div
                            key={n._id}
                            className={`p-4 rounded shadow ${n.read ? "bg-gray-100" : "bg-white border-l-4 border-indigo-500"
                                }`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-semibold">{n.title}</h3>
                                    <p className="text-sm text-gray-600">{n.message}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {!n.read && (
                                    <button
                                        onClick={() => markRead(n._id)}
                                        className="text-indigo-600 text-sm"
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
