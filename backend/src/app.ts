import express, {Express} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan"
import indexRouter from "./routes/index"
import userRoute from "./routes/user"
import registerRouter from "./routes/register"
import loginRouter from "./routes/login"
import portfolioRouter from "./routes/portfolio"
import imagesRouter from "./routes/images"
import logoutRouter from "./routes/logout"
import fileUpload from "express-fileupload";
import cors from "cors";
import connectDB from "./db";
import {errorHandler} from "./middleware/errorHandler";


const app: Express = express();
const port = 3000
// Middleware
app.use(logger('dev'));
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

// Routes
app.use('/api/', indexRouter);
app.use('/api/user', userRoute);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/images", imagesRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler)

app.listen(port, () => {
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