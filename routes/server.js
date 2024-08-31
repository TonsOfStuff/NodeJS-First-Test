const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("header.ejs");
})

module.exports = router;