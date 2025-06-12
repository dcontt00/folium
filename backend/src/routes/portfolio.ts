import express from "express";
import {ComponentModel, PortfolioModel} from "@/models";
import {authHandler} from "@/middleware";
import {ApiError, AuthenticationError} from "@/classes";
import {
    createInitialPortfolio,
    editPortfolio,
    exportPortfolioAsZip,
    getPortfolioByUrl,
    getPortfoliosByUserId,
    removePortfolioByUrl,
    restorePortfolio,
} from "@/services/portfolioService";
import {IPortfolio} from "@/interfaces";
import {deleteOlderVersions, getVersionById, getVersionsByPortfolioId} from "@/services/versionService";
import Component from "@/classes/components/Component";
import styleModel from "@/models/StyleModel";
import {getHtmlFolder} from "@/utils/directories";


const router = express.Router();


router.post("/", authHandler, async (req, res) => {

    // Get user from the request
    const user = req.user;

    if (!user) {
        throw new AuthenticationError("User not found");
    }

    if (!req.body.url || !req.body.title) {
        throw new ApiError(500, "URL and title are required");
    }

    const initialPortfolio = await createInitialPortfolio(req.body.title, req.body.url, req.body.description, user.id);
    res.status(200).json({
        status: 200,
        success: true,
        data: initialPortfolio,
    })
});

router.get("/:url/export", authHandler, async (req, res) => {
    try {
        const portfolioUrl = req.params.url;
        const outputFilePath = await exportPortfolioAsZip(portfolioUrl);

        // Send the file for download
        res.download(outputFilePath, `${portfolioUrl}.zip`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Error sending file',
                });
            }
        });

    } catch (error) {
        console.error('Error exporting portfolio to HTML:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Error exporting portfolio to HTML',
        });
    }
});


router.get("/", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolios = await getPortfoliosByUserId(user.id)
    res.status(200).json({
        status: 200,
        success: true,
        data: portfolios,
    });


});

router.get("/:portfolioId/versions", authHandler, async (req, res) => {

    const versions = await getVersionsByPortfolioId(req.params.portfolioId);
    res.status(200).json({
        status: 200,
        success: true,
        data: versions,
    });

});


router.get("/version/:versionId", authHandler, async (req, res) => {
    const versionId = req.params.versionId;

    if (!versionId) {
        throw new ApiError(400, "Version ID is required");
    }

    const version = await getVersionById(versionId)

    if (version == null) {
        throw new ApiError(404, "Version not found");
    }

    const components: Component[] = await ComponentModel.find({_id: {$in: version.components}})
    const style = await styleModel
        .findById(version.style)
        .populate("classes")

    if (req.query.restore == 'true') {
        const restoredPortfolio = await restorePortfolio(version, components, style)
        res.status(200).json({
            status: 200,
            success: true,
            data: restoredPortfolio,
        })
        await deleteOlderVersions(version.portfolioId, version.createdAt)

    } else {
        const portfolio: IPortfolio = {
            _id: version.portfolioId,
            title: version.title,
            description: version.description,
            url: version.url,
            components: components,
            // @ts-ignore
            style: style,
        }
        res.status(200).json({
            status: 200,
            success: true,
            data: portfolio,
        });
    }


})

// Serve static files from the HTML folder. Used to serve the generated HTML files.
router.use("/view", express.static(getHtmlFolder()))


router.get("/:url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolio = await getPortfolioByUrl(req.params.url)
    if (portfolio == null) {
        throw new ApiError(404, "Portfolio not found");
    }
    res.status(200).json({
        status: 200,
        success: true,
        data: portfolio,
    });


});

router.put("/:url", authHandler, async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const result = await editPortfolio(
        req.params.url,
        req.body.title,
        req.body.description,
        req.body.components,
        req.body.style
    );

    res.status(result.status).json(result)


})


router.delete("/:url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new Error("User not found");
    }

    const portfolio = await PortfolioModel.findOne({url: req.params.url});

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    await removePortfolioByUrl(req.params.url)
    res.status(200).json({
        status: 200,
        success: true,
        data: null,
    })

})

export default router;

