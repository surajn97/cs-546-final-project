const express = require('express');
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;

router.get('/', async (req, res) => {
    try {
        const ingredients = await ingredientsData.getAll();
        res.render("users/test", {
            title: 'Test',
            ingredients: ingredients,
            home_page: true
        });
    } catch (e) {
        res.status(400).render('error', {
            error: e,
            title: 'Error',
            status: '400'
        });
    }
});

module.exports = router;