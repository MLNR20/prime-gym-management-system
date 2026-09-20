import { useState } from "react";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import primeImg from "../../assets/prime.jpg";
import { API_URL } from "../../config/api";

type FormData = {
  email: string;
  otp: string;
};

export default function VerifyOtp(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = (location.state as { email?: string } | null)?.email ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { email: prefilledEmail } });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const emailValue = watch("email");

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, data);
      setIsSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setSubmitError("That code is invalid or has expired. Please try again or request a new one.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!emailValue) return;
    setResendMessage(null);
    setIsResending(true);
    try {
      await axios.post(`${API_URL}/auth/resend-otp`, { email: emailValue });
      setResendMessage("A new code has been sent to your email.");
    } catch (error) {
      setResendMessage("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
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
          <h1 className="text-white text-3xl font-bold">Prime Gym</h1>
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
              header="Verify Your Email"
              subheader="Enter the code we sent to your email to activate your account."
            />

            {isSubmitted ? (
              <div className="alert alert-success text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <span>
                  Email verified! An admin still needs to approve your account
                  before you can log in. Redirecting you to login...
                </span>
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

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your account email..."
                    className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                      errors.email ? "input-error" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Verification Code</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter the 6-digit code..."
                    className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                      errors.otp ? "input-error" : ""
                    }`}
                    {...register("otp", {
                      required: "Verification code is required",
                    })}
                  />
                  {errors.otp && (
                    <span className="text-red-500 text-sm">
                      {errors.otp.message}
                    </span>
                  )}
                </div>

                {resendMessage && (
                  <p className="text-sm text-gray-500">{resendMessage}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={18} className="border-2 border-white/40 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || !emailValue}
                  className="btn btn-ghost w-full"
                >
                  {isResending ? "Resending..." : "Resend code"}
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
