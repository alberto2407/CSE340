// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidation = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:inventoryId", invController.buildGetInventoryById);

// Management view route
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification)

// Route to insert a new classification
router.post("/add-classification", classValidation.classificationRules(), classValidation.checkClassificationData, utilities.handleErrors(invController.insertClassification))

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to insert a new inventory item
router.post("/add-inventory", invValidate.addInventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.insertInventory))

module.exports = router;