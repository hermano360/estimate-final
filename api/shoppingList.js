const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
// Load the docx file as a binary

const convertShoppingCart = (shoppingCart) => {
  console.log(shoppingCart)

  return shoppingCart.map((cartItem) => {
    return {
      sku:cartItem.sku,
      description:cartItem.specifications,
      uom:cartItem.uom,
      mtl: cartItem.totalMaterial
    }
  })
}


let nowDate = new Date()
let monthRef = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
let dateString = `${nowDate.getDate()}-${monthRef[nowDate.getMonth()]}-${nowDate.getFullYear().toString().slice(-2)}`

module.exports = {
  generateShoppingList: (total, quoteInfo, cb) => {
    var content = fs
        .readFileSync(path.resolve(__dirname, 'shoppingListInput.docx'), 'binary')
    var zip = new JSZip(content)
    var doc = new Docxtemplater()
    doc.loadZip(zip)
    // set the templateVariables
    doc.setData({
      quoteNo: quoteInfo.quoteNumber,
      Company: 'Pro Builders Express',
      grandTotal: total,
      Date: dateString,
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

    var buf = doc.getZip()
                 .generate({type: 'nodebuffer'})

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, 'ProBuildersShoppingList.docx'), buf)
    cb('success')
    console.log('Shopping List was written...')
  }
}
