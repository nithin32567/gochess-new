import Login from "../../models/login.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sessionSchema from "../../models/UserSession.js";
export const loginUser = async (req, res) => {
  
  console.log("loginUser");
  try {
    console.log(req.body);

    const { email, password } = req.body;
    const user = await Login.findOne({ email }).populate("role_id");
    console.log("************************************************************");
    console.log(user);
    console.log("************************************************************");
    
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    if(!user.is_active){
      return res.status(401).json({ message: "Accout not Activated" });

    }
    await sessionSchema.deleteMany({ userId: user._id });
console.log("********************************************");
console.log(user._id);

console.log("********************************************");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role_id.name,
        role_id: user.role_id._id,
        tenant_id: user.tenant_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const deviceInfo = req.headers["user-agent"] || "unknown";
    await sessionSchema.create({
      userId: user._id,
      token,
      deviceInfo,
    });

    // Set cookie key based on role
    let cookieKey = "token";
    // switch (user.role_id.name) {
    //   case "tenant":
    //     cookieKey = "tenantToken";
    //     break;
    //   case "instructor":
    //     cookieKey = "instructorToken";
    //     break;
    //   case "student":
    //     cookieKey = "studentToken";
    //     break;
    //   default:
    //     cookieKey = "token";
    // }

    res.cookie(cookieKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.user_id.fname + " " + user.user_id.lname,
        email: user.email,
        role: user.role_id.name,
        role_id: user.role_id._id,
      },
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};
export const getCurrentUser = async (req, res) => {
  console.log("get usersss");
  console.log("user", req.user);
  const { id } = req.user;
  const user = await Login.findById(id)
    .select("-password")
    .populate("user_id", "fname lname age dob email phone_number")
    .populate("role_id", "name description")
    .populate("tenant_id", "name");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log(user);

  res.status(200).json({ user });
};
