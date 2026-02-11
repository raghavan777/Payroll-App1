import axios from "axios";
import MFAModal from "../components/MFAModal";
import { createRoot } from "react-dom/client";

export async function secureAction(requestFn) {
  try {
    return await requestFn();
  } catch (err) {
    if (err.response?.data?.requireMFA) {
      await axios.post("/api/auth/mfa/request", {}, { withCredentials: true });

      return new Promise((resolve) => {
        const modalRoot = document.createElement("div");
        document.body.appendChild(modalRoot);

        const modal = createRoot(modalRoot);
        modal.render(
          <MFAModal
            onSuccess={async () => {
              const res = await requestFn({ "x-mfa-verified": true });
              modalRoot.remove();
              resolve(res);
            }}
          />
        );
      });
    }

    throw err;
  }
}
