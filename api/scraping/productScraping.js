var request = require('request');
var cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient




const retrieveSKU = (sku,cb) => {
  request(`https://www.homedepot.com/s/${sku}`, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html)
      let productEntry = {}
      if($('.product-title__title').text()){
        productEntry.title = $('.product-title__title').text().trim()
      }
      if($('#mainImage') && $('#mainImage')[0] && $('#mainImage')[0].attribs){
        productEntry.mainImg = $('#mainImage')[0].attribs.src
      }
      if($('.price__dollars')){
        productEntry.priceDollars = $('.price__dollars').text()
      }
      if( $('.product_details.modelNo').text() ){
        productEntry.model = $('.product_details')[0].children[0].data.trim().replace(/[^#]+?#\s(.*)/,'$1')
      }
      if($('#product_internet_number') ) {
        productEntry.internet = $('#product_internet_number').text()
      }
      if($('#product_store_sku').text() || $('.product_details')){
        productEntry.sku = $('#product_store_sku').text() || $('.product_details').toString().replace(/^[\s\S]*?Store SO SKU #<span>(.*?)<\/span>[\s\S]*$/g,"$1").trim() || sku
      }
      if($('.pricingReg').text()){
        productEntry.uom = $('.pricingReg').text().trim().replace(/^[\S\s]*?(\/.*)/g, '$1')
      }
      if($('.product-title__brand').text()){
        productEntry.brand = $('.product-title__brand').text().trim()
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
