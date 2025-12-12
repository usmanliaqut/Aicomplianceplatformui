import { motion } from "motion/react";
import { Building2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

// ------------------
// Zod Validation
// ------------------
const RegisterSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof RegisterSchema>;

export function Register() {
  const navigate = useNavigate();
  const { register: userRegister } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    userRegister.mutate({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
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
        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-2xl border border-[#0B67FF]/20">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-[#0B67FF]/20 rounded-2xl mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Building2 size={32} className="text-[#0B67FF]" />
            </motion.div>
            <h2 className="mb-2">Create Account</h2>
            <p className="text-[#6B7280]">Get started with your free account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[#F8FAFC] mb-1">Full Name</label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  size={20}
                />
                <input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC]"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#F8FAFC] mb-1">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  size={20}
                />
                <input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC]"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#F8FAFC] mb-1">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  size={20}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC]"
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
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#F8FAFC] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  size={20}
                />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="w-full pl-12 pr-12 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              variant="primary"
              disabled={userRegister.isPending}
            >
              {userRegister.isPending ? "Creating..." : "Create Account"}
              <ArrowRight className="inline ml-2" size={20} />
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-[#6B7280] mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#0B67FF] hover:text-[#0952CC]"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
