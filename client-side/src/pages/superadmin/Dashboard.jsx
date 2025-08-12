import React from "react";
// import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";

// Dummy data for the dashboard

const Dashboard = () => {
 const { tenantDetails } = useSelector((state) => state.superAdmin);

 return (
  <>
   <main className="container-wrapper-scroll">
    <section className="welcometext-con">
     <div className="welcometext-div">
      <div className="container-fluid">
       <div className="row">
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8">
         <div>
          <span>
           <img src="/img/hourse-icon.png" alt="Go Chess" />
          </span>
          <h3>Hello {tenantDetails.name}!</h3>
          <p>Welcome back, you are doing great.</p>
         </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4">
         <button className="getstarted-btn">
          <i className="fa-solid fa-rocket" /> Get Started
         </button>
        </div>
       </div>
      </div>
     </div>
    </section>

    <section className="counts-wrapper">
     <div className="container-fluid">
      <div className="row">

       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/courses.png" alt="Courses" />
         </span>
         <div>
          <h3>{tenantDetails.length}</h3>
          <h6>Tenants</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>
       
       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/learners.png" alt="Learners" />
         </span>
         <div>
          <h3>{tenantDetails.reduce(
           (acc, tenant) => acc + tenant.userCount,
           0
          )}</h3>
          <h6>Learners</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>

       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/courses.png" alt="Courses" />
         </span>
         <div>
          <h3>{tenantDetails.reduce(
           (acc, tenant) => acc + tenant.courseCount,
           0
          )}</h3>
          <h6>Courses</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>

       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/recorded-course.png" alt="Recorded Course" />
         </span>
         <div>
          <h3>120</h3>
          <h6>Recorded Course</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>

       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/group-course.png" alt="Group Course" />
         </span>
         <div>
          <h3>120</h3>
          <h6>Group Course</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>

       <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
        <button className="counts-item">
         <span>
          <img width={200} height={200} src="/img/instructor.png" alt="Instructors" />
         </span>
         <div>
          <h3>120</h3>
          <h6>Instructors</h6>
          <i className="fa-solid fa-chevron-right" />
         </div>
        </button>
       </div>

      </div>
     </div>
    </section>
   </main>
  </>
 );
};

export default Dashboard;
