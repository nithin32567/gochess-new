import Login from "../../models/login.model.js";

export const getAllInstructors = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;

    const instructors = await Login.find({
      tenant_id: req.user.tenant_id,
    })
      .populate("user_id role_id")
      .select("-password");
    const filteredInstructors = instructors.filter(
      (instructor) => instructor.role_id.name === "instructor"
    );
    // console.log(filteredInstructors, "filteredInstructors");

    // organize to single data
    const organizedInstructors = filteredInstructors.map((instructor) => ({
      id: instructor._id,
      email: instructor.email,
      name: instructor.user_id.fname + " " + instructor.user_id.lname,
      role: instructor.role_id.name,
      role_id: instructor.role_id._id,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: organizedInstructors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const searchInstructor = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const searchValue = req.params.searchValue || "";
    // console.log(searchValue, "searchValue");
    const instructors = await Login.find({
      tenant_id: tenant_id,
    }).populate("user_id role_id");

    // console.log(instructors, "instructors");
    const filteredInstructors = instructors.filter(
      (instructor) => instructor.role_id.name === "instructor"
    );

    // filter by searchValue email lname fname
    // if searchValue is empty, return all instructors
    if (searchValue === "") {
      console.log("searchValue is empty");
      const organizedInstructors = filteredInstructors.map((instructor) => ({
        id: instructor._id,
        email: instructor.email,
        name: instructor.user_id.fname + " " + instructor.user_id.lname,
        role: instructor.role_id.name,
        role_id: instructor.role_id._id,
        createdAt: instructor.createdAt,
        updatedAt: instructor.updatedAt,
      }));
      return res.status(200).json({
        success: true,
        data: organizedInstructors,
      });
    }
    const filteredInstructorsBySearchValue = filteredInstructors.filter(
      (instructor) =>
        instructor.user_id.fname
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        instructor.user_id.lname
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchValue.toLowerCase())
    );
    const organizedInstructors = filteredInstructorsBySearchValue.map(
      (instructor) => ({
        id: instructor._id,
        email: instructor.email,
        name: instructor.user_id.fname + " " + instructor.user_id.lname,
        role: instructor.role_id.name,
        role_id: instructor.role_id._id,
        createdAt: instructor.createdAt,
        updatedAt: instructor.updatedAt,
      })
    );

    res.status(200).json({
      success: true,
      data: organizedInstructors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


