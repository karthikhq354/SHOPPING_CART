import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import OtpInput from "../components/OtpInput";

const OTP_EXPIRE_SECONDS = 60;

function validateIdentifier(val) {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneReg = /^[6-9]\d{9}$/;
  return emailReg.test(val) || phoneReg.test(val.replace(/\s|-/g, ""));
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AuthPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn]);

  /* ── STEP 1 state ── */
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [nameError, setNameError] = useState("");
  const [identifierError, setIdentifierError] = useState("");

  /* ── STEP 2 state ── */
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timer, setTimer] = useState(OTP_EXPIRE_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* ── TIMER ── */
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

  /* ── SEND OTP ── */
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

  /* ── RESEND ── */
  const handleResend = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    console.log(`%c🔑 Resent OTP for ${identifier}: ${newOtp}`, "color:#7c3aed;font-size:16px;font-weight:bold;");
    setOtp(""); setOtpError("");
    setTimer(OTP_EXPIRE_SECONDS); setTimerActive(true);
  };

  /* ── VERIFY ── */
  const handleVerify = async () => {
    if (otp.length < 6) { setOtpError("Please enter the complete 6-digit OTP."); return; }
    if (timer === 0) { setOtpError("OTP has expired. Please resend."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (otp !== generatedOtp) { setOtpError("Incorrect OTP. Please try again."); setLoading(false); return; }
    clearInterval(timerRef.current);
    
    try {
      // Sync user with backend
      await userAPI.sync(name.trim(), identifier.trim());
    } catch (err) {
      console.error("Failed to sync user:", err);
    }
    
    setSuccessMsg("Verified! Welcome, " + name.trim().split(" ")[0] + " 🎉");
    // Store name + identifier so Navbar shows name
    login(identifier.trim(), name.trim());
    setTimeout(() => navigate(from, { replace: true }), 900);
    setLoading(false);
  };

  const timerDisplay = `0:${String(timer).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">

        {/* ── LEFT PANEL – brand/visual ── */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-purple-700 text-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-3xl">🎁</span>
              <span className="text-2xl font-extrabold tracking-tight">ImpressiveGift</span>
            </div>

            <h2 className="text-4xl font-black leading-tight mb-4">
              Find the Perfect Gift<br />
              <span className="text-yellow-400">for Every</span><br />
              Special Moment
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Discover unique, personalized, and premium gifts carefully selected for birthdays, anniversaries, and every celebration.
            </p>
          </div>

          {/* Testimonial card */}
          <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
            <p className="text-white/90 text-sm italic mb-4">
              "The personalized gift exceeded all expectations. Truly unforgettable!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-sm">S</div>
              <div>
                <p className="text-sm font-semibold">Sadhish</p>
                <p className="text-yellow-400 text-xs">★★★★★</p>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="relative z-10 flex gap-4 flex-wrap mt-6">
            {["🔒 Secure", "⚡ Fast Delivery", "💜 Handcrafted"].map((b) => (
              <span key={b} className="text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white/80">{b}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL – form ── */}
        <div className="bg-white flex flex-col justify-center px-8 py-12 sm:px-12">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <span className="text-2xl">🎁</span>
            <span className="text-xl font-extrabold text-purple-700">ImpressiveGift</span>
          </div>

          {step === "form" && (
            <div style={{ animation: "slideUp 0.4s ease" }}>
              <h3 className="text-2xl font-black text-purple-900 mb-1">Welcome Back 👋</h3>
              <p className="text-gray-400 text-sm mb-8">Sign in to your account using OTP — no password needed.</p>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-purple-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Karthik R"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-200
                    ${nameError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-purple-500"}`}
                />
                {nameError && <p className="text-red-500 text-xs mt-1.5">{nameError}</p>}
              </div>

              {/* Email / Phone */}
              <div className="mb-7">
                <label className="block text-sm font-semibold text-purple-700 mb-1.5">Email or Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. karthik@gmail.com or 9876543210"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setIdentifierError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-200
                    ${identifierError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-purple-500"}`}
                />
                {identifierError && <p className="text-red-500 text-xs mt-1.5">{identifierError}</p>}
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full h-12 rounded-xl font-bold text-white text-sm
                  bg-purple-700 hover:bg-purple-800
                  active:scale-95 transition-all duration-200 shadow-md shadow-purple-200"
              >
                Send OTP →
              </button>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300">no password required</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Check browser console (F12) for your OTP during testing
              </p>
            </div>
          )}

          {step === "otp" && (
            <div style={{ animation: "slideUp 0.4s ease" }}>
              <h3 className="text-2xl font-black text-purple-900 mb-1">Verify OTP 🔑</h3>
              <p className="text-gray-400 text-sm mb-6">
                We sent a 6-digit code to <strong className="text-purple-700">{identifier}</strong>
              </p>

              {/* Sent-to pill */}
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6">
                <div>
                  <p className="text-xs text-gray-400">Signing in as</p>
                  <p className="text-sm font-bold text-purple-700">{name}</p>
                </div>
                <button
                  onClick={() => { setStep("form"); setOtp(""); setOtpError(""); clearInterval(timerRef.current); setTimerActive(false); }}
                  className="text-xs text-pink-500 hover:text-pink-700 font-semibold border border-pink-200 rounded-lg px-3 py-1.5 transition"
                >
                  Change ✎
                </button>
              </div>

              {/* OTP boxes */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-purple-700 mb-3 text-center">Enter 6-Digit OTP</label>
                <OtpInput value={otp} onChange={setOtp} error={otpError} />
              </div>

              {/* Timer */}
              <div className="text-center text-sm mb-5">
                {timer > 0 ? (
                  <span className="text-gray-400">
                    OTP expires in{" "}
                    <span className={`font-bold ${timer <= 10 ? "text-red-500" : "text-purple-600"}`}>
                      {timerDisplay}
                    </span>
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">OTP expired.</span>
                )}
              </div>

              {/* Verify button */}
              {successMsg ? (
                <div className="text-center text-green-600 font-semibold py-3 bg-green-50 rounded-xl border border-green-100">
                  ✅ {successMsg}
                </div>
              ) : (
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.length < 6}
                  className={`w-full h-12 rounded-xl font-bold text-white text-sm transition-all duration-200 shadow-md
                    ${loading || otp.length < 6
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-purple-700 hover:bg-purple-800 shadow-purple-200 active:scale-95"}`}
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
                  <p className="text-xs text-gray-400">Didn't receive it? Resend available after timer ends.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}