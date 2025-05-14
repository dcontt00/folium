import {useLoaderData} from "react-router";
import config from "~/config";
import {Helmet} from "react-helmet";

interface PortfolioData {
    portfolioUrl: string;
    portfolioTitle: string;
}

export default function PortfolioRoute() {
    const portfolioData: PortfolioData = useLoaderData()

    return (
        <>
            <Helmet>
                <title>{portfolioData.portfolioTitle}</title>
            </Helmet>
            <iframe
                src={`${config.BACKEND_URL}/portfolio/view/${portfolioData.portfolioUrl}`}
                style={{
                    width: "100%",
                    height: "100vh",
                    border: "none",
                }}
                title="Portfolio Viewer"
            />
        </>
    );
}