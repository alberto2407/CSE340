const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildGetInventoryById = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inventory_id)
  const grid = utilities.buildVehicleDetail(data[0])
  let nav = await utilities.getNav()
  res.render("./inventory/inventory", {
    title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
    nav,
    grid,
  })
}

/* ****************************************
*  Deliver inventory management view
* *************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  // console.log(req.query?.notice)
  req.flash("info", "Welcome to the Inventory Management Page")
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    // messages: req.query?.notice
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.insertClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  if (!classification_name) {
    req.flash("notice", "Classification name is required.")
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }

  const regResult = await invModel.insertClassification(classification_name)

  if (regResult) {
    req.flash("notice", "Classification added successfully.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await invModel.getClassifications()
  console.log("classificationList", classificationList.rows)
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList: classificationList.rows,
    errors: null,
  })
}

invCont.insertInventory = async function (req, res) {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const result = await invModel.insertInventory(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    // res.redirect(`/inv?notice=${encodeURIComponent(`The ${inv_make} ${inv_model} was successfully added.`)}`)
    res.redirect("/inv")
  } else {
    let nav = await utilities.getNav()
    const classificationList = await invModel.getClassifications()
    req.flash("notice", "Sorry, the vehicle could not be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList: classificationList.rows,
      errors: null,
    })
  }
}
module.exports = invCont;