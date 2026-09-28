import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  StoreIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { AuthFormPanel } from "./AuthFormPanel.tsx";
import { AuthDivider } from "./AuthDivider.tsx";
import { GoogleButton } from "./GoogleButton.tsx";
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterFormValues,
} from "../../../../schema/auth.schema.ts";
import { useRegisterMutation } from "../../hooks/server/useAuth.ts";
import { toast } from "sonner";

export interface SignupFormProps {
  onSubmit?: (values: RegisterFormValues) => Promise<void> | void;
  onGoogleSignIn?: () => void;
}

export function SignupForm({ onGoogleSignIn }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      role: "user",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const navigate = useNavigate();

  const currentRole = watch("role") || "user";

  const { mutateAsync: registerMutation, isPending } = useRegisterMutation();

  const submitHandler = handleSubmit(async (values) => {
    const { email, password, fullname, role } = values;
    try {
      const registerRequest = registerMutation({
        email,
        password,
        fullname,
        role,
      });
      toast.promise(registerRequest, {
        loading: "Creating you account...",
        success: (user) => {
          reset();
          navigate(user?.role === "seller" ? "/seller" : "/user", {
            replace: true,
          });
          return `Welcome  ${user.name}`;
        },
        error: (err) =>
          err.response?.data?.message || "Account creation failed",
      });
      await registerRequest;
    } catch (err) {
      console.log("Error in signup form :", err);
    }
  });

  return (
    <AuthFormPanel
      heading="Create your account"
      subtitle="Sign up to get started with ShopFlow."
    >
      {/* Form */}
      <form onSubmit={submitHandler} noValidate className="space-y-3.5">
        <div>
          <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-2">
            Account type
          </label>
          <div
            className="grid grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Account type"
          >
            {/* User Radio */}
            <label
              htmlFor="role-user"
              className={`
                relative flex flex-col p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none group
                ${
                  currentRole === "user"
                    ? "border-[#7c5cfc] bg-purple-500/8 shadow-[0_0_16px_rgba(124,92,252,0.18)] ring-1 ring-[#7c5cfc]/30"
                    : "border-[#26272e] hover:border-[#383a45] bg-[#141519]/80"
                }
              `}
            >
              <input
                type="radio"
                id="role-user"
                value="user"
                {...register("role")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    currentRole === "user"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  <User size={15} />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    currentRole === "user"
                      ? "border-[#7c5cfc] bg-[#7c5cfc]"
                      : "border-zinc-600 bg-transparent group-hover:border-zinc-500"
                  }`}
                >
                  {currentRole === "user" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  currentRole === "user" ? "text-white" : "text-zinc-300"
                }`}
              >
                User
              </span>
              <span className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                Browse & shop products
              </span>
            </label>

            {/* Seller Radio */}
            <label
              htmlFor="role-seller"
              className={`
                relative flex flex-col p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none group
                ${
                  currentRole === "seller"
                    ? "border-[#7c5cfc] bg-purple-500/8 shadow-[0_0_16px_rgba(124,92,252,0.18)] ring-1 ring-[#7c5cfc]/30"
                    : "border-[#26272e] hover:border-[#383a45] bg-[#141519]/80"
                }
              `}
            >
              <input
                type="radio"
                id="role-seller"
                value="seller"
                {...register("role")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    currentRole === "seller"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  <StoreIcon size={15} />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    currentRole === "seller"
                      ? "border-[#7c5cfc] bg-[#7c5cfc]"
                      : "border-zinc-600 bg-transparent group-hover:border-zinc-500"
                  }`}
                >
                  {currentRole === "seller" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  currentRole === "seller" ? "text-white" : "text-zinc-300"
                }`}
              >
                Seller
              </span>
              <span className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                Sell & manage store
              </span>
            </label>
          </div>
          <FieldError message={errors.role?.message} />
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-fullName"
            className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5"
          >
            Full name
          </label>
          <div className="relative">
            <User
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={18}
              strokeWidth={1.75}
            />
            <input
              id="signup-fullName"
              type="text"
              disabled={isPending}
              placeholder="Alex Morgan"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullname)}
              {...register("fullname")}
              className={`
                w-full
                h-10
                rounded-lg
                border
                bg-[#141519]
                pl-10
                pr-3.5
                text-sm
                text-zinc-100
                outline-none
                transition-all
                placeholder:text-zinc-500
                ${
                  errors.fullname
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10"
                    : "border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                }
              `}
            />
          </div>
          <FieldError message={errors.fullname?.message} />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="signup-email"
            className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={18}
              strokeWidth={1.75}
            />
            <input
              id="signup-email"
              disabled={isPending}
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
              className={`
                w-full
                h-10
                rounded-lg
                border
                bg-[#141519]
                pl-10
                pr-3.5
                text-sm
                text-zinc-100
                outline-none
                transition-all
                placeholder:text-zinc-500
                ${
                  errors.email
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10"
                    : "border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                }
              `}
            />
          </div>
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="signup-password"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              Password
            </label>
            <span className="text-[11px] text-zinc-500">Min 8 characters</span>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={18}
              strokeWidth={1.75}
            />
            <input
              id="signup-password"
              disabled={isPending}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
              className={`
                w-full
                h-10
                rounded-lg
                border
                bg-[#141519]
                pl-10
                pr-10
                text-sm
                text-zinc-100
                outline-none
                transition-all
                placeholder:text-zinc-500
                ${
                  errors.password
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10"
                    : "border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                }
              `}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-zinc-400
                transition-colors
                hover:text-zinc-200
                focus:outline-none
                cursor-pointer
              "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="signup-confirmPassword"
            className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={18}
              strokeWidth={1.75}
            />
            <input
              id="signup-confirmPassword"
              disabled={isPending}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
              className={`
                w-full
                h-10
                rounded-lg
                border
                bg-[#141519]
                pl-10
                pr-10
                text-sm
                text-zinc-100
                outline-none
                transition-all
                placeholder:text-zinc-500
                ${
                  errors.confirmPassword
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10"
                    : "border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                }
              `}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-zinc-400
                transition-colors
                hover:text-zinc-200
                focus:outline-none
                cursor-pointer
              "
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: 1.008 }}
            whileTap={{ scale: 0.992 }}
            className="
              w-full
              h-10
              rounded-lg
              bg-[#7c5cfc]
              hover:bg-[#6f4def]
              active:bg-[#613fe0]
              text-white
              text-sm
              font-medium
              transition-all
              shadow-[0_4px_16px_rgba(124,92,252,0.28)]
              flex
              disabled:cursor-not-allowed
              items-center
              justify-center
              gap-2
              focus:outline-none
              focus:ring-2
              focus:ring-purple-400/50
              cursor-pointer
            "
          >
            {isPending ? (
              <span>Creating account...</span>
            ) : (
              <span>Create account</span>
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Google OAuth Button */}
        <GoogleButton onClick={onGoogleSignIn} />

        {/* Switch Link */}
        <div className="pt-3 text-center">
          <span className="text-xs text-zinc-400">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthFormPanel>
  );
}

export default SignupForm;

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -2 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -2 }}
          transition={{ duration: 0.2 }}
          role="alert"
          className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-normal"
        >
          <AlertCircle size={14} className="shrink-0" />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
