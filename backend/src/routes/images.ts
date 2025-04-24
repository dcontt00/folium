import express from "express";
import {authHandler} from "@/middleware";
import path from "path";
import fs from "node:fs";
import {ApiError, AuthenticationError} from "@/classes";
import {getImagesFolder} from "@/utils/directories";

const router = express.Router();

router.post("/", authHandler, async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AuthenticationError("User not found");
    }
    if (req.files == null) {
        throw new ApiError(400, "Files is null");
    }

    if (!req.files.upload) {
        res.status(400).send("No file uploaded");
        return
    }

    if (Array.isArray(req.files.upload)) {
        res.status(400).send("Only one file can be uploaded");
        return
    }
    const imagesPath = getImagesFolder()
    const upload = req.files.upload;
    const uploadFolder = path.join(imagesPath, user.id)
    console.log(uploadFolder)

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, {recursive: true});
    }

    const extension = path.extname(upload.name);
    const uploadPath = `${uploadFolder}/${Date.now().toString()}${extension}`;
    const url = `/images/${user.id}/${path.basename(uploadPath)}`;

    upload.mv(uploadPath, (err) => {
        if (err) {
            res.status(500).send(err);
            return
        }

        res.status(200).json({url: url})
    })

});

router.get('/:userId/:filename', authHandler, (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error("User not found");
    }
    const {userId, filename} = req.params;
    const imagesPath = getImagesFolder();
    const filePath = path.join(imagesPath, userId, filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'File not found',
            });
        }
    });
});

export default router;