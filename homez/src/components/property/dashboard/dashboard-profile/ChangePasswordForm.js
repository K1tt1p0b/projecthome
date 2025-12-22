import React from "react";

const ChangePasswordForm = () => {
  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        
        {/* รหัสผ่านเก่า */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านเก่า <span className="text-danger">*</span>
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

      <div className="row">
        {/* รหัสผ่านใหม่ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านใหม่ <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="รหัสผ่านใหม่"
              required
            />
          </div>
        </div>

        {/* ยืนยันรหัสผ่านใหม่ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ยืนยันรหัสผ่านใหม่ <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ยืนยันรหัสผ่านใหม่"
              required
            />
          </div>
        </div>

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