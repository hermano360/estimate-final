var express = require('express')
var bodyParser = require('body-parser')
var sendMail = require('./api/sendMail')
var wordDoc = require('./api/TestWordDoc')
var shoppingList = require('./api/ShoppingList')
const path = require('path')
const MongoClient = require('mongodb').MongoClient

// Create out app

var app = express()
const PORT = process.env.PORT || 8000


app.use(express.static(path.join(__dirname, '/dist')))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "* ");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/generateDocument', function (req, res) {
  wordDoc.generateWord(req.body.total, req.body.quoteInformation, (response) => {
    res.send(response)
  })
})

app.get('/downloadWordDocument', function (req, res) {
  res.download(path.join(__dirname, '/api/ProBuildersEstimate.docx'), 'ProBuildersEstimate.docx')
})

app.post('/pdfEmail', (req, res, next) => {
  sendMail.sendEmail(req.body.dirPath, req.body.name, req.body.email, (message) => res.json(message))
})

app.get('/categories', (req, res) => {
  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', function (err, db) {
    db.collection('proCategories').find({}, { category: 1, products: 1, _id: 0 }).sort({category: 1}).toArray((err, categories) => {
      res.send(categories)

      db.close()
    })
  })
})

app.post('/categoryGroups', (req, res) => {
  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', function (err, db) {
    db.collection('proCategories').find({category: req.body.category}, { products: 1, _id: 0 }).toArray((err, categories) => {
      res.send(categories.map((category) => {
        return category.products
      }).sort())

      db.close()
    })
  })
})

app.get('/products', (req, res) => {

  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', (err, db) => {
    db.collection('proProducts').find({}, { _id: 0, updated: 0, misc: 0, materialCost: 0 }).sort({ keycode: 1 }).toArray((err, products) => {
      res.send(products)
      db.close()
    })
  })
})


app.get('/quotes', (req, res) => {

  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', (err, db) => {
    db.collection('proQuotes').find({}, { _id: 0}).sort({ quoteNumber: 1 }).toArray((err, categories) => {
      res.send(categories)
      db.close()
    })
  })
})

app.post('/quotes', (req, res) => {
  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', (err, db) => {
    db.collection('proQuotes').update({quoteNumber: req.body.quoteNumber }, req.body ,{ upsert: true })
      .then(
        db.collection('proQuotes').find({}, { _id: 0}).sort({ quoteNumber: 1 }).toArray((err, quotes) => {
          res.send(quotes)
          db.close()
        })
      )
      .catch(err=>res.send(err))
      db.close()
  })
})

app.post('/remove-quote', (req, res) => {
  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', (err, db) => {
    db.collection('proQuotes').remove({quoteNumber: req.body.quoteNumber })
      .then(
        db.collection('proQuotes').find({}, { _id: 0}).sort({ quoteNumber: 1 }).toArray((err, quotes) => {
          res.send(quotes)
          db.close()
        })
      )
      .catch(err=>res.send(err))
      db.close()
  })
})

app.post('/products', (req, res) => {
  MongoClient.connect('mongodb://hermano360:f00tball@ds137090.mlab.com:37090/meadowlark', (err, db) => {
    db.collection('proProducts').find({'keycode': {$in: req.body.products}}, { _id: 0 }).toArray((err, products) => {
      res.send(products)
      db.close()
    })
  })
})

app.post('/shopping-list', (req, res) => {
  console.log(req.body)
  shoppingList.generateShoppingList(req.body.total, req.body.shoppingList, req.body.quoteNumber, (response) => {
    res.send(response)
  })
})


if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack')
  const webpackConfig = require('./webpack.config.js')
  app.use(webpackMiddleware(webpack(webpackConfig)))
} else {
  app.use(express.static('dist'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/html'))
  })
}

app.listen(PORT, () => console.log('Express server is listening on ' + PORT))
