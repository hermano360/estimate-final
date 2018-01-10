var request = require('request');
var cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient
var fs = require('fs')

  request(`https://www.homedepot.com/p/Alexandria-Moulding-7-16-in-x-3-1-4-in-x-96-in-Primed-Pine-Finger-Jointed-Base-Moulding-03112-93192C/205576573?MERCH=REC-_-homepagehorizontal1_rr-_-NA-_-205576573-_-N`,  (error, response, html) => {
    $ = cheerio.load(html)
    console.log($('.price__dollars').text() || "")
    console.log($('.price__cents').text() || "")
    console.log($('#product_store_sku').text() || "")
    console.log($('#product_internet_number').text() || "")
    console.log($('.product_details.modelNo').text().trim().replace(/^.+?# (.*)/g, '$1') || "")
    console.log($('.product-title__brand').text().trim() || "")
    console.log($('.product-title__title').text().trim() || "")
    console.log($('#mainImage')[0].attribs.src || "")
    console.log($('.pricingReg').text().trim().replace(/^[\S\s]*?(\/.*)/g, '$1') || "")

    // console.log(response.body, 'herminio',html, 'herminio', cheerio.load(html)('.price__dollars').text())
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
      if($('#product_store_sku')){
        productEntry.sku = $('#product_store_sku').text()
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
