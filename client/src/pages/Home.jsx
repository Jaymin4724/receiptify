// Home.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import UseSignup from "../hooks/UseSignup";
import UseLogin from "../hooks/UseLogin";
import InputField from "../components/InputField";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { loading: signupLoading, signup } = UseSignup();
  const { loading: loginLoading, login } = UseLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signup") {
      signup(formData);
    } else {
      login({ email: formData.email, password: formData.password });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen p-4 pb-8">
      <div className="hero-content flex-col lg:flex-row-reverse items-center lg:items-start gap-0 lg:gap-12 w-full max-w-6xl">
        {/* 🔹 Left side: Branding + Hero text */}
        <motion.div
          className="text-center lg:text-left max-w-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeInOut", repeatType: "reverse" }}
        >
          <div className="flex flex-col items-center lg:items-start m-2 mb-3">
            <img
              src="../src/assets/logo_4.png"
              alt="Receiptify logo"
              className="w-70"
            />
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
            Manage your expenses <br className="hidden lg:block" /> smarter, not
            harder.
          </h2>
          <p className="py-6 text-lg text-base-content/80">
            Snap, upload, and let AI do the rest. Say goodbye to manual expense
            tracking — Receiptify makes managing your money effortless.
          </p>
        </motion.div>

        {/* 🔹 Right side: Auth card */}
        <motion.div
          className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        >
          <div className="card-body space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
              )}

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              {/* 🔹 Password field with toggle */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="label text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* 🔹 Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={mode === "signup" ? signupLoading : loginLoading}
              >
                {mode === "signup" ? (
                  signupLoading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Signing up...
                    </>
                  ) : (
                    "Signup"
                  )
                ) : loginLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* 🔹 Toggle between Signup/Login */}
            <p className="text-sm text-center mt-2">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="link link-hover"
                    disabled={signupLoading}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="link link-hover"
                    disabled={loginLoading}
                  >
                    Signup
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
