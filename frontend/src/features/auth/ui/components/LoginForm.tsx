import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';


import { AuthFormPanel } from './AuthFormPanel.tsx';
import { AuthDivider } from './AuthDivider.tsx';
import { GoogleButton } from './GoogleButton.tsx';
import { loginSchema, type LoginFormInput, type LoginFormValues } from '../../../../schema/auth.schema.ts';
import { useLoginMutation } from '../../hooks/server/useAuth.ts';
import { toast } from 'sonner';

export interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  onGoogleSignIn?: () => void;
}

export function LoginForm({
  onGoogleSignIn,

}: LoginFormProps) {

  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const {mutateAsync:loginMutation,isPending} = useLoginMutation();

  const navigate = useNavigate();

  const submitHandler = handleSubmit(async (values) => {
    
    const {email,password} = values;
    try{

        toast.promise(loginMutation({email,password}),{
            loading:"Signing in...",
            success:(user)=>{
               reset();
               navigate(
                 user?.role==="seller" ?"/seller":"/user",
                 {replace:true}
               )
               return `Welcome back ${user.name}`
            },
            error:(err)=>err.response?.data?.message || "login failed"
        })

    }catch(err){
        console.log("Error in login form :",err);

    }
  });

  return (
    <AuthFormPanel
      heading="Welcome back"
      subtitle="Sign in to continue to your account."
    >

      {/* Forgot Password Notice */}
      {forgotPasswordNotice && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2.5 rounded-lg bg-[#20222a] border border-[#2d303b] text-zinc-300 text-xs flex items-center justify-between"
        >
          <span>Password recovery flow can be plugged in here.</span>
          <button
            type="button"
            onClick={() => setForgotPasswordNotice(false)}
            className="text-zinc-500 hover:text-zinc-300 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={submitHandler} noValidate className="space-y-4">
        {/* Email Field with inlined input and icon */}
        <div>
          <label
            htmlFor="login-email"
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
              id="login-email"
              type="email"
              placeholder="name@company.com"
              disabled={isPending}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
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
                    ? 'border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10'
                    : 'border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40'
                }
              `}
            />
          </div>
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password Field with inlined input, icon, and show/hide button */}
        <div>
          <label
            htmlFor="login-password"
            className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={18}
              strokeWidth={1.75}
            />
            <input
              id="login-password"
               disabled={isPending}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
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
                    ? 'border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 bg-rose-950/10'
                    : 'border-[#26272e] hover:border-[#353740] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40'
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="login-remember-me"
              className="w-4 h-4 rounded bg-[#141519] border-[#2e303b] text-[#7c5cfc] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer accent-[#7c5cfc]"
              {...register('rememberMe')}
            />
            <span className="text-xs text-zinc-300 hover:text-zinc-200">
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={() => setForgotPasswordNotice(true)}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium focus:outline-none cursor-pointer"
          >
            Forgot password?
          </button>
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
              items-center
              justify-center
              gap-1.5
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-purple-400/50
              cursor-pointer
            "
          >
            <span>Sign in</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Google OAuth Button */}
        <GoogleButton onClick={onGoogleSignIn} />

        {/* Switch Link */}
        <div className="pt-4 text-center">
          <span className="text-xs text-zinc-400">
            Don't have an account?{' '}
          </span>
          <Link
            to="/signup"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthFormPanel>
  );
}

export default LoginForm;

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -2 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
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
