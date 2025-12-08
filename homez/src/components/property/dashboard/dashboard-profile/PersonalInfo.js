import React from "react";

const PersonalInfo = () => {
  return (
    <form className="form-style1">
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ชื่อผู้ใช้ (Username)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุชื่อผู้ใช้"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">อีเมล</label>
            <input
              type="email"
              className="form-control"
              placeholder="ระบุอีเมล"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">เบอร์โทรศัพท์</label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุเบอร์โทรศัพท์"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ชื่อจริง
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุชื่อจริง"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              นามสกุล
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุนามสกุล"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ตำแหน่ง
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุตำแหน่ง"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ภาษา
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุภาษา"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ชื่อบริษัท
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุชื่อบริษัท"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              เลขประจำตัวผู้เสียภาษี
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุเลขผู้เสียภาษี"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ที่อยู่
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="ระบุที่อยู่"
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb10">
            <label className="heading-color ff-heading fw600 mb10">
              เกี่ยวกับฉัน
            </label>
            <textarea
              cols={30}
              rows={4}
              placeholder="เขียนแนะนำตัวสั้นๆ..."
              defaultValue={""}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="text-end">
            <button type="submit" className="ud-btn btn-dark">
              อัปเดตข้อมูล
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default PersonalInfo;