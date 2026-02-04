import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
export const corsConfig = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],

})

export default corsConfig
