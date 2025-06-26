import {useLoaderData} from "react-router";
import config from "~/config";
import {Helmet} from "react-helmet";

interface PortfolioData {
    url: string;
    title: string;
}

export default function PortfolioRoute() {
    const portfolioData: PortfolioData = useLoaderData()
    console.log(portfolioData)

    return (
        <>
            <Helmet>
                <title>{portfolioData.title}</title>
            </Helmet>
            <iframe
                src={`${config.BACKEND_URL}/portfolio/view/${portfolioData.url}`}
                style={{
                    width: "100%",
                    height: "100vh",
                    border: "none",
                }}
            />
        </>
    );
}