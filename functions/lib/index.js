import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
initializeApp();
const CURATED_DESTINATIONS = {
    stockholm: [
        { name: "Gamla Stan", category: "Sightseeing", lat: 59.3257, lng: 18.0719, rating: 4.8, description: "Historical colorful old town with cobbled streets." },
        { name: "Fotografiska", category: "Museum", lat: 59.3179, lng: 18.0863, rating: 4.6, description: "Contemporary photography museum and cafe." },
        { name: "Rosendals Trädgård", category: "Cafe", lat: 59.3281, lng: 18.1186, rating: 4.7, description: "Beautiful organic orchard and greenhouse cafe." },
        { name: "Djurgården", category: "Park", lat: 59.3269, lng: 18.1251, rating: 4.9, description: "Tranquil green island perfect for afternoon walks." },
        { name: "Ett Hem", category: "Restaurant", lat: 59.3431, lng: 18.0667, rating: 4.9, description: "Nordic farm-to-table cuisine in a cozy townhouse." }
    ],
    copenhagen: [
        { name: "Nyhavn", category: "Sightseeing", lat: 55.6799, lng: 12.5898, rating: 4.7, description: "Iconic 17th-century waterfront and townhouses." },
        { name: "Designmuseum Danmark", category: "Museum", lat: 55.6865, lng: 12.5932, rating: 4.6, description: "Scandinavian furniture and design classics." },
        { name: "Atelier September", category: "Cafe", lat: 55.6823, lng: 12.5794, rating: 4.5, description: "Famous minimalist cafe serving avocado rye toast." },
        { name: "Tivoli Gardens", category: "Park", lat: 55.6737, lng: 12.5683, rating: 4.8, description: "Historic amusement park with fairy-tale lights." },
        { name: "Noma", category: "Restaurant", lat: 55.6828, lng: 12.6104, rating: 4.9, description: "Renowned pioneer of New Nordic gastronomy." }
    ],
    reykjavik: [
        { name: "Hallgrímskirkja", category: "Sightseeing", lat: 64.1417, lng: -21.9266, rating: 4.7, description: "Basalt-column inspired Lutheran church." },
        { name: "Blue Lagoon", category: "Sightseeing", lat: 63.8792, lng: -22.4451, rating: 4.8, description: "Geothermal spa in a lava field." },
        { name: "Kaffibarinn", category: "Cafe / Bar", lat: 64.1466, lng: -21.9329, rating: 4.4, description: "Cozy indie bar and cafe in downtown Reykjavik." },
        { name: "Sandholt Bakery", category: "Cafe", lat: 64.1458, lng: -21.9272, rating: 4.6, description: "Artisan sourdough and Scandinavian pastries." },
        { name: "Dill Restaurant", category: "Restaurant", lat: 64.1463, lng: -21.9312, rating: 4.8, description: "Michelin-starred Nordic experimental dining." }
    ],
    oslo: [
        { name: "Vigeland Sculpture Park", category: "Park", lat: 59.9272, lng: 10.7024, rating: 4.8, description: "World's largest single-artist sculpture park." },
        { name: "MUNCH Museum", category: "Museum", lat: 59.9062, lng: 10.7554, rating: 4.5, description: "Stunning waterfront museum dedicated to Edvard Munch." },
        { name: "Fuglen Oslo", category: "Cafe", lat: 59.9171, lng: 10.7391, rating: 4.7, description: "Vintage-styled coffee bar and cocktail den." },
        { name: "Operahuset Oslo", category: "Sightseeing", lat: 59.9075, lng: 10.7531, rating: 4.8, description: "Angled white marble roof walkable Opera House." },
        { name: "Maaemo", category: "Restaurant", lat: 59.9084, lng: 10.7588, rating: 4.9, description: "Three Michelin-starred culinary journey of Norway." }
    ]
};
/**
 * Fetches locations from OpenStreetMap Nominatim API,
 * with a fallback to highly detailed curated aesthetic spots.
 */
