import fs from "fs";
import path from "path";

function getRootFolder() {
    return path.resolve(__dirname, '../../');
}

function getExportsFolder() {
    return path.join(getRootFolder(), "exports");
}

function getImagesFolder() {
    return path.join(getRootFolder(), "images");
}

function getHtmlFolder() {
    return path.join(getRootFolder(), "html");
}


function createDirectories() {
    const exportsFolder = getExportsFolder();
    const imagesFolder = getImagesFolder();
    const htmlFolder = getHtmlFolder();
    if (!fs.existsSync(exportsFolder)) {
        fs.mkdirSync(exportsFolder);
        console.log("Created exports folder");
    }
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
        console.log("Created images folder");
    }
    if (!fs.existsSync(htmlFolder)) {
        fs.mkdirSync(htmlFolder);
        console.log("Created html folder");
    }
}

export {
    getExportsFolder,
    createDirectories,
    getImagesFolder,
    getHtmlFolder,

}

