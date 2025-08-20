import React from "react";

export default function Popup({ children }) {
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
      {children}
     </div>
    </div>
   </div>
  </div>
 );
}