import {useLoaderData} from "react-router";
import config from "~/config";

export default function PortfolioRoute() {
    const portfolioUrl = useLoaderData() as string; // Assuming the loader returns the portfolio URL

    return (
        <iframe
            src={`${config.BACKEND_URL}/view/${portfolioUrl}`}
            style={{
                width: "100%",
                height: "100vh",
                border: "none",
            }}
            title="Portfolio Viewer"
        />
    );
}