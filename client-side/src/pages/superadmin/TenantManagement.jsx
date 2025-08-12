import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTenantsWithCourseCountandUserCount } from "../../redux/super.admin.slice";

// Dummy data for tenants

const TenantManagement = () => {
  const dispatch = useDispatch();
  const [tenants, setTenants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "Basic",
    subdomain: "",
    zoomApiKey: "",
    zoomApiSecret: "",
  });
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getTenants();
  }, []);

  useEffect(() => {
    if (editingTenant) {
      console.log(editingTenant, "editingTenant");
      setFormData({
        name: editingTenant.name || "",
        email: editingTenant.email || "",
        plan: editingTenant.plan || "Basic",
        subdomain: editingTenant.subdomain || "",
        zoomApiKey: editingTenant.zoomApiKey || "",
        zoomApiSecret: editingTenant.zoomApiSecret || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        plan: "Basic",
        subdomain: "",
        zoomApiKey: "",
        zoomApiSecret: "",
      });
    }
  }, [editingTenant]);

  async function getTenants() {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${api_url}/tenants`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log(response.data, "response.data");

      if (response.data) {
        setTenants(response.data.tenants);
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setError(err.message || "Failed to fetch tenants");
      // Keep using dummy data if API call fails
      setTenants(initialTenants);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTenant = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  const handleEditTenant = (tenant, login, zoomapikey) => {
    setEditingTenant({
      ...tenant,
      email: login?.email || tenant.email,
      zoomApiKey: zoomapikey.zoomApiKey || "",
      zoomApiSecret: zoomapikey.zoomApiSecret || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingTenant) {
        // Update existing tenant
        const response = await axios.put(
          `${api_url}/tenants/update/${editingTenant._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data) {
          setTenants(
            tenants.map((tenant) =>
              tenant._id === editingTenant._id ? response.data.data : tenant
            )
          );
        }
      } else {
        // Create new tenant
        const response = await axios.post(`${api_url}/tenants`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.data) {
          setTenants([...tenants, response.data.data]);
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving tenant:", err);
      setError(err.response?.data?.message || "Failed to save tenant");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateTenant = async (tenantId) => {
    try {
      // Update local state optimistically
      setTenants(
        tenants.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                status: tenant.status === "active" ? "inactive" : "active",
              }
            : tenant
        )
      );

      // Make API call to update status
      await axios.patch(
        `${api_url}/superadmin/tenants/${tenantId}/status`,
        {
          status:
            tenants.find((t) => t.id === tenantId)?.status === "active"
              ? "inactive"
              : "active",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Error updating tenant status:", err);
      // Revert the optimistic update if the API call fails
      setTenants(tenants);
      setError("Failed to update tenant status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Tenant Management
        </h2>
        <button
          onClick={handleCreateTenant}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Tenant
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((item, index) => {
                const tenant = item.tenant || {};
                const user = item.user || {};
                const login = item.login || {};
                const zoomapikey = item.zoomapikey || {};

                return (
                  <tr
                    key={tenant._id?.toString() || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {login.email || user.email || "No Email"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {tenant.subdomain || "No Subdomain"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tenant.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tenant.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {tenant.plan || "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.createdAt
                        ? new Date(tenant.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900">
                          {tenant.courses || 0} Courses
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.users || 1} Users
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleEditTenant(tenant, login, zoomapikey)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeactivateTenant(tenant._id)}
                          className={`${
                            tenant.is_active
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {tenant.is_active ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Tenant */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTenant ? "Edit Tenant" : "Create New Tenant"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subdomain
                  </label>
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan
                  </label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zoom API Key
                  </label>
                  <input
                    type="text"
                    name="zoomApiKey"
                    value={formData.zoomApiKey}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter Zoom API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zoom API Secret
                  </label>
                  <input
                    type="text"
                    name="zoomApiSecret"
                    value={formData.zoomApiSecret}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter Zoom API Secret"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : editingTenant ? (
                      "Save Changes"
                    ) : (
                      "Create Tenant"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
