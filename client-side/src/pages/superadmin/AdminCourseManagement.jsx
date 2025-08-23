import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch all courses for super admin
  const getAllCoursesForSuperAdmin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/courses/superadmin/all-courses`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data, "response");
      if (response.data.success) {
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tenants for filter dropdown
  const fetchTenants = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/superadmin/tenant`,
        { withCredentials: true }
      );
      console.log(response, "tenants fetch");
      if (response.data.success) {
        setTenants(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching tenants");
    }
  };

  // Filter courses by tenant
  const filterCoursesByTenant = async (selectedTenantId) => {
    try {
      setLoading(true);
      let url = `${
        import.meta.env.VITE_API_URL
      }/courses/superadmin/filtered-courses`;

      const params = {};
      if (selectedTenantId && selectedTenantId !== "") {
        params.tenant_id = selectedTenantId;
      }

      const response = await axios.get(url, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error filtering courses by tenant");
    } finally {
      setLoading(false);
    }
  };

  // Search courses
  const searchCourses = async (searchTerm) => {
    try {
      setLoading(true);
      let url = `${
        import.meta.env.VITE_API_URL
      }/courses/superadmin/search-courses/${searchTerm}`;

      const params = {};
      if (tenantId && tenantId !== "") {
        params.tenant_id = tenantId;
      }

      const response = await axios.get(url, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setFilteredCourses(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error searching courses");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (searchValue.trim() === "") {
            setFilteredCourses(courses);
          } else {
            searchCourses(searchValue);
          }
        }, 500);
      };
    })(),
    [tenantId, courses]
  );

  // Handle tenant change
  const handleTenantChange = (e) => {
    const selectedTenantId = e.target.value;
    setTenantId(selectedTenantId);

    if (selectedTenantId === "") {
      getAllCoursesForSuperAdmin();
    } else {
      filterCoursesByTenant(selectedTenantId);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);

    if (searchValue === "") {
      setFilteredCourses(courses);
    } else {
      debouncedSearch(searchValue);
    }
  };

  useEffect(() => {
    getAllCoursesForSuperAdmin();
    fetchTenants();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <main className="container-wrapper-scroll">
        <section className="course-single-page container-height">
          <div className="container-fluid">
            <div className="row justify-content-between userlist-header">
              <div className="col-lg-4 col-md-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-7">
                    <h2>All Courses</h2>
                  </div>
                  <div className="col-lg-6 col-md-6 col-5">
                    <select
                      name=""
                      id=""
                      value={tenantId}
                      onChange={handleTenantChange}
                    >
                      <option value="">Select Tenant</option>
                      {tenants.map((tenant) => (
                        <option value={tenant._id} key={tenant._id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-7">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive table-styles mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Max Enrollment</th>
                    <th scope="col">Tenant Name</th>
                    <th scope="col">Language</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses?.length > 0 ? (
                    filteredCourses?.map((course, i) => (
                      <tr key={course._id}>
                        <th scope="row">{i + 1}</th>
                        <td>{course.course_title || "N/A"}</td>
                        <td>{course.category?.category || "N/A"}</td>
                        <td>{course.max_enrollment || "N/A"}</td>
                        <td>{course.tenant_id?.name || "N/A"}</td>
                        <td>{course.language?.language || "N/A"}</td>
                        <td>
                          <span
                            className={`px-2 py-1 border-xl text-sm ${
                              course.is_active
                                ? "bg-success text-white"
                                : "bg-danger text-white"
                            }`}
                          >
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminCourseManagement;
