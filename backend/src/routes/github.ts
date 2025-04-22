import express from "express"
import path from "path";
import fs from "fs";
import {getExportsFolder} from "@/utils/directories";
import {authHandler} from "@/middleware";
import {exchangeCodeForToken, uploadFilesToGithubPages} from "@/services/githubService";
import {generateHtmlFiles} from "@/services/portfolioService";

const router = express.Router();


router.get("/oauth", (req, res) => {
    const code = req.query.code as string;

    if (!code) {
        throw new Error("Missing required parameters: code");
    }

    // Handle the OAuth callback here
    const token = exchangeCodeForToken(code)

    // You can exchange the code for an access token using your backend service
    res.send("OAuth callback received.");

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