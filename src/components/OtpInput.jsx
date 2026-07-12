import { useRef, useEffect } from "react";

export default function OtpInput({ value, onChange, error }) {
  const inputs = useRef([]);

  // Split value into 6 chars
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const arr = digits.map((d) => d);
    arr[idx] = val[val.length - 1];
    onChange(arr.join(""));
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const arr = digits.map((d) => d);
      arr[idx] = "";
      onChange(arr.join(""));
      if (idx > 0) inputs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200
              ${error ? "border-red-400 bg-red-50" : digit ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200"}
            `}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
    </div>
  );
}