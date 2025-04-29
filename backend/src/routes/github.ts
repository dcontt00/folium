import express from "express"
import path from "path";
import fs from "fs";
import {getHtmlFolder} from "@/utils/directories";
import {authHandler} from "@/middleware";
import {exchangeCodeForToken, getUserFromToken, uploadFilesToGithubPages} from "@/services/githubService";
import {generateHtmlFiles} from "@/services/portfolioService";
import userModel from "@/models/UserModel";
import {ApiError} from "@/classes";

const router = express.Router();

router.get("/status", authHandler, async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const {
        githubToken,
        githubUsername
    } = await userModel.findById(user.id).select("githubToken githubUsername").then((user) => {
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    });

    if (!githubToken || !githubUsername) {
        throw new ApiError(400, "Not authorized with Github");
    }

    // Test if token is valid
    const githubUser = await getUserFromToken(githubToken as string);
    if (!githubUser) {
        throw new ApiError(400, "Not authorized with Github");
    }


    res.send(true);

})

router.get("/oauth", authHandler, async (req, res) => {
    const code = req.query.code as string;
    const redirectUri = req.query.redirect_uri as string;
    const user = req.user

    if (!user) {
        throw new Error("User not found");
    }

    if (!code) {
        throw new Error("Missing required parameters: code");
    }

    if (!redirectUri) {
        throw new Error("Missing required parameters: redirect_uri");
    }

    // Handle the OAuth callback here
    const token = await exchangeCodeForToken(code, redirectUri)
    const githubUser = await getUserFromToken(token)
    const githubUsername = githubUser.login

    await userModel
        .findOneAndUpdate({_id: user.id}, {githubToken: token, githubUsername: githubUsername})
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
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const {portfolioUrl} = req.query;

    if (!portfolioUrl) {
        throw new ApiError(400, "Missing required parameters: portfolioUrl");
        return;
    }
    // Generate HTML files
    await generateHtmlFiles(portfolioUrl as string)

    const htmlFolder = getHtmlFolder();
    const portfolioDir = path.join(htmlFolder, portfolioUrl as string);

    if (!fs.existsSync(portfolioDir)) {
        res.status(404).send("Portfolio directory not found.");
        return;
    }


    const {
        githubToken,
        githubUsername
    } = await userModel.findById(user.id).select("githubToken githubUsername").then((user) => {
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    });

    if (!githubToken || !githubUsername) {
        throw new ApiError(400, "Not authorized with Github");
    }
    await uploadFilesToGithubPages(
        githubToken as string,
        githubUsername as string,
        portfolioUrl as string,
        portfolioDir,
    );

    const url = `https://${githubUsername}.github.io/${portfolioUrl}/`;

    res.send({url: url});
});


export default router;