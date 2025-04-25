import express from "express";
import {ComponentModel, PortfolioModel} from "@/models";
import {authHandler} from "@/middleware";
import {ApiError, AuthenticationError} from "@/classes";
import {
    createInitialPortfolio,
    generateHtmlFiles,
    getPorfolioByUrl,
    getPortfoliosByUserId,
    removePortfolioByUrl,
    restorePortfolio,
    zipPortfolio
} from "@/services/portfolioService";
import {IPortfolio} from "@/interfaces";
import {componentsAreEquals, createComponent} from "@/services/componentService";
import {createVersion, deleteOlderVersions, getVersionById, getVersionsByPortfolioId} from "@/services/versionService";
import Component from "@/classes/components/Component";


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

    await generateHtmlFiles(req.body.url)


});

router.get("/:url/export", authHandler, async (req, res) => {
    try {
        const portfolioUrl = req.params.url;
        await generateHtmlFiles(portfolioUrl)
        const outputFilePath = await zipPortfolio(portfolioUrl);

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

    if (req.query.restore == 'true') {
        const restoredPortfolio = await restorePortfolio(version, components)
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
        }
        res.status(200).json({
            status: 200,
            success: true,
            data: portfolio,
        });
    }


})

router.get("/:portfolioUrl/view", authHandler, async (req, res) => {

    const portfolio = await getPorfolioByUrl(req.params.portfolioUrl);

    if (portfolio == null) {
        throw new ApiError(404, "Portfolio not found");
    }

    res.send(portfolio.toHtml())


})


router.get("/:url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolio = await getPorfolioByUrl(req.params.url)
    res.status(200).json({
        status: 200,
        success: true,
        data: portfolio,
    });


});

router.put("/:url", authHandler, async (req, res) => {
    const components: any[] = [];
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolio = await PortfolioModel
        .findOne({url: req.params.url, user: user.id})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        });

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }


    if (req.body.components) {
        for (const reqComponent of req.body.components) {
            const portfolioComponent = portfolio.components.find((component: any) => component.componentId === reqComponent.componentId);

            // If portfolioComponent===undefined -> Created new component

            if (!componentsAreEquals(reqComponent, portfolioComponent)) {
                await createComponent(reqComponent, portfolio._id).then((c) => {
                    components.push(c);
                });
            } else {
                components.push(portfolioComponent);
            }
        }
    }

    await PortfolioModel.findOneAndUpdate(
        {url: req.params.url, user: user.id},
        {...req.body, components: components},
        {new: true}
    ).populate({
        path: "components",
        populate: {
            path: "components",
        }
    }).then(async (updatedPortfolio) => {
        res.status(200).json({
            status: 200,
            success: true,
            data: updatedPortfolio,
        });

        if (updatedPortfolio == null) {
            throw new ApiError(404, "Portfolio not found");
        }

        await createVersion(portfolio, updatedPortfolio)
        await generateHtmlFiles(portfolio.url)
    })

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

