import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(true);

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-[#faf7f5]" />
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    );
  }
  return children;
}