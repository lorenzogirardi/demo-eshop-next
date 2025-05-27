const express = require('express');
const { OpenAI } = require("openai");

// Create an Express router
const router = express.Router();

// Define a POST route for /search
router.post('/search', async (req, res) => {
    const query = req.body.query;
    try {
        // Initialize the OpenAI client INSIDE the handler
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Use OpenAI API to understand the query
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or a newer/more suitable model
            messages: [
                { role: "system", content: "You are an assistant that helps find outfits. Extract key characteristics from the user's query for searching a fashion inventory. Focus on type of clothing, color, style, occasion, season, and material. Return these characteristics as a comma-separated list." },
                { role: "user", content: query }
            ],
        });

        if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message || !completion.choices[0].message.content) {
            throw new Error("Invalid response structure from OpenAI API");
        }

        const extractedFeatures = completion.choices[0].message.content.toLowerCase().split(',').map(s => s.trim()).filter(s => s);

        // Mock dataset of outfits (array of objects)
        const outfits = [
            { name: "Classic Blue Jeans", description: "Comfortable and stylish blue denim jeans.", tags: ["jeans", "blue", "denim", "casual", "everyday"], imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Blue+Jeans" },
            { name: "Red Cocktail Dress", description: "Elegant red dress perfect for evening events.", tags: ["dress", "red", "cocktail", "evening", "formal", "silk"], imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Red+Dress" },
            { name: "White Linen Shirt", description: "Breathable white linen shirt, ideal for summer.", tags: ["shirt", "white", "linen", "summer", "casual"], imageUrl: "https://via.placeholder.com/150/FFFFFF/000000?Text=White+Shirt" },
            { name: "Black Formal Suit", description: "A sharp black suit for formal occasions.", tags: ["suit", "black", "formal", "men", "wool"], imageUrl: "https://via.placeholder.com/150/000000/FFFFFF?Text=Black+Suit" },
            { name: "Green Khaki Shorts", description: "Casual green khaki shorts for warm weather.", tags: ["shorts", "green", "khaki", "casual", "summer"], imageUrl: "https://via.placeholder.com/150/008000/FFFFFF?Text=Khaki+Shorts" },
            { name: "Floral Sundress", description: "A light floral sundress for sunny days.", tags: ["dress", "floral", "summer", "casual", "cotton"], imageUrl: "https://via.placeholder.com/150/FFC0CB/000000?Text=Floral+Dress" },
            // Add more diverse outfits here
        ];

        let matchedOutfits = [];
        if (extractedFeatures.length > 0) {
            matchedOutfits = outfits.filter(outfit => {
                return extractedFeatures.some(feature => 
                    outfit.tags.some(tag => tag.toLowerCase().includes(feature)) ||
                    outfit.name.toLowerCase().includes(feature) ||
                    outfit.description.toLowerCase().includes(feature)
                );
            });
        }

        res.render('results', { outfits: matchedOutfits, query: query });

    } catch (error) {
        console.error("Error with OpenAI API or search logic:", error);
        res.status(500).send("Error processing your search. Please try again.");
    }
});

// Export the router
module.exports = router;
