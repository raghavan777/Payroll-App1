import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get("/api/audit");
                setLogs(res.data);
            } catch (err) {
                toast.error("Failed to fetch audit logs");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">System Audit Trail</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 text-lg">Loading logs...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-4 font-semibold">Timestamp</th>
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Action</th>
                                    <th className="p-4 font-semibold">Module</th>
                                    <th className="p-4 font-semibold">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">No audit logs found.</td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{log.userId?.name || "System"}</div>
                                                <div className="text-xs text-gray-400">{log.userId?.email}</div>
                                            </td>
                                            <td className="p-4 font-medium">{log.action}</td>
                                            <td className="p-4 text-sm text-gray-600">{log.module}</td>
                                            <td className="p-4 text-sm text-gray-500">
                                                <pre className="text-xs whitespace-pre-wrap max-w-sm">
                                                    {JSON.stringify(log.details, null, 2)}
                                                </pre>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
