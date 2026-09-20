import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import primeImg from "../../assets/prime.jpg";
import { API_URL } from "../../config/api";

type FormData = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register(): React.ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (error) {
      console.log(error);
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
      <div className="w-full tablet-landscape:w-1/2 desktop-landscape:w-5/12 flex-auto px-10 md:px-24 py-16 flex items-center bg-white overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:landscape:max-w-md">
          <div className="flex min-w-full flex-col gap-5">
            <Header
              header="Sign Up"
              subheader="Create your Prime Gym account"
            />

            {/* First & Last Name Row */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label className="label">
                  <span className="label-text text-black">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                    errors.first_name ? "input-error" : ""
                  }`}
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm">
                    {errors.first_name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="label">
                  <span className="label-text text-black">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                    errors.last_name ? "input-error" : ""
                  }`}
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm">
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
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

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email..."
                className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password..."
                className={`input input-bordered h-12 bg-white border border-gray-700 w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
