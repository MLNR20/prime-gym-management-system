import { useState } from "react";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import primeImg from "../../assets/prime.jpg";
import { API_URL } from "../../config/api";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword(): React.ReactElement {
  const { token } = useParams<{ token: string }>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        { password: data.password },
      );
      setIsSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setSubmitError("This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* LEFT SIDE — background image */}
      <div
        className="hidden tablet-landscape:flex tablet-landscape:w-1/2 desktop-landscape:flex desktop-landscape:w-7/12 flex-col justify-end p-12"
        style={{
          backgroundImage: `url(${primeImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-white/80 mt-2 text-lg">
            Your fitness journey starts here.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="w-full tablet-landscape:w-1/2 desktop-landscape:w-5/12 flex-auto px-10 md:px-24 py-24 flex items-center bg-white">
        <div className="w-full md:landscape:max-w-md">
          <div className="flex min-w-full flex-col gap-6">
            <Header
              header="Reset Password"
              subheader="Choose a new password for your account."
            />

            {isSubmitted ? (
              <div className="alert alert-success text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <span>Password reset! Redirecting you to login...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {submitError && (
                  <div className="alert alert-error text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password..."
                      className={`input input-bordered h-12 border bg-white border-gray-700 w-full pr-12 ${
                        errors.password ? "input-error" : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Confirm Password</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password..."
                    className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={18} className="border-2 border-white/40 border-t-white" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
