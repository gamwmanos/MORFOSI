/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'bbuv8qjb',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function getSettings() {
    const settings = await client.fetch('*[_type == "siteSettings"][0]');
    console.log(JSON.stringify(settings, null, 2));
}

getSettings();
