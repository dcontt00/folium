import express, {Express} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan"
import indexRouter from "@/routes/index"
import userRoute from "@/routes/user"
import registerRouter from "@/routes/register"
import loginRouter from "@/routes/login"
import portfolioRouter from "@/routes/portfolio"
import imagesRouter from "@/routes/images"
import logoutRouter from "@/routes/logout"
import githubRouter from "@/routes/github"
import fileUpload from "express-fileupload";
import connectDB from "@/db";
import {authHandler, errorHandler} from "@/middleware";
import {createDirectories, getHtmlFolder} from "@/utils/directories";
import cors from "cors";
import config from "@/utils/config";


const app: Express = express();
const port = 3000
const allowedOrigins = ["http://localhost:3000", "http://localhost:1234"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

// Routes
app.use('/api', indexRouter);
app.use('/api/user', userRoute);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/images", imagesRouter);
app.use("/api/github", githubRouter);

app.use(express.static(path.join(__dirname, 'public')));

// Serve portfolios in HTML
app.get("/api/view/:portfolioUrl", authHandler, async (req, res) => {

    const htmlFolder = getHtmlFolder()
    const portfolioFolder = path.join(htmlFolder, req.params.portfolioUrl)
    const portfolioHtmlFile = path.join(portfolioFolder, "index.html")


    res.sendFile(portfolioHtmlFile)
})


app.use(errorHandler)
console.log(config)

app.listen(port, () => {
    createDirectories()
    console.log(`Server running at http://localhost:${port}`);
});

interface UserBasicInfo {
    id: string;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}