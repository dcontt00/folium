import axios from "axios";
import fs from "fs";
import config from "@/utils/config";

const GITHUB_API_URL = "https://api.github.com";


async function revokeGithubToken(clientId: string, clientSecret: string, token: string) {
    const url = `https://api.github.com/applications/${clientId}/token`;
    await axios.delete(url, {
        auth: {
            username: clientId,
            password: clientSecret,
        },
        data: {
            access_token: token,
        },
    }).then((res) => {
        console.log("Token revoked successfully.");
    }).catch((err) => {
        console.error("Error revoking token:", err.message);
        throw new Error("Error revoking token");
    })
}

async function getUserFromToken(githubToken: string) {
    console.log("getUserFromToken", githubToken)
    const url = `${GITHUB_API_URL}/user`;

    const response = await axios.get(url, {
        headers: {Authorization: `Bearer ${githubToken}`},
    }).then((result) => {
        console.log("result", result)
        return result
    }).catch((error) => {
        console.error("Error fetching user from token:", error.message);
        throw new Error("Error fetching user from token");
    })
    console.log("response", response.data)
    return response.data; // Returns user details
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
    return await axios.get(
        "https://github.com/login/oauth/access_token",
        {
            params: {
                client_id: config.GITHUB_OAUTH_CLIENT_ID,
                client_secret: config.GITHUB_OAUTH_CLIENT_SECRET,
                code: code,
                redirect_uri: redirectUri,
            },
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "application/json",
            },
        }
    ).then((res) => {
        if (res.data.error) {
            console.error("Error exchanging code for token:", res.data.error);
            throw new Error("Error exchanging code for token");
        }
        return res.data.access_token;
    }).catch((err) => {
        console.error("Error exchanging code for token:", err.message);
        throw new Error("Error exchanging code for token");
    })

}

async function uploadFilesToGithubPages(githubToken: string, githubUser: string, portfolioUrl: string, filePath: string) {
    if (!await repositoryExists(githubToken, githubUser, portfolioUrl)) {
        await createRepository(githubToken, portfolioUrl)
    }

    if (!await branchExists(githubToken, githubUser, portfolioUrl, "gh-pages")) {
        await createBranch(githubToken, githubUser, portfolioUrl, "gh-pages")
    }

    const files = fs.readdirSync(filePath);
    for (const file of files) {
        const fullPath = `${filePath}/${file}`;
        await uploadFileToGithubPages(
            githubToken,
            githubUser,
            portfolioUrl,
            fullPath,
        );
    }
}

async function uploadFileToGithubPages(githubToken: string, githubUser: string, portfolioUrl: string, filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileName = filePath.split("/").pop()!;
    const url = `${GITHUB_API_URL}/repos/${githubUser}/${portfolioUrl}/contents/${fileName}`;

    // Convert file content to Base64
    const contentBase64 = Buffer.from(fileContent).toString("base64");
    const fileSha = await getFileShaIfExists(githubToken, githubUser, portfolioUrl, fileName, "gh-pages");

    if (!fileSha) {
        await axios.put(
            url,
            {
                message: `Add ${fileName}`,
                content: contentBase64,
                branch: "gh-pages",
            },
            {headers: {Authorization: `Bearer ${githubToken}`}}
        ).catch((error) => {
            console.error("Error adding file:", error.message);
        })

    } else {
        await axios.put(
            url,
            {
                message: `Update ${fileName}`,
                content: contentBase64,
                branch: "gh-pages",
                sha: fileSha,
            },
            {headers: {Authorization: `Bearer ${githubToken}`}}
        ).catch((error) => {
            console.error("Error editing file:", error.message);
        })
    }
}

async function createRepository(githubToken: string, portfolioUrl: string) {
    const url = `${GITHUB_API_URL}/user/repos`;

    try {
        await axios.post(
            url,
            {
                name: portfolioUrl,
                private: false,
                auto_init: true,
            },
            {headers: {Authorization: `Bearer ${githubToken}`}}
        );
        console.log(`Repository ${portfolioUrl} created successfully.`);
    } catch (error) {
        console.error("Error creating repository:", error);
    }
}

async function repositoryExists(githubToken: string, githubUsername: string, portfolioUrl: string) {
    const url = `${GITHUB_API_URL}/repos/${githubUsername}/${portfolioUrl}`;

    try {
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${githubToken}`},
        });
        return response.status === 200;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return false; // Repository does not exist
        }
        throw error; // Some other error occurred
    }
}

async function createBranch(githubToken: string, githubUsername: string, portfolioUrl: string, branch: string
) {
    const url = `${GITHUB_API_URL}/repos/${githubUsername}/${portfolioUrl}/git/refs`;

    const mainSha = await getShaOfMainBranch(githubToken, githubUsername, portfolioUrl)
    console.log("mainSha", mainSha)

    try {
        await axios.post(
            url,
            {
                ref: `refs/heads/${branch}`,
                sha: mainSha
            },
            {headers: {Authorization: `Bearer ${githubToken}`}}
        );
        console.log(`Branch ${branch} created successfully.`);
    } catch (error: any) {
        console.error("Error creating branch:", error.message);
    }
}

async function getShaOfMainBranch(githubToken: string, githubUsername: string, portfolioUrl: string) {
    const url = `${GITHUB_API_URL}/repos/${githubUsername}/${portfolioUrl}/git/refs/heads/main`;

    try {
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${githubToken}`},
        });
        return response.data.object.sha;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null; // Main branch does not exist
        }
        throw error; // Some other error occurred
    }
}

async function branchExists(githubToken: string, githubUser: string, portfolioUrl: string, branch: string) {
    const url = `${GITHUB_API_URL}/repos/${githubUser}/${portfolioUrl}/git/refs/heads/${branch}`;

    try {
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${githubToken}`},
        });
        return response.status === 200;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return false; // Branch does not exist
        }
        throw error; // Some other error occurred
    }
}

async function getFileShaIfExists(
    githubToken: string,
    githubUser: string,
    portfolioUrl: string,
    fileName: string,
    branch: string
): Promise<string | null> {
    const url = `https://api.github.com/repos/${githubUser}/${portfolioUrl}/contents/${fileName}?ref=${branch}`;

    try {
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${githubToken}`},
        });
        return response.data.sha; // Return the SHA if the file exists
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null; // File does not exist, return null
        }
        throw error; // Some other error occurred
    }
}


export {
    uploadFileToGithubPages,
    uploadFilesToGithubPages,
    exchangeCodeForToken,
    getUserFromToken,
    getFileShaIfExists
}