export const wayfarerHubFetchLocations = onCall({ cors: true }, async (request) => {
    const query = (request.data?.query ?? "").trim().toLowerCase();
    if (!query) {
        throw new HttpsError("invalid-argument", "Query string is required.");
    }
    // 1. Check if the query matches a curated destination
    for (const key of Object.keys(CURATED_DESTINATIONS)) {
        if (query.includes(key) || key.includes(query)) {
            return {
                source: "curated",
                results: CURATED_DESTINATIONS[key].map((spot) => ({
                    name: spot.name,
                    category: spot.category,
                    formattedAddress: `${spot.name}, ${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    lat: spot.lat,
                    lng: spot.lng,
                    rating: spot.rating,
                    description: spot.description
                }))
            };
        }
    }
    // 2. Otherwise, fetch from OpenStreetMap Nominatim
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "WayfarerHub/1.0 (dev-portfolio)",
                "Accept-Language": "en"
            }
        });
        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.statusText}`);
        }
        const data = (await response.json());
        const results = data.map((item) => {
            // Deduce a clean display name
            const displayNameParts = item.display_name.split(",");
            const name = displayNameParts[0];
            const category = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Spot";
            return {
                name: name,
                category: category,
                formattedAddress: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                rating: 4.5, // Standard placeholder rating
                description: `Coordinates: ${item.lat}, ${item.lon}`
            };
        });
        return {
            source: "nominatim",
            results: results
        };
    }
    catch (err) {
        console.error("Nominatim fetch failed, returning dynamic mock spots:", err);
        // Generates a mock spot relative to a default coordinate if geocoding completely fails
        return {
            source: "mock-generator",
            results: [
                {
                    name: `${query.charAt(0).toUpperCase() + query.slice(1)} Cafe`,
                    category: "Cafe",
                    formattedAddress: `${query.charAt(0).toUpperCase() + query.slice(1)} Central`,
                    lat: 59.3293 + (Math.random() - 0.5) * 0.05,
                    lng: 18.0686 + (Math.random() - 0.5) * 0.05,
                    rating: 4.7,
                    description: "Minimalist Scandinavian design serving light lunch and pour-over coffee."
                },
                {
                    name: `${query.charAt(0).toUpperCase() + query.slice(1)} Museum`,
                    category: "Museum",
                    formattedAddress: `${query.charAt(0).toUpperCase() + query.slice(1)} Art District`,
                    lat: 59.3293 + (Math.random() - 0.5) * 0.05,
                    lng: 18.0686 + (Math.random() - 0.5) * 0.05,
                    rating: 4.5,
                    description: "Exhibition showcasing historical designs and modern regional masterpieces."
                }
            ]
        };
    }
});
/**
 * Compiles a trip itinerary into a clean, formatted Markdown document for printing.
 */
export const wayfarerHubCompileItinerary = onCall({ cors: true }, async (request) => {
    const { title, description, days, items } = (request.data ?? {});
    if (!title || !days || !items) {
        throw new HttpsError("invalid-argument", "Missing parameters for compileItinerary.");
    }
    let doc = `# ${title.toUpperCase()}\n`;
    if (description) {
        doc += `*${description}*\n\n`;
    }
    doc += `---\n\n`;
    days.forEach((dayLabel, index) => {
        doc += `## ${dayLabel}\n\n`;
        const dayItems = items
            .filter((item) => item.dayIndex === index)
            .sort((a, b) => {
            const timeA = a.time || "23:59";
            const timeB = b.time || "23:59";
            return timeA.localeCompare(timeB);
        });
        if (dayItems.length === 0) {
            doc += `*No activities scheduled for this day.*\n\n`;
        }
        else {
            dayItems.forEach((item) => {
                const timeStr = item.time ? `**[${item.time}]** ` : "";
                doc += `### ${timeStr}${item.title}\n`;
                if (item.location) {
                    doc += `- 📍 *Location:* ${item.location.name} (${item.location.formattedAddress})\n`;
                }
                if (item.notes) {
                    doc += `- 📝 *Notes:* ${item.notes}\n`;
                }
                doc += `\n`;
            });
        }
        doc += `\n`;
    });
    doc += `*Compiled via Wayfarer Hub — a Jordan Katz project.*`;
    return { markdown: doc };
});
//# sourceMappingURL=index.js.map