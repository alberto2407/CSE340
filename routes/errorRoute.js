// routes/errorRoute.js

const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")

router.get("/error-test", errorController.errorTest)

module.exports = router
