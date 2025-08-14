// utilities/inventory-validation.js
const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const invValid = {}

invValid.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("You must choose a classification."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),
    body("inv_image")
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
  ]
}

invValid.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    const classificationData = await invModel.getClassifications()
    console.log("classificationData", classificationData)
    
    // const classificationList = await utilities.buildClassificationList(
    //   classificationData.rows,
    //   req.body.classification_id 
    // )

    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList: [],
      errors: errors,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
    })
    return
  }
  next()
}

module.exports = invValid