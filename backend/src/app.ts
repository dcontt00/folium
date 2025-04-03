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
import {errorHandler} from "./middleware/error";


const app: Express = express();
const port = 3000
var whitelist = ['http://localhost:8080', 'http://localhost:5173'];
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
app.use('/', indexRouter);
app.use('/user', userRoute);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/portfolio", portfolioRouter);
app.use("/images", imagesRouter);

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