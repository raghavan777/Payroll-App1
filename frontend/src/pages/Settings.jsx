import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function Settings() {
    const [org, setOrg] = useState({
        name: "",
        country: "",
        domain: "",
        address: "",
        timezone: "Asia/Kolkata",
        currency: "INR"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const res = await api.get("/api/organization");
                setOrg(res.data);
            } catch (err) {
                toast.error("Failed to load organization settings");
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/api/organization", org);
            toast.success("Settings updated successfully");
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Organization Settings</h2>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Organization Name</label>
                    <input
                        className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={org.name}
                        onChange={e => setOrg({ ...org, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Domain</label>
                    <input
                        className="w-full bg-gray-50 border-gray-200 border p-3 rounded-lg cursor-not-allowed outline-none"
                        value={org.domain}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Country</label>
                    <input
                        className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={org.country}
                        onChange={e => setOrg({ ...org, country: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Currency</label>
                    <select
                        className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={org.currency}
                        onChange={e => setOrg({ ...org, currency: e.target.value })}
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Address</label>
                    <textarea
                        className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        rows="3"
                        value={org.address}
                        onChange={e => setOrg({ ...org, address: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
