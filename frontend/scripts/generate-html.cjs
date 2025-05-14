// File: scripts/generate-html.cjs
const fs = require('fs');
const path = require('path');

// Define the pages and their titles
const pages = [
    {name: '/', title: 'Index'},
    {name: '/login', title: 'Login'},
    {name: '/register', title: 'Register'},
    {name: '/home', title: 'Home'},
    {name: '/view', title: 'Portfolio'},
    {name: '/edit', title: 'Edit'},
    {name: "/github-callback", title: "GitHub Callback"},
    {name: "/profile", title: "Profile"},
];

// Directory where the HTML files will be created
const outputDir = path.resolve(__dirname, '../');

// Template for the HTML file
const htmlTemplate = (title) => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <link href="/favicon.ico" rel="icon" type="image/x-icon">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>${title}</title>
</head>
<body>
<div id="root"></div>
<script src="/src/main.tsx" type="module"></script>
</body>
</html>
`;

// Generate the HTML files
pages.forEach(({name, title}) => {
    const filePath = path.join(outputDir, `${name}/index.html`);
    const dirPath = path.dirname(filePath);

    // Ensure the directory exists
    fs.mkdirSync(dirPath, {recursive: true});

    // Write the HTML file
    fs.writeFileSync(filePath, htmlTemplate(title), 'utf-8');
    console.log(`Generated: ${filePath}`);
});