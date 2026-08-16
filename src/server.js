import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3000;

await connectDB();
app.get("/api/test", (req, res) => {
  res.json({
    message: "Render is running latest server.js"
  });
});
app.listen(PORT, () => {

    console.log(`🚀 Server Running On Port ${PORT}`);

});