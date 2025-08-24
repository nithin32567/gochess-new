import Login from "../../models/login.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sessionSchema from "../../models/UserSession.js";
export const loginUser = async (req, res) => {
  console.log("loginUser");
  try {
    const { email, password } = req.body;
    const user = await Login.findOne({ email }).populate("role_id", "name").populate("tenant_id", "name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role_id.name, tenant_id: user.tenant_id._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);

    const userData = await Login.findById(user._id).select("-password")
      .populate("user_id", "fname lname age dob email phone_number")
      .populate("role_id", "name description")
      .populate("tenant_id", "name");


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    res.status(500).send({ error });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const { user } = req;
    console.log(user, "user====================================");
    const userData = await Login.findById(user.id).select("-password")
      .populate("user_id", "fname lname age dob email phone_number")
      .populate("role_id", "name description")
      .populate("tenant_id", "name");
    res.status(200).json({ user: userData });

  } catch (error) {
    console.log(error)
  }
};
