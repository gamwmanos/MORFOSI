import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "bbuv8qjb", // Βάλε εδώ το ID από το sanity.io
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false, // false για να βλέπουμε αμέσως τις αλλαγές στο localhost
});