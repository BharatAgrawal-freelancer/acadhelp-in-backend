import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
const allowedOrigins = [
  "https://acadhelp.in",
  "https://www.acadhelp.in",
];

export const corsConfig = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});


export default corsConfig
