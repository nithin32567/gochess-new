import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Statitics from "@/components/tenants/dashboard/Statitics";
import {
    fetchTenant,
    fetchStudents,
    fetchInstructors,
} from "@/redux/tenant.slice";
import { fetchCourses } from "@/redux/course.slice";
import { useDispatch, useSelector } from "react-redux";

const TenentDashBoard = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    console.log(user, "user")
    const { students, instructors } = useSelector((state) => state.tenant);
    const { courses } = useSelector((state) => state.course);
    console.log(courses)
    // console.log(students, courses, instructors);
    // !===========================================================

    useEffect(() => {
        dispatch(fetchTenant());
        dispatch(fetchStudents());
        dispatch(fetchCourses());
        dispatch(fetchInstructors());
    }, []);

    return (
        <main class="container-wrapper-scroll">
            <section className="welcometext-con">
                <div className="welcometext-div">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                                <div>
                                    <span>
                                        <img src="img/hourse-icon.png" alt="Go Chess" />
                                    </span>
                                    <h3>Hello {user?.user_id?.fname}!</h3>
                                    <p>Welcome back, you are doing great.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                <button className="getstarted-btn">
                                    <i className="fa-solid fa-rocket" />
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Statitics />
        </main>
    );
};

export default TenentDashBoard;
