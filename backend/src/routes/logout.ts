import {Router} from "express";


const router = Router();

router.get("/", (req, res) => {
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).json({
        status: 200,
        success: true,
        message: "Logout success",
    });
})

export default router;