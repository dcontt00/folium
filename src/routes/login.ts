import express, {Request, Response} from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const user = req.body;

        // ** destructure the information from user;
        const {name, email, password} = user;
        console.log(name, email, password);
    } catch (e) {
        console.error(e)
    }
});