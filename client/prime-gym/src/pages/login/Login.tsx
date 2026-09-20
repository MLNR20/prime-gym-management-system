import { useState } from "react";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import primeImg from "../../assets/prime.jpg";
import { API_URL } from "../../config/api";

type FormData = {
  username: string;
  password: string;
};

export default function Login(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [otpPending, setOtpPending] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    setOtpPending(false);
    setIsLoggingIn(true);
    try {
      const loginRoute = await axios.post(
        `${API_URL}/auth/login`,
        data,
      );
      const token = loginRoute.data.token;
      login(token);
      navigate("/");
    } catch (error: any) {
      const reason = error?.response?.data?.reason;
      const message = error?.response?.data?.error;
      setOtpPending(reason === "otp_pending");
      setLoginError(message ?? "Invalid username or password. Please try again.");
    } finally {
      setIsLoggingIn(false);
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
        {/* Overlay text */}
        <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-white text-3xl font-bold">Prime Gym</h1>
          <p className="text-white/80 mt-2 text-lg">
            Your fitness journey starts here.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="w-full tablet-landscape:w-1/2 desktop-landscape:w-5/12 flex-auto px-10 md:px-24 py-24 flex items-center bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:landscape:max-w-md">
          <div className="flex min-w-full flex-col gap-6">
            <Header
              header="Login"
              subheader="Welcome back! Let's get to work..."
            />

            {/* Incorrect credentials error banner */}
            {loginError && (
              <div className="alert alert-error text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{loginError}</span>
              </div>
            )}

            {otpPending && (
              <p className="text-sm text-gray-500">
                <Link to="/verify-otp" className="text-primary font-medium hover:underline">
                  Verify your email
                </Link>
              </p>
            )}

            {/* Username */}
            <div className="flex w-full flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username..."
                className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                  errors.username ? "input-error" : ""
                }`}
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* Password with show/hide toggle */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  className={`input input-bordered h-12 border bg-white border-gray-700 w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
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
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Spinner size={18} className="border-2 border-white/40 border-t-white" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
