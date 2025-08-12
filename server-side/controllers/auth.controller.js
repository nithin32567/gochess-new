import bcrypt from "bcrypt";
import Login from "../models/login.model.js";
import Tenant from "../models/tenant.model.js";

export const generatePassword = async (req, res) => {
  console.log("fn called");
  try {
    const { token, password } = req.body;
    console.log(password, "password in the generate password page");

    // Validate required fields
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const loginEntry = await Login.findOne({
      passwordSetupToken: token,
    });

    // Validate token existence
    if (!loginEntry) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Validate token expiration
    if (loginEntry.tokenExpiry < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Token has expired." });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update login credentials and clear token
    loginEntry.password = password;
    loginEntry.token = null;
    loginEntry.tokenExpiry = null;
    await loginEntry.save();

    // Activate tenant
    await Tenant.findByIdAndUpdate(loginEntry.tenant_id, { is_active: true });

    return res.status(200).json({
      success: true,
      message: "Password setup successful. Your account is now active.",
    });
  } catch (error) {
    console.error("Password setup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const resendMail = async (req, res) => {
  try {
    const { token } = req.body;
    const loginEntry = await Login.findOne({
      passwordSetupToken: token,
    });
    if (!loginEntry) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token." });
    }
    const passwordSetupToken = Crypto.randomBytes(32).toString("hex");
    loginEntry.passwordSetupToken = passwordSetupToken;
    loginEntry.tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await loginEntry.save();
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Resend mail error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
