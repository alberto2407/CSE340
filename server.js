/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const e = require("express")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/");
const errorRoute = require("./routes/errorRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(express.static("public")) // Serve static files from the public directory
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// Error Route
app.use("/", errorRoute)
// Management to avoid Chrome DevTools error
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(404).send("Not Found");
});
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} 
  else {message = '<p class="notice">Oh no! There was a crash. Maybe try a different route?</p>'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on port http://${host}:${port}`)
})
