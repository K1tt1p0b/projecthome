"use client";

import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

const LoginSignupModal = () => {
  const [activeTab, setActiveTab] = useState("signin"); // signin | signup | forgot

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  const isActive = (tab) =>
    tab === activeTab ? "nav-link active fw600" : "nav-link fw600";

  const paneClass = (tab) =>
    `tab-pane fade fz15 ${activeTab === tab ? "show active" : ""}`;

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalToggleLabel">
          {activeTab === "forgot" ? "Reset your password" : "Welcome to LandX"}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>

      <div className="modal-body">
        <div className="log-reg-form">
          <div className="navtab-style2">
            <nav>
              <div className="nav nav-tabs mb20" id="nav-tab" role="tablist">
                <button
                  className={isActive("signin")}
                  type="button"
                  onClick={() => handleChangeTab("signin")}
                >
                  Sign In
                </button>

                <button
                  className={isActive("signup")}
                  type="button"
                  onClick={() => handleChangeTab("signup")}
                >
                  New Account
                </button>
              </div>
            </nav>

            <div className="tab-content" id="nav-tabContent2">
              {/* Sign In */}
              <div className={paneClass("signin")} id="nav-home">
                <SignIn onForgotPassword ={() => handleChangeTab("forgot")} />
              </div>

              {/* Sign Up */}
              <div className={paneClass("signup")} id="nav-profile">
                <SignUp />
              </div>

              {/* Forgot Password */}
              <div className={paneClass("forgot")} id="nav-forgot">
                <ForgotPassword onBackToLogin={() => handleChangeTab("signin")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
