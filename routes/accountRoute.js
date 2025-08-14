const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route: GET to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route: GET to display the registration view
router.get("/register", accountController.buildRegister)

// Process the registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Route: POST to process the login form
router.post("/login", regValidate.loginRules(), regValidate.validateLogin, (req, res) => {res.status(200).send("login process")})

module.exports = router