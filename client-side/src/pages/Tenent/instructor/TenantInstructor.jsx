import React, { useEffect, useState } from "react";
import ListInstructors from "../../../components/tenants/ListInstructors";
import axios from "axios";
import AddInstructorModal from "../../../components/tenants/AddInstructorModal";
import EditUserModal from "../../common/editUserModal/EditUserModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructors } from "@/redux/tenant.slice";

const TenantInstructor = () => {
  const dispatch = useDispatch();
  const { instructors } = useSelector((state) => state.tenant);
  const [search, setSearch] = useState("");
  const [openAddInstructorModal, setOpenAddInstructorModal] = useState(false);
  const [instructorRoleId, setInstructorRoleId] = useState(null);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);

  useEffect(() => {
    dispatch(fetchInstructors());
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
    <div className="w-full px-12 py-12 flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Instructors</h1>
        <div>
          <button
            onClick={() => setOpenAddInstructorModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Instructor
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          placeholder="Search instructors..."
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleSearch}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
      <ListInstructors />

      <AddInstructorModal
        setOpenAddInstructorModal={setOpenAddInstructorModal}
        instructorRoleId={instructorRoleId}
      />
      <EditUserModal
        openEditUserModal={openEditUserModal}
        setOpenEditUserModal={setOpenEditUserModal}
      />
    </div>
  );
};

export default TenantInstructor;
