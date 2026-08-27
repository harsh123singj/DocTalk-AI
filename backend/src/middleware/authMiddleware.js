import jwt from "jsonwebtoken";

const authMiddleware =  (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication required"
        })
    }
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format"
        });
    }

    const token = parts[1];


    try{
          const decoded = jwt.verify(token,
        process.env.JWT_SECRET
    )
        req.user= decoded;
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message:"Invalid or expired Token"
        })
    }
  



    next();
};

export default authMiddleware;