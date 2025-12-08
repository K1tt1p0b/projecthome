import React from "react";

const ChangePasswordForm = () => {
  return (
    <form className="form-style1">
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านเก่า
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="รหัสผ่านเก่า"
              required
            />
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านใหม่
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="รหัสผ่านใหม่"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ยืนยันรหัสผ่านใหม่"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="text-end">
            <button type="submit" className="ud-btn btn-dark">
              เปลี่ยนรหัสผ่าน
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
