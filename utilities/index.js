const invModel = require("../models/inventory-model")
const Util = {}
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      grid +=    '<img src="' + vehicle.inv_thumbnail + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
      grid +=  '</a>'
      grid +=  '<div class="vehicle-card-text">'
      grid +=    '<h2><a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      grid +=    vehicle.inv_make + ' ' + vehicle.inv_model + '</a></h2>'
      grid +=    '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid +=  '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += 'Sorry, no matching vehicles could be found.'
  }
  return grid
}
Util.buildVehicleDetail = function (vehicle) {
  let detail

  if (vehicle) {
    detail = `
      <section id="vehicle-detail">
        <div class="vehicle-info">
          <div class="vehicle-image">
            <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          </div>
          <div class="vehicle-details">
            <h1>${vehicle.inv_make} ${vehicle.inv_model} Details</h1>
            <div class="vehicle-specs striped">
              <strong><p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p></strong>
              <p><strong>Model:</strong> ${vehicle.inv_model}</p>
              <p><strong>Description:</strong> ${vehicle.inv_description}</p>
              <p><strong>Color:</strong> ${vehicle.inv_color}</p>
              <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
            </div>
          </div>
        </div>
      </section>
    `
  } else {
    detail = `<p class="notice">Sorry, vehicle details could not be found.</p>`
  }
  return detail
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util