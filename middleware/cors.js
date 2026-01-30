import cors from "cors"

export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],

})

export default corsConfig
