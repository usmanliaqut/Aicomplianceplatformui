import { motion } from "motion/react";
import { Building2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#0F172A] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B67FF]/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-2xl shadow-[#0B67FF]/10 border border-[#0B67FF]/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-[#0B67FF]/20 rounded-2xl mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Building2 size={32} className="text-[#0B67FF]" />
            </motion.div>
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-[#6B7280]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#F8FAFC] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full pl-12 pr-4 py-3 bg-[#0F172A] border rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-500"
                      : "border-[#0B67FF]/30 focus:border-[#0B67FF]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[#F8FAFC] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full pl-12 pr-12 py-3 bg-[#0F172A] border rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#0B67FF]/30 focus:border-[#0B67FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-[#0F172A] border border-[#0B67FF]/30 rounded accent-[#0B67FF]"
                />
                <span className="text-[#6B7280]">Remember me</span>
              </label>
              <a
                href="#"
                className="text-[#0B67FF] hover:text-[#0952CC] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button variant="primary" className="w-full">
              {isSubmitting ? "Signing in..." : "Sign In"}{" "}
              <ArrowRight size={20} className="inline ml-2" />
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[#6B7280] mt-8">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#0B67FF] hover:text-[#0952CC] transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
