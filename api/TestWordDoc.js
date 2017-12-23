const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const path = require('path')



const convertShoppingCart = (shoppingCart) => {
  let formattedShoppingCart = []
  let itemCount = 1

  shoppingCart.forEach((cartItem) => {
    console.log(cartItem)
    if (formattedShoppingCart.indexOf(cartItem.template) === -1) {
      formattedShoppingCart.push(cartItem.template)
    }

    if (Number(cartItem.quantity) !== 0) {
      formattedShoppingCart.push({
        'order': itemCount++,
        'description': cartItem.specifications,
        'quantity': `${parseInt(cartItem.quantity, 10)} ${cartItem.uom}`
      })
    }

  })

      console.log(formattedShoppingCart)
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

const generateWord = (total, quoteInfo, cb) => {
  var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary')
  var zip = new JSZip(content)

  var doc = new Docxtemplater().loadZip(zip)

  doc.setData({
    grandTotal: total, //
    first_name: quoteInfo.customerFirstName, //
    last_name: quoteInfo.customerLastName, //
    customerStreetAddress: quoteInfo.address, //
    scopeOfWork: quoteInfo.scopeOfWork, //
    city: quoteInfo.city, //
    state: quoteInfo.state, //
    zipcode: quoteInfo.zipcode, //
    quoteNumber: quoteInfo.quoteNumber, //
    dateOfQuote: quoteInfo.date, //
    salesperson: quoteInfo.estimator, //
    description: "",
    Company: 'Pro Builders Express',
    StreetAddress: '1840 W Whittier Blvd, La Habra, CA 90631',
    phone: '866-360-1526',
    fax: '866-360-1526',
    cell: '866-360-1526',
    Date: quoteInfo.date, //
    cart: convertShoppingCart(quoteInfo.shoppingCart)
  })

  try {
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

  var buf = doc.getZip().generate({type: 'nodebuffer'})
  fs.writeFileSync(path.resolve(__dirname, 'ProBuildersEstimate.docx'), buf)
  cb('success')
}

//

module.exports = {
  generateWord: generateWord
}
