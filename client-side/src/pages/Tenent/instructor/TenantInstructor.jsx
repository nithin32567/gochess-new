import React, { useEffect, useState } from "react";
import ListInstructors from "../../../components/tenants/ListInstructors";
import axios from "axios";
import AddInstructorModal from "../../../components/tenants/AddInstructorModal";
import EditUserModal from "../../common/editUserModal/EditUserModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructors } from "@/redux/tenant.slice";
import Popup from "../../../components/popup";

const TenantInstructor = () => {
 const dispatch = useDispatch();
 // const { instructors } = useSelector((state) => state.tenant);
 const [instructors, setInstructors] = useState();
 const [search, setSearch] = useState("");
 const [openAddInstructorModal, setOpenAddInstructorModal] = useState(false);
 const [instructorRoleId, setInstructorRoleId] = useState(null);
 const [openEditUserModal, setOpenEditUserModal] = useState(false);

 useEffect(() => {
  dispatch(fetchInstructors());
 }, []);

 useEffect(() => {
  (async () => {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/roles`,
    { withCredentials: true }
   );
   const instructor = response?.data?.data?.find(e => e.name === "instructor");
   setInstructorRoleId(instructor._id);
  })();
 }, []);

 useEffect(() => {
  if (search === "") {
   dispatch(fetchInstructors());
  } else {
   handleSearch();
  }
 }, [search]);

 const handleSearch = async () => {
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/instructors/search/${search}`,
    {
     withCredentials: true,
    }
   );
   setInstructors(response.data.data);
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <main className="container-wrapper-scroll">
   <section className="addcourse">
    <div className="container-fluid">
     <div className="row justify-content-center">
      <div className="col-xl-2 col-lg-3 col-md-4">
       <button
        className="addnewcourse-btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => setOpenAddInstructorModal(true)}
       >
        <i className="fa-solid fa-plus" /> Add Instructor
       </button>
      </div>
     </div>
    </div>
   </section>

   <section className="search-section">
    <div className="container-fluid">
     <div className="row">
      <div className="col-xl-12 col-lg-12 col-sm-12 px-4">
       <div className="search-course">
        <input
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         onKeyUp={handleSearch}
         type="text"
         placeholder="Search Course" />
        <button onClick={handleSearch}>
         <i className="fa-solid fa-magnifying-glass" />
        </button>
       </div>
      </div>
     </div>
    </div>
   </section>


   <section className="course-single-page container-height">
    <div className="container-fluid">
     <div className="flex justify-between items-center w-full">
     </div>

     <ListInstructors instructors={instructors} />

     {openAddInstructorModal && <Popup>
      <AddInstructorModal
       setOpenAddInstructorModal={setOpenAddInstructorModal}
       instructorRoleId={instructorRoleId}
      />
     </Popup>}

     {openEditUserModal && <Popup>
      <EditUserModal
       openEditUserModal={openEditUserModal}
       setOpenEditUserModal={setOpenEditUserModal}
      />
     </Popup>}

    </div>
   </section>
  </main>
 );
};

export default TenantInstructor;
