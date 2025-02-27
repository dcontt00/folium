import express, {Express} from "express";
import path from "path";
import cookieParser from "cookie-parser";

import logger from "morgan"
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import registerRouter from "./routes/register";
import connectDB from "./db";


const app: Express = express();
const port = 3000

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connectDB().then(r =>
    console.log("MongoDB connected successfully")
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/register", registerRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
