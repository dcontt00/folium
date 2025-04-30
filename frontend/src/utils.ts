function capitalize(string: string | null) {
    if (!string) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function generateRandomClassName(prefix: string = "class"): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${prefix}-${randomString}`;
}

function getContrastColor(hexColor: string): string {
    // Remove the hash if it exists
    const color = hexColor.replace("#", "");

    // Convert the hex color to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calculate the luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors and white for dark colors
    return luminance > 0.5 ? "black" : "white";
}

export {capitalize, generateRandomClassName, getContrastColor};