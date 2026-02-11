import { useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { MdCheckCircle, MdCancel, MdError } from "react-icons/md";
import { useEffect, useState } from "react";

export default function VerifyOrgPage() {
  const { status } = useParams();
  const navigate = useNavigate();
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [status]);

  const renderContent = () => {
    if (status === "success") {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <MdCheckCircle size={70} className="text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-3">Organization Verified!</h2>
          <p className="text-gray-600 mt-2">You may now login with your admin account.</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg mt-6 hover:bg-violet-700 transition-all"
          >
            Go to Login
          </motion.button>
        </motion.div>
      );
    }

    if (status === "invalid") {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center"
        >
          <MdCancel size={70} className="text-red-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-3">Invalid Link</h2>
          <p className="text-gray-600 mt-2">The verification link has expired or is not valid.</p>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center"
      >
        <MdError size={70} className="text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-800 mt-3">Unexpected Error</h2>
        <p className="text-gray-600 mt-2">Please contact support or try again later.</p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {showConfetti && <Confetti />}
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
}
