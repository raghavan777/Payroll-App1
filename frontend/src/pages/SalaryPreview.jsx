import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MdReceipt,
  MdArrowBack,
  MdTrendingUp,
  MdTrendingDown,
  MdPayments,
  MdAccountBalance,
  MdShield,
  MdLayers
} from "react-icons/md";

export default function SalaryPreview() {
  const { id } = useParams(); // profileId
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/salary-template/calculate/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data);
      } catch (err) {
        toast.error("Cloud computation failed");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [id, token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold tracking-tight">Projecting financial model...</p>
    </div>
  );

  if (!data) return (
    <div className="p-20 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
        <MdLayers size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Simulation Failed</h3>
      <p className="text-slate-500 max-w-xs mx-auto">Unable to generate salary projection for the provided entity reference.</p>
    </div>
  );

  const {
    templateName,
    earnings,
    deductions,
    netSalary,
    employeeCode
  } = data;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Structured Compensation</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] flex items-center gap-2">
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md">{employeeCode}</span>
            <span>Projected Forecast</span>
          </p>
        </div>

        <Link
          to={`/payroll-profile/${employeeCode}`}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 font-bold px-6 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all active:scale-95 text-sm"
        >
          <MdArrowBack size={18} />
          <span>Institutional Profile</span>
        </Link>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-12">
        <div className="space-y-12">
          {/* Blueprint Info */}
          <div className="flex items-center gap-4 pb-8 border-b border-slate-100">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
              <MdReceipt size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-none mb-1">{templateName || "Modular Framework"}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Blueprint Protocol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* EARNINGS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <MdTrendingUp size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Gross Accruals</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Base Compensation</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                    ₹{(earnings?.basic || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Regional Housing (HRA)</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                    ₹{(earnings?.hra || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Flexible Allowances</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                    ₹{(earnings?.allowances || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Accrued</span>
                  <span className="text-lg font-black text-emerald-600 font-mono tracking-tighter">
                    ₹{(earnings?.grossSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <MdTrendingDown size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Statutory Deductions</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Provident Fund (PF)</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                    ₹{(deductions?.pf || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">State Insurance (ESI)</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                    ₹{(deductions?.esi || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Withholding Tax</span>
                  <span className="text-sm font-black text-rose-600 font-mono tracking-tighter">
                    ₹{(deductions?.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Deducted</span>
                  <span className="text-lg font-black text-rose-600 font-mono tracking-tighter">
                    ₹{(deductions?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NET HIGHLIGHT */}
          <div className="relative mt-12 p-10 bg-indigo-900 rounded-[32px] text-white flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300">
                <MdAccountBalance size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Projected Net Disbursement</p>
                <h3 className="text-4xl font-black font-mono tracking-tighter">
                  ₹{(netSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>

            <div className="relative flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 italic text-xs font-bold text-indigo-200">
              <MdShield size={18} />
              <span>Verified Computational Result</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
