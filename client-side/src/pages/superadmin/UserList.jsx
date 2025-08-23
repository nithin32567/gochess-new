import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pagination } from "@mui/material";
import UserCreationModal from "../../components/User/UserCreationModal";
import Popup from "../../components/popup";
import UserEditModal from "../../components/User/UserEditModal";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tenantId, setTenantId] = useState("");
  console.log(tenantId, "tenantId");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [roles, setRoles] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleId, setRoleId] = useState("");
  const [isActive, setIsActive] = useState(false);
  console.log(roleId, "roleId");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    fetchRoles();
    fetchTenants();
  }, []);

  useEffect(() => {
    if (tenantId && tenantId !== "") {
      fetchUsersByTenant(tenantId);
    } else {
      fetchUsers();
    }
  }, [tenantId]);

  const handleAddUser = () => {
    setOpen(true);
  };

  const fetchUsersByTenant = async (tenantId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/tenant/${tenantId}`, { withCredentials: true });
      console.log(response, "response users by tenant");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching users by tenant");
    } finally {
      setLoading(false);
    }
  }


  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/`,
        { withCredentials: true }
      );
      console.log(response, "response user");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/roles`,
        { withCredentials: true }
      );
      console.log(response, "roles fetch");
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching roles");
    }
  };

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

  const filterUsers = async (roleId) => {
    console.log(roleId, "roleId");
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/users/role/${roleId}`;

      // If tenant is selected, add tenant filter as query parameter
      const params = {};
      if (tenantId && tenantId !== "") {
        params.tenant_id = tenantId;
      }

      const response = await axios.get(url, {
        params,
        withCredentials: true
      });
      console.log(response, "response filter users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error filtering users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function to prevent too many API calls
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchUsers(searchValue);
        }, 500); // Wait 500ms after user stops typing
      };
    })(),
    [tenantId]
  );

  const searchUsers = async (searchValue) => {
    console.log(searchValue, "searchValue");
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/users/search-users/${searchValue}`;

      // If tenant is selected, add tenant filter as query parameter
      const params = {};
      if (tenantId && tenantId !== "") {
        params.tenant_id = tenantId;
      }

      const response = await axios.get(url, {
        params,
        withCredentials: true
      });
      console.log(response, "response search users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    // confirm the action
    const confirm = window.confirm(
      "Are you sure you want to toggle the user status?"
    );
    if (!confirm) {
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/update/${userId}`, { is_active: !isActive }, { withCredentials: true })
      console.log(response, "response update user")

      if (response.data.success) {
        toast.success(response.data.message || "User status changed successfully");
        setIsActive(!isActive);
        // Refresh based on current filters
        if (tenantId && tenantId !== "") {
          fetchUsersByTenant(tenantId);
        } else {
          fetchUsers();
        }
      } else {
        toast.error(response.data.message || "Failed to update user status");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Error toggling user status");
      } else {
        toast.error("Error toggling user status");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchUsers(value);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${userId}`, { withCredentials: true });
      console.log(response, "response delete user");
      if (response.data.success) {
        toast.success("User deleted successfully");
        // Refresh based on current filters
        if (tenantId && tenantId !== "") {
          fetchUsersByTenant(tenantId);
        } else {
          fetchUsers();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting user");
    }
  }



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
            <div className="row  justify-content-between userlist-header">
              <div className="col-lg-4  col-md-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-7">
                    <select
                      name=""
                      id=""
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                    >
                      <option value="">
                        Select Tenant
                      </option>
                      {tenants.map((tenant) => (
                        <option value={tenant._id} key={tenant._id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6 col-md-6 col-5">
                    <button onClick={handleAddUser} className="addtenant-btn">
                      <i className="fa-solid fa-plus" /> Create User
                    </button>
                  </div>
                  {open && (
                    <Popup>
                      <UserCreationModal
                        open={open}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        roles={roles}
                        tenants={tenants}
                      />
                    </Popup>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-7">
                                         <input
                       onChange={(e) => {
                         const searchValue = e.target.value;
                         if (searchValue === "") {
                           if (tenantId && tenantId !== "") {
                             fetchUsersByTenant(tenantId);
                           } else {
                             fetchUsers();
                           }
                         } else {
                           debouncedSearch(searchValue);
                         }
                       }}
                       type="text" placeholder="Search" />
                  </div>
                  <div className="col-lg-6 col-md-6 col-5">
                    <select
                      name=""
                      id=""
                      onChange={(e) => {
                        const selectedRoleId = e.target.value;
                        if (selectedRoleId === "all") {
                          if (tenantId && tenantId !== "") {
                            fetchUsersByTenant(tenantId);
                          } else {
                            fetchUsers();
                          }
                        } else {
                          filterUsers(selectedRoleId);
                        }
                      }}
                    >
                      <option value="all">All Users</option>
                      {roles.map((role) => (
                        <option
                          onChange={(e) => setRoleId(e.target.value)}
                          value={role._id} key={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive table-styles mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Tenant</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.length > 0 ? users?.map((user, i) => (
                    <tr key={user._id}>
                      <th scope="row">{i + 1}</th>
                      <td>{user?.user_id?.fname} {user?.user_id?.lname}</td>
                      <td>{user?.login?.email}</td>
                      <td>{user?.role?.name || "N/A"}</td>
                      <td>{user?.tenant?.name || "N/A"}</td>

                      <td>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleUserStatus(user._id)}
                          className={`px-2 py-1 border-xl text-sm  ${user.is_active
                            ? "bg-success text-white"
                            : "bg-danger text-white"
                            }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setUserToEdit(user._id);
                            setEditModalOpen(true);
                          }}
                          className="edit">
                          <i className="fa-solid fa-pen-to-square" />
                        </button>{" "}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="delete">
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  )) : <tr>
                    <td colSpan={6} className="text-center">No users found</td>
                  </tr>}
                </tbody>
              </table>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </main>
      {editModalOpen && (
        <Popup>
          <UserEditModal user_id={userToEdit} setEditModalOpen={setEditModalOpen} roles={roles} tenants={tenants} />
        </Popup>
      )}
    </>
  );
};

export default UserList;
