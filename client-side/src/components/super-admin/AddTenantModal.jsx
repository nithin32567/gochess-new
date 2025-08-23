import React from "react";
import { useDispatch } from "react-redux";
import { addTenant } from "../../redux/super.admin.slice";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const AddTenantModal = ({ setIsAddTenantModalOpen }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      console.log(data, "data");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/superadmin/tenant/create-tenant`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response, "response");
      toast.success(response.data.message);
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className="modal fade active show"
      style={{ display: "block", backgroundColor: "#1119" }}
      id="exampleModal"
      tabIndex={-1}
      aria-modal="true"
      data-bs-backdrop="static"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body newtrainer-modal">
            <h1 className="modal-title">Add Tenant</h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setIsAddTenantModalOpen(false)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="trainer-input-item">
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  placeholder="First Name"
                />
              </div>
              <div className="trainer-input-item">
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
              <div className="trainer-input-item">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="trainer-input-item">
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Phone Number"
                />
              </div>
              <div className="trainer-input-item">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Company Name"
                />
              </div>
              <div className="trainer-input-item">
                <input
                  type="text"
                  id="subdomain"
                  name="subdomain"
                  placeholder="Subdomain"
                />
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-4">
                  <button type="submit" className="addtrainer-btn">
                    Add Tenant
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTenantModal;
