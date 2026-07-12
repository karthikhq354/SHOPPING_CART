import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import OtpInput from "./OtpInput";

const OTP_EXPIRE_SECONDS = 60;

function validateIdentifier(val) {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneReg = /^[6-9]\d{9}$/;
  return emailReg.test(val) || phoneReg.test(val.replace(/\s|-/g, ""));
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AuthModal({ onClose }) {
  const { login } = useAuth();

  /* ── state ── */
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [nameError, setNameError] = useState("");
  const [identifierError, setIdentifierError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timer, setTimer] = useState(OTP_EXPIRE_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* close on Escape */
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── timer ── */
  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  /* ── send OTP ── */
  const handleSendOtp = () => {
    let valid = true;
    if (!name.trim()) { setNameError("Please enter your full name."); valid = false; }
    else setNameError("");
    if (!identifier.trim()) { setIdentifierError("Please enter your email or phone number."); valid = false; }
    else if (!validateIdentifier(identifier.trim())) { setIdentifierError("Enter a valid email or 10-digit mobile number."); valid = false; }
    else setIdentifierError("");
    if (!valid) return;

    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    console.log(`%c🔑 OTP for ${identifier}: ${newOtp}`, "color:#7c3aed;font-size:16px;font-weight:bold;");
    setOtp(""); setOtpError("");
    setTimer(OTP_EXPIRE_SECONDS); setTimerActive(true);
    setStep("otp");
  };

  /* ── resend ── */
  const handleResend = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    console.log(`%c🔑 Resent OTP for ${identifier}: ${newOtp}`, "color:#7c3aed;font-size:16px;font-weight:bold;");
    setOtp(""); setOtpError("");
    setTimer(OTP_EXPIRE_SECONDS); setTimerActive(true);
  };

  /* ── verify ── */
  const handleVerify = async () => {
    if (otp.length < 6) { setOtpError("Please enter the complete 6-digit OTP."); return; }
    if (timer === 0) { setOtpError("OTP expired. Please resend."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (otp !== generatedOtp) { setOtpError("Incorrect OTP. Please try again."); setLoading(false); return; }
    clearInterval(timerRef.current);
    const firstName = name.trim().split(" ")[0];
    setSuccessMsg(`Welcome, ${firstName}! 🎉`);
    login(identifier.trim(), name.trim());
    setTimeout(() => onClose(), 1000);
    setLoading(false);
  };

  const timerDisplay = `0:${String(timer).padStart(2, "0")}`;

  return (
    /* ── backdrop ── */
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", animation: "fadeIn 0.2s ease" }}
      onClick={onClose}
    >
      {/* ── modal card ── */}
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex"
        style={{ minHeight: 520, animation: "slideUp 0.3s ease" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── LEFT: brand image panel ── */}
        <div className="hidden sm:flex w-[42%] flex-col justify-between p-8 bg-purple-700 relative overflow-hidden flex-shrink-0">
          {/* decorative blobs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-pink-500/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-yellow-400/10 rounded-full" />

          {/* logo */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="text-lg font-extrabold text-white tracking-tight">ImpressiveGift</span>
          </div>

          {/* quote */}
          <div className="relative z-10">
            <p className="text-white text-xl font-black leading-snug mb-4">
              "Find the perfect gift<br />
              <span className="text-yellow-400">for every</span><br />
              special moment!"
            </p>
            <p className="text-white/60 text-xs leading-relaxed">
              Unique, personalized, and premium gifts for birthdays, anniversaries, and every celebration.
            </p>
          </div>

          {/* mini testimonial */}
          <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-4">
            <p className="text-white/80 text-xs italic mb-3">
              "The personalized gift exceeded all expectations. Truly unforgettable!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-xs">S</div>
              <div>
                <p className="text-white text-xs font-semibold">Sadhish</p>
                <p className="text-yellow-400 text-[10px]">★★★★★</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="flex-1 bg-white flex flex-col px-7 py-8 sm:px-10 relative">

          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition text-lg font-bold"
          >
            ✕
          </button>

          {/* ── STEP: form ── */}
          {step === "form" && (
            <div className="flex flex-col flex-1 justify-center" style={{ animation: "slideUp 0.3s ease" }}>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Login</h2>
              <p className="text-gray-500 text-sm mb-7">Enter your details to continue.</p>

              {/* Full Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 bg-gray-50 border
                    focus:bg-white focus:ring-2 focus:ring-purple-300
                    ${nameError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-purple-500"}`}
                />
                {nameError && <p className="text-red-500 text-xs mt-1.5 ml-1">{nameError}</p>}
              </div>

              {/* Email / Phone */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setIdentifierError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 bg-gray-50 border
                    focus:bg-white focus:ring-2 focus:ring-purple-300
                    ${identifierError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-purple-500"}`}
                />
                {identifierError && <p className="text-red-500 text-xs mt-1.5 ml-1">{identifierError}</p>}
              </div>

              {/* Continue button */}
              <button
                onClick={handleSendOtp}
                className="w-full h-12 rounded-xl font-bold text-white text-sm bg-purple-700 hover:bg-purple-800 active:scale-95 transition-all duration-200 shadow-md shadow-purple-200 mb-5"
              >
                Continue
              </button>

              {/* OR divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-gray-400 mb-4 leading-relaxed">
                By continuing, you agree to the{" "}
                <span className="font-semibold text-gray-600 cursor-pointer hover:underline">Terms of Sale</span>,{" "}
                <span className="font-semibold text-gray-600 cursor-pointer hover:underline">Terms of Service</span>, and{" "}
                <span className="font-semibold text-gray-600 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              {/* Social login buttons (UI only) */}
              <div className="space-y-2.5">
                <button className="w-full h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.7 13.2 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/><path fill="#FBBC05" d="M10.9 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.4-6z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.3-3.7-13.1-9.1l-8.4 6C6.9 42.6 14.8 48 24 48z"/></svg>
                  Continue with Google
                </button>
                <button className="w-full h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 32 32"><path fill="#1877F2" d="M32 16C32 7.163 24.837 0 16 0S0 7.163 0 16c0 7.985 5.845 14.604 13.5 15.806V20.625H9.437V16H13.5v-3.562c0-4.01 2.389-6.225 6.044-6.225 1.75 0 3.58.313 3.58.313v3.937h-2.017c-1.987 0-2.607 1.233-2.607 2.497V16h4.438l-.71 4.625H18.5v11.181C26.155 30.604 32 23.985 32 16z"/></svg>
                  Continue with Facebook
                </button>
                <button className="w-full h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.5 270.1-317.5 37.5 0 99.9 20.6 143.9 20.6 42.2 0 114.7-22.6 164.4-22.6 30.1 0 130.9 2.1 198.3 99.2z"/><path d="M554.4 113.5c21-26 35.4-62.2 35.4-98.4 0-5.1-.6-10.2-1.3-15.3-34.2 1.3-74.9 22.6-99.3 51.2-19.4 21.9-37 57.8-37 94.9 0 5.7.6 11.3 1 13.4 2.3.6 5.7.6 9 .6 31.3 0 70.4-20.7 92.2-46.4z"/></svg>
                  Continue with Apple
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-300 mt-4">Check browser console (F12) for OTP during testing</p>
            </div>
          )}

          {/* ── STEP: otp ── */}
          {step === "otp" && (
            <div className="flex flex-col flex-1 justify-center" style={{ animation: "slideUp 0.3s ease" }}>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Verify OTP 🔑</h2>
              <p className="text-gray-500 text-sm mb-6">
                Code sent to <strong className="text-purple-700">{identifier}</strong>
              </p>

              {/* User info pill */}
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6">
                <div>
                  <p className="text-xs text-gray-400">Signing in as</p>
                  <p className="text-sm font-bold text-purple-700">{name}</p>
                </div>
                <button
                  onClick={() => { setStep("form"); setOtp(""); setOtpError(""); clearInterval(timerRef.current); setTimerActive(false); }}
                  className="text-xs text-pink-500 hover:text-pink-700 font-semibold border border-pink-200 rounded-lg px-3 py-1.5 transition hover:bg-pink-50"
                >
                  Change ✎
                </button>
              </div>

              {/* OTP boxes */}
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Enter 6-Digit OTP</label>
              <OtpInput value={otp} onChange={setOtp} error={otpError} />

              {/* Timer */}
              <div className="text-center text-sm my-4">
                {timer > 0 ? (
                  <span className="text-gray-400">
                    Expires in{" "}
                    <span className={`font-bold ${timer <= 10 ? "text-red-500" : "text-purple-600"}`}>
                      {timerDisplay}
                    </span>
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">OTP expired.</span>
                )}
              </div>

              {/* Success / verify */}
              {successMsg ? (
                <div className="text-center text-green-600 font-semibold py-3 bg-green-50 rounded-xl border border-green-100">
                  ✅ {successMsg}
                </div>
              ) : (
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.length < 6}
                  className={`w-full h-12 rounded-xl font-bold text-white text-sm transition-all duration-200
                    ${loading || otp.length < 6
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-200 active:scale-95"}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Verifying…
                    </span>
                  ) : "Verify & Sign In ✓"}
                </button>
              )}

              {/* Resend */}
              <div className="mt-4 text-center">
                {timer === 0 ? (
                  <button onClick={handleResend}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 rounded-lg px-4 py-2 transition hover:bg-purple-50">
                    Resend OTP →
                  </button>
                ) : (
                  <p className="text-xs text-gray-400">Resend available after timer ends.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}