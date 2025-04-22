import express from "express"
import path from "path";
import fs from "fs";
import {getExportsFolder} from "@/utils/directories";
import {authHandler} from "@/middleware";
import {exchangeCodeForToken, uploadFilesToGithubPages} from "@/services/githubService";
import {generateHtmlFiles} from "@/services/portfolioService";
import userModel from "@/models/UserModel";

const router = express.Router();


router.get("/oauth", authHandler, async (req, res) => {
    const code = req.query.code as string;
    const user = req.user

    if (!user) {
        throw new Error("User not found");
    }

    if (!code) {
        throw new Error("Missing required parameters: code");
    }

    // Handle the OAuth callback here
    const token = await exchangeCodeForToken(code)
    console.log(token)
    await userModel
        .findOneAndUpdate({_id: user.id}, {githubToken: token})
        .then((user) => {
            console.log(user)
            res.status(200).json({
                status: 200,
                success: true,
                message: "Github token updated successfully",
            })
        })
        .catch((err) => {
            console.error("Error updating Github token:", err);
            res.status(500).json({
                status: 500,
                success: false,
                message: "Error updating Github token",
            })
        })

})


router.get('/upload', authHandler, async (req, res, next) => {
    try {
        const {githubToken, githubUsername, portfolioUrl} = req.query;

        if (!githubToken || !githubUsername || !portfolioUrl) {
            res.status(400).send("Missing required parameters: githubToken, githubUsername, portfolioUrl");
            return;
        }

        const exportFolder = getExportsFolder();
        const portfolioDir = path.join(exportFolder, portfolioUrl as string);

        if (!fs.existsSync(portfolioDir)) {
            res.status(404).send("Portfolio directory not found.");
            return;
        }

        // Generate HTML files
        await generateHtmlFiles(portfolioUrl as string)


        await uploadFilesToGithubPages(
            githubToken as string,
            githubUsername as string,
            portfolioUrl as string,
            portfolioDir,
        );

        res.send("Files uploaded successfully.");
    } catch (error) {
        console.error("Error uploading files:", error);
        next(error); // Pass the error to the next middleware
    }
});


export default router;