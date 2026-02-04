export default function isLoggedIn(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Login required",user: null  });
    }
    next();
}
