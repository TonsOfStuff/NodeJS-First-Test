const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    

    res.render("mainPage.ejs");
    
})


module.exports = router;