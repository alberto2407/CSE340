const { body, validationResult } = require("express-validator")
const utilities = require(".")

const classVal = {}

classVal.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("Classification must be alphanumeric.")
      .isLength({ max: 30 })
      .withMessage("Classification name must be no more than 30 characters."),
  ]
}

classVal.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors,
      classification_name: req.body.classification_name
    })
    return
  }
  next()
}

module.exports = classVal
