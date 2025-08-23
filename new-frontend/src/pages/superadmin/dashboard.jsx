import { useSelector } from "react-redux";
import ChartSlide from "../../components/chart";

export default function Dashboard() {
  const { tenantDetails } = useSelector((state) => state.superAdmin);
  console.log(tenantDetails);
  return (
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
                  <img
                    width={200}
                    height={200}
                    src="/img/courses.png"
                    alt="Courses"
                  />
                </span>
                <div>
                  <h3>
                    {tenantDetails.reduce(
                      (acc, tenant) => acc + tenant.courseCount,
                      0
                    )}
                  </h3>
                  <h6>Courses</h6>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </button>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
              <button className="counts-item">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/learners.png"
                    alt="Learners"
                  />
                </span>
                <div>
                  <h3>
                    {tenantDetails.reduce(
                      (acc, tenant) => acc + tenant.userCount,
                      0
                    )}
                  </h3>
                  <h6>Learners</h6>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </button>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
              <button className="counts-item">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/instructor.png"
                    alt="Instructors"
                  />
                </span>
                <div>
                  <h3>120</h3>
                  <h6>Instructors</h6>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </button>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
              <button className="counts-item">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/group-course.png"
                    alt="Group Course"
                  />
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
                  <img
                    width={200}
                    height={200}
                    src="/img/recorded-course.png"
                    alt="Recorded Course"
                  />
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
                  <img
                    width={200}
                    height={200}
                    src="/img/courses.png"
                    alt="Courses"
                  />
                </span>
                <div>
                  <h3>120</h3>
                  <h6>Courses</h6>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="createcourse-wrapper">
        <div className="container-fluid">
          <h3>Create a course</h3>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <button className="courseitem">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/courseicon.png"
                    alt="Course"
                  />
                </span>
                <h5>1:1 Course</h5>
                <p>
                  Add a single learner, schedule sessions, or allow them to book
                  directly.
                </p>
              </button>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <button className="courseitem">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/groupcourseicon.png"
                    alt="Group Course"
                  />
                </span>
                <h5>Group Course</h5>
                <p>
                  Add multiple learners, content and sessions to a single
                  cohort.
                </p>
              </button>
            </div>
            <div className="col-xl-4 col-lg-4">
              <button className="courseitem">
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/recordedcourseicon.png"
                    alt="Recorded Course"
                  />
                </span>
                <h5>Recorded Course</h5>
                <p>Add content and let learners progress at their own pace.</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-journey-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-4">
              <div>
                <span>
                  <img
                    width={200}
                    height={200}
                    src="/img/explore-image.png"
                    alt="Explore Journey"
                  />
                </span>
                <h3>
                  Explore Your <br />
                  Learning Journey
                </h3>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                  <p>
                    Discover the perfect course for your needs – personalized,{" "}
                    <br />
                    group-based, or self-paced!
                  </p>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                  <button className="getstarted-btn">
                    <i className="fa-regular fa-eye" /> View Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="learners-instructor-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="learners-instructor-con">
                <h3>Add learner &amp; instructors</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <button className="learners-itemdiv learnersbg">
                      <div>
                        <span>
                          <img src="/img/leaners-icon.png" alt="Learners" />
                        </span>
                        <h5>Learners</h5>
                        <p>Enroll learners in their courses</p>
                      </div>
                    </button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <button className="learners-itemdiv instructorsbg">
                      <div>
                        <span>
                          <img
                            src="/img/instructors-icon.png"
                            alt="Instructors"
                          />
                        </span>
                        <h5>Instructors</h5>
                        <p>Add instructors, assign course &amp; set roles</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="learners-instructor-con">
                <h3>Add learner &amp; instructors</h3>
                <button className="learners-itemdiv gcalandarbg">
                  <div>
                    <span>
                      <img src="/img/calandar-icon.png" alt="google calendar" />
                    </span>
                    <h5>
                      Connect <br />
                      your google calendar
                    </h5>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChartSlide />

      <section className="footer-wrapper">
        <p>© Copyright 2024 GoChess Academy. All rights reserved.</p>
      </section>
    </main>
  );
}
