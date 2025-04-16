import express, {Request, Response} from "express"

const router = express.Router();


/* GET home page. */
router.get('/', function (req: Request, res: Response, next) {
    res.send("Folium API");
});

export default router;