import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import axios from "axios";

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

  const onSubmit = async(data: FormData) => {
    console.log("Form Data:", data);

    try
    {
      const loginRoute = await axios.post("http://localhost:3002/auth/login", data)
      const token = loginRoute.data.token;
      console.log(token)
      localStorage.setItem("token", token);
      navigate("/");
    }
    catch(error)
    {
      console.log(error)
    }
  };

  return (
    <div className="flex flex-row min-h-screen">

      {/* LEFT SIDE (empty / image placeholder) */}
      <div className="w-7/12 flex-auto bg-base-200"></div>

      {/* RIGHT SIDE (form) */}
      <div className="w-5/12 flex-auto px-24 py-24   flex items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">

          <div className="flex min-w-full flex-col gap-6">

            <Header
              header="Login"
              subheader="Welcome back! Let's get to work..."
            />
            <div className="flex w-full flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username..."
                className={`input input-bordered h-12  bg-white border border-gray-700 w-full ${errors.userName ? "input-error" : ""
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
            <div className="flex  flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password..."
                className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${errors.password ? "input-error" : ""
                  }`}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}