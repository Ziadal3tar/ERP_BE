import jwt from "jsonwebtoken";

const generateRefreshToken = (userId) => {

    return jwt.sign(

        {
            id: userId
        },

        process.env.JWT_REFRESH_SECRET,

        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES
        }

    );

};

export default generateRefreshToken;