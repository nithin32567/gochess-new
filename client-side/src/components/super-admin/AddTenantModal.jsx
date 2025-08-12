import React from "react";
import { useDispatch } from "react-redux";
import { addTenant } from "../../redux/super.admin.slice";
import { MdClose } from "react-icons/md";

const AddTenantModal = ({ setIsAddTenantModalOpen }) => {
 const dispatch = useDispatch();
 const handleSubmit = (e) => {
  e.preventDefault();
  console.log(e.target.name.value, e.target.subdomain.value);
  dispatch(
   addTenant({
    fname: e.target.fname.value,
    lname: e.target.lname.value,
    email: e.target.email.value,
    phone_number: e.target.phone_number.value,
    name: e.target.name.value,
    subdomain: e.target.subdomain.value,
   })
  );
  setIsAddTenantModalOpen(false);
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
