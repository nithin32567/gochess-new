import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesByTenant } from "../../redux/super.admin.slice";
const AdminCourseManagement = () => {
 const dispatch = useDispatch();
 const { tenantDetails, coursesByTenant } = useSelector(
  (state) => state.superAdmin
 );
 console.log("tenantDetails", tenantDetails);
 const [tenantId, setTenantId] = useState("");
 console.log(tenantId, "before");

 // display all courses in a card fotmat based on the tenants
 const handleTenantChange = (e) => {
  console.log(e.target.value, "clicked");
  setTenantId(e.target.value);
  dispatch(fetchCoursesByTenant(e.target.value));
 };

 return (
  <main className="container-wrapper-scroll">
   <section className="createcourse-wrapper ourcourse-page">
    <div className="container-fluid">
     <div className="row">
      {/* <h4 className="text-2xl font-bold">
       Courses by Each Tenant and Enrolled Users Count
      </h4>
      <div className="flex flex-col gap-4 my-2">
       <select
        className="border border-gray-300 rounded-md"
        name=""
        id=""
        onChange={handleTenantChange}
       >
        <option className="text-gray-500" value="">
         Select Tenant to view courses
        </option>
        {tenantDetails.map((tenant) => (
         <option
          key={tenant._id}
          onChange={handleTenantChange}
          className="text-gray-500 cursor-pointer"
          value={tenant._id}
         >
          {tenant.name}
         </option>
        ))}
       </select>
      </div>
      <div className="d-flex flex-column gap-2 my-6 border-b border-gray-300 pb-4">
       <h5 className="text-xl font-bold">
        Total Courses: {coursesByTenant.length}
       </h5>
       <h5 className="text-xl font-bold">
        Total Enrolled Students:{" "}
        {coursesByTenant.reduce(
         (acc, course) => acc + course.students.length,
        0a
        )}
       </h5>
      </div> */}

      {coursesByTenant.length > 0 && tenantId !== ""
       && (<div className="row">
        <div className="col-xl-3 col-lg-3 col-sm-6">
         <a href="#" className="ourcourse-item-div">
          <div className="course-image">
           <img src="img/chessthumbnail.jpg" alt="Chess" />
          </div>
          <div className="course-content">
           <h4>
            <font>Tactic Ninja - Sharpen Your Chess Tactics with a Grandmaster</font>
           </h4>
           <h3>
            <font><i className="fa-solid fa-indian-rupee-sign"></i>999</font><span><i
             className="fa-solid fa-indian-rupee-sign"></i>399</span>
           </h3>
          </div>
          <h6><i className="fa-regular fa-clock"></i> 20 total hours</h6>
         </a>
        </div>
       </div>)}
     </div>
    </div>
   </section>

   <div>

    {/* course card display */}
    <div className="table-responsive table-styles mt-4">
     <table className="table table-striped">
      <thead>
       <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">description</th>
        <th scope="col">Price</th>
        <th scope="col">Max enrollment</th>
        <th scope="col">Actions</th>
       </tr>
      </thead>
      <tbody>
       {/* {JSON.parse(localStorage.getItem("st-courses")).map((course, i) => (
        <tr key={i}>
         <th scope="row">{i + 1}</th>
         <td>{course.course_title}</td>
         <td>{course.description}</td>
         <td>{course.price}</td>
         <td>{course.max_enrollment}</td>
         <td>
          <button
           onClick={() => {
            // setUserToEdit(user);
            // setEditModalOpen(true);
           }}
           className="edit">
           <i className="fa-solid fa-pen-to-square" />
          </button>{" "}
          <button
           onClick={() => {
            // setUserToDelete(user);
            // setDeleteModalOpen(true);
           }}
           className="delete">
           <i className="fa-solid fa-trash-can" />
          </button>
         </td>
        </tr>
       ))} */}
      </tbody>
     </table>
    </div>

   </div>
  </main>
 );
};

export default AdminCourseManagement;
