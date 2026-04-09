import Header from "../../components/Header";
import { useForm } from "react-hook-form";

type FormData = {
  userName: string;
  password: string;
};

export default function Login(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
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
                {...register("userName", {
                  required: "Username is required",
                })}
              />

              {errors.userName && (
                <span className="text-red-500 text-sm">
                  {errors.userName.message}
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