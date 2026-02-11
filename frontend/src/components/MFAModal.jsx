import { useState } from "react";
import axios from "axios";

export default function MFAModal({ onSuccess }) {
  const [code, setCode] = useState("");

  const verify = async () => {
    try {
      await axios.post("/api/auth/mfa/verify", { code }, { withCredentials: true });
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Code");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-2">Enter MFA Code</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="123456"
        />
        <button
          onClick={verify}
          className="mt-3 bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
