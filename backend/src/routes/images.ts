import express from "express";
import {authHandler} from "@/middleware";
import path from "path";
import fs from "node:fs";
import {ApiError, AuthenticationError} from "@/classes";
import {getImagesFolder} from "@/utils/directories";
import sharp from "sharp";
import portfolio from "@/routes/portfolio";

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
        return;
    }

    if (Array.isArray(req.files.upload)) {
        res.status(400).send("Only one file can be uploaded");
        return;
    }

    const portfolioUrl = req.query.portfolioUrl as string | undefined;

    const imagesPath = getImagesFolder();
    const upload = req.files.upload;


    let url = `/images/`;
    let imagesFolder = imagesPath;
    let filename = `${user.id}.jpg`;
    if (portfolioUrl) {
        imagesFolder = path.join(imagesPath, portfolioUrl);
        url = `/images/${portfolioUrl}/`;
        filename = `${Date.now().toString()}.jpg`;
    }


    // Check if the folder exists, if not, create it
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder, {recursive: true});
    }

    const outputPath = path.join(imagesFolder, filename);
    url += filename;

    try {
        // Use sharp to process the image
        await sharp(upload.data)
            .jpeg({quality: 80}) // Convert to JPEG with 80% quality
            .toFile(outputPath);
        res.status(200).json({url: url});
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).send("Error processing image");
    }
});

router.use(express.static(getImagesFolder()));

/*router.get('/:userId/:filename', (req, res) => {
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
});*/

export default router;