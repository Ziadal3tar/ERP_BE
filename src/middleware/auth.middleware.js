import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)
.select("-password");
       if(!user || !user.isActive){

    return res.status(401).json({

        success:false,

        message:"Unauthorized"

    });

}

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid Token"

        });

    }

};

export default auth;