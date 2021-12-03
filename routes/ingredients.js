const express = require('express');
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;

router.get('/all', async (req, res) => {
    const ingredients = await ingredientsData.getAll(req.query.term);
    res.setHeader('Content-Type', 'application/json');
    // res.end(JSON.stringify(ingredients));
    let results = [];
    for(let ingredient of ingredients) {
        let item = {
            id: ingredient._id,
            text: ingredient.name
        };
        results.push(item);
    }
    let result = {results: results};
    res.end(JSON.stringify(result));
});

module.exports = router;