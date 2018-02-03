var request = require('request');
var cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient
var fs = require('fs')

  request(`https://www.homedepot.com/p/Ekena-Millwork-18-in-x-75-in-Exterior-Real-Wood-Sapele-Mahogany-Raised-Panel-Shutters-Pair-Unfinished-RWR18X075UNM/206336868?keyword=1001521568`,  (error, response, html) => {
    $ = cheerio.load(html)
    console.log('dollars', $('.price__dollars').text() || "")
    console.log('cents',$('.price__cents').text() || "")
    console.log('sku',$('#product_store_sku').text() || $('.product_details').toString().replace(/^[\s\S]*?Store SO SKU #<span>(.*?)<\/span>[\s\S]*$/g,"$1").trim())
    console.log('internet',$('#product_internet_number').text() || "")
    console.log('modelno',$('.product_details.modelNo').text().trim().replace(/^.+?# (.*)/g, '$1') || "")
    console.log('brand',$('.product-title__brand').text().trim() || "")
    console.log('title',$('.product-title__title').text().trim() || "")
    console.log('img',$('#mainImage')[0].attribs.src || "")
    console.log('uom',$('.pricingReg').text().trim().replace(/^[\S\s]*?(\/.*)/g, '$1') || "")

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
      if($('#product_store_sku') || $('.product_details')){
        productEntry.sku = $('#product_store_sku').text() || $('.product_details').toString().replace(/^[\s\S]*?Store SO SKU #<span>(.*?)<\/span>[\s\S]*$/g,"$1").trim()
      }
      if($('.pricingReg').text()){
        productEntry.uom = $('.pricingReg').text().trim().replace(/^[\S\s]*?(\/.*)/g, '$1')
      }
      if($('.product-title__brand').text()){
        productEntry.brand = $('.product-title__brand').text().trim()
      }
      productEntry.dateAccessed = new Date()
    }
  })
