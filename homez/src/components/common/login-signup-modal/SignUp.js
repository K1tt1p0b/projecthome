import Link from "next/link";

const SignUp = () => {
  return (
    <form className="form-style1">
      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Email"
          required
        />
      </div>
      {/* End Email */}

      <div className="mb20">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Password"
          required
        />
      </div>
      {/* End Password */}

      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit">
          Create account <i className="fal fa-arrow-right-long" />
        </button>
      </div>
      {/* End submit */}
      <p className="dark-color text-center mb0 mt10">
        Already Have an Account?{" "}
        <Link className="dark-color fw600" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
