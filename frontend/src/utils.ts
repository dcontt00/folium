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

export {capitalize, generateRandomClassName};