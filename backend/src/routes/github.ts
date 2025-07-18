import express from "express"
import {authHandler} from "@/middleware";
import {exchangeCodeForToken, exportToGithubPages, getUserFromToken} from "@/services/githubService";
import userModel from "@/models/UserModel";
import {ApiError} from "@/classes";
import config from "@/utils/config";

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
    if (!portfolioUrl || typeof portfolioUrl !== 'string') {
        throw new ApiError(400, "Missing or invalid required parameter: portfolioUrl");
    }
    const result = await exportToGithubPages(portfolioUrl, user.id)

    res.send(result);
});

router.get("/oauth-url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.send({GH_OAUTH_CLIENT_ID: config.GH_OAUTH_CLIENT_ID})

})


export default router;