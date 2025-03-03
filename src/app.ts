import express, {Express} from "express";
import path from "path";
import cookieParser from "cookie-parser";

import logger from "morgan"
import indexRouter from "./routes/index"
import userRoute from "./routes/user"
import registerRouter from "./routes/register"
import loginRouter from "./routes/login"

import connectDB from "./db";


const app: Express = express();
const port = 3000

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

app.use('/', indexRouter);
app.use('/user', userRoute);
app.use("/register", registerRouter);
app.use("/login", loginRouter);

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