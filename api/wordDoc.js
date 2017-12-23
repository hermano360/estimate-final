const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
// Load the docx file as a binary

const convertShoppingCart = (shoppingCart) => {
  console.log(shoppingCart)
  let formattedShoppingCart = []
  let itemCount = 1

  shoppingCart.forEach((cartItem) => {
    if (formattedShoppingCart.indexOf(cartItem.template) === -1) {
      formattedShoppingCart.push(cartItem.template)
    }
    if (Number(cartItem.quantity) !== 0) {
      formattedShoppingCart.push({
        'order': itemCount++,
        'description': cartItem.description,
        'quantity': `${parseInt(cartItem.quantity, 10)} ${cartItem.UOM}`
      })
    }
  })
  return formattedShoppingCart.map((item) => {
    if (typeof item === 'string') {
      return {
        'order': '',
        'description': '',
        'quantity': '',
        'template': item.toUpperCase()
      }
    } else {
      return {
        'order': item.order,
        'description': item.description,
        'quantity': item.quantity,
        'template': ''
      }
    }
  })
}



let nowDate = new Date()
let monthRef = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
let dateString = `${nowDate.getDate()}-${monthRef[nowDate.getMonth()]}-${nowDate.getFullYear().toString().slice(-2)}`

module.exports = {
  generateWord: (total, quoteInfo, cb) => {
    var content = fs
        .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary')
    var zip = new JSZip(content)
    var doc = new Docxtemplater()
    doc.loadZip(zip)
    // set the templateVariables
    doc.setData({
      grandTotal: total,
      first_name: quoteInfo.customerFirstName,
      last_name: quoteInfo.customerLastName,
      customerStreetAddress: quoteInfo.address,
      scopeOfWork: quoteInfo.scopeOfWork,
      city: quoteInfo.city,
      state: quoteInfo.state,
      zipcode: quoteInfo.zipcode,
      quoteNumber: quoteInfo.quoteNumber,
      dateOfQuote: quoteInfo.date,
      salesperson: quoteInfo.estimator,
      description: quoteInfo.projectDescription,
      Company: 'Pro Builders Express',
      StreetAddress: '1840 W Whittier Blvd, La Habra, CA 90631',
      phone: '866-360-1526',
      fax: '866-360-1526',
      cell: '866-360-1526',
      Date: dateString,
      cart: convertShoppingCart(quoteInfo.shoppingCart)
    })

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
    } catch (error) {
      var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      }
      console.log(JSON.stringify({error: e}))
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      throw error
    }

    var buf = doc.getZip()
                 .generate({type: 'nodebuffer'})

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, 'ProBuildersEstimate.docx'), buf)
    cb(buf)
    console.log('file was written...')
  }
}
