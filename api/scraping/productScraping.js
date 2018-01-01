var request = require('request');
var cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient




const retrieveSKU = (sku,cb) => {
  request(`https://www.homedepot.com/s/${sku}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html)
      let productEntry = {}
      if($('.product-title__title')[0] && $('.product-title__title')[0].children && $('.product-title__title')[0].children[0]){
        productEntry.title = $('.product-title__title')[0].children[0].data
      }
      if($('#mainImage') && $('#mainImage')[0] && $('#mainImage')[0].attribs){
        productEntry.mainImg = $('#mainImage')[0].attribs.src
      }
      if($('#ajaxPrice') && $('#ajaxPrice')[0] && $('#ajaxPrice')[0].attribs){
        productEntry.priceDollars = $('#ajaxPrice')[0].attribs.content
      }
      if( $('.product_details') && $('.product_details')[0] && $('.product_details')[0].children && $('.product_details')[0].children[0] && $('.product_details')[0].children[0].data ){
        productEntry.model = $('.product_details')[0].children[0].data.trim().replace(/[^#]+?#\s(.*)/,'$1')
      }
      if($('.product_details') && $('.product_details')[1] && $('.product_details')[1].children && $('.product_details')[1].children[1] && $('.product_details')[1].children[1].children && $('.product_details')[1].children[1].children[0] ) {
        productEntry.internet = $('.product_details')[1].children[1].children[0].data
      }
      if($('.product_details') && $('.product_details')[2] && $('.product_details')[2].children && $('.product_details')[2].children[1] && $('.product_details')[2].children[1].children && $('.product_details')[2].children[1].children[0]){
        productEntry.sku = $('.product_details')[2].children[1].children[0].data
      }
      if($('.pricingReg') && $('.pricingReg')[1] && $('.pricingReg')[1].children && $('.pricingReg')[1].children[2]){
        productEntry.uom = $('.pricingReg')[1].children[2].data.trim()
      }
      if( $('.product-title__brand') && $('.product-title__brand')[0] && $('.product-title__brand')[0].children && $('.product-title__brand')[0].children[0]){
        productEntry.brand = $('.product-title__brand')[0].children[0].data.trim()
      }
      if( $('.product-title__brand') && $('.product-title__brand')[0] && $('.product-title__brand')[0].children && $('.product-title__brand')[0].children[0]){
        productEntry.brand = $('.product-title__brand')[0].children[0].data.trim()
      }
      productEntry.dateAccessed = new Date()
      cb(productEntry)
    } else {
      cb('error')
    }
  });

}

//

module.exports = {
  retrieveSKU: retrieveSKU
}
