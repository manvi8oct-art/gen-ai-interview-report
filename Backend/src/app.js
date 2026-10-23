const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors")
const multer = require("multer")
const connectDB = require("./config/database");




const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://gen-ai-interview-report-nine.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

let dbConnectionPromise;

app.use(async (req, res, next) => {
    try {
        if (!dbConnectionPromise) {
            dbConnectionPromise = connectDB().catch((error) => {
                dbConnectionPromise = null;
                throw error;
            });
        }

        await dbConnectionPromise;
        next();
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(503).json({
            message: "Database connection failed. Please try again later."
        });
    }
});




//require all the routes here 
const authRouter = require("./routes/authroutes");
const interviewRouter = require("./routes/interview.routes");


//using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Gen-AI Interview Report API is running"
  });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    console.error("Unhandled request error:", error)

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "Resume file is too large. The maximum allowed size is 5MB."
            })
        }

        return res.status(400).json({
            message: "Resume upload failed. Check the selected file and try again."
        })
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "The request body contains invalid JSON."
        })
    }

    return res.status(500).json({
        message: "An unexpected server error occurred. Please try again."
    })
})

module.exports = app;