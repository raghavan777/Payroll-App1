import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Attendance() {
    const { employeeCode } = useParams();
    const [attendance, setAttendance] = useState([]);

    const [date, setDate] = useState("");
    const [status, setStatus] = useState("PRESENT");
    const [hours, setHours] = useState(8);

    const token = localStorage.getItem("token");

    const loadAttendance = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/attendance/${employeeCode}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAttendance(res.data);
        } catch {
            toast.error("Failed to fetch attendance");
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [employeeCode]);

    /* ===== STATUS → HOURS LOGIC ===== */
    const handleStatusChange = (value) => {
        setStatus(value);

        if (value === "ABSENT") setHours(0);
        else if (value === "HALF_DAY") setHours(4);
        else setHours(8);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/api/attendance",
                {
                    employeeCode,
                    date,
                    status,
                    hoursWorked: Number(hours),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Attendance added");
            setDate("");
            setStatus("PRESENT");
            setHours(8);
            loadAttendance();
        } catch {
            toast.error("Failed to add attendance");
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded shadow-md">

                <h2 className="text-2xl font-semibold mb-6">
                    Attendance — {employeeCode}
                </h2>

                {/* ===== ADMIN ENTRY FORM ===== */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-4 gap-4 items-end mb-6"
                >
                    {/* DATE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="PRESENT">PRESENT</option>
                            <option value="HALF_DAY">HALF DAY</option>
                            <option value="ABSENT">ABSENT</option>
                        </select>
                    </div>

                    {/* HOURS */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hours
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="24"
                            value={hours}
                            disabled={status !== "PRESENT"}
                            onChange={(e) => setHours(e.target.value)}
                            className="border p-2 rounded w-full bg-gray-50"
                        />
                    </div>

                    {/* BUTTON */}
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                        Add Attendance
                    </button>
                </form>

                {/* ===== ATTENDANCE TABLE ===== */}
                {attendance.length === 0 ? (
                    <p className="text-gray-500">No attendance records found</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((a) => (
                                <tr key={a._id}>
                                    <td className="border p-2">
                                        {new Date(a.date).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2">{a.status}</td>
                                    <td className="border p-2">{a.hoursWorked}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}
