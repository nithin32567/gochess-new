import jwt from "jsonwebtoken";

export const authCheckMiddleware = (req, res, next) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");

  try {
    const { token } = req.cookies;
    console.log(token, "token middleware");
    // console.log(token, "token middleware");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        errorCode: "TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded, "decoded");
    req.user = {
      id: decoded.id,
      role: decoded.role,
      tenant_id: decoded.tenant_id,
    };
    console.log("next");

    next();
  } catch (error) {
    console.log(error, "error inside the authCheckMiddleware");
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
      errorCode: "TOKEN_INVALID",
    });
  }
};
