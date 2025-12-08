import React from "react";

const SocialField = () => {
  return (
    <form className="form-style1">
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Facebook Url
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Facebook Url"
              required
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Pinterest Url
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Pinterest Url"
              required
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Instagram Url
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Instagram Url"
              required
            />
          </div>
        </div>{" "}
        {/* End .col */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Twitter Url
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Twitter Url"
              required
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Linkedin Url
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Linkedin Url"
              required
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Website Url (without http)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Website Url"
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-md-12">
          <div className="text-end">
            <button type="submit" className="ud-btn btn-dark">
              อัปเดทข้อมูลโซเชียล
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default SocialField;
