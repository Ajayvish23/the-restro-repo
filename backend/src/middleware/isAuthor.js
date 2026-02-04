export const isAuthor = (req, res, next) => {
  if (req.params.id!==req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};