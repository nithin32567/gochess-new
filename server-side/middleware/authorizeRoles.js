export const authorizeRoles = (...roles) => {
  // console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT");

  return (req, res, next) => {
    // console.log(req.user, "req.user inside the authorizeRoles");
    if (!roles.includes(req.user.role.toLowerCase().trim())) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }
    next();
  };
};
