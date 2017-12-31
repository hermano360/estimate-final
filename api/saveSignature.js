const path = require('path')
const fs = require('fs')




const save = (image, cb) => {
  fs.writeFileSync(path.resolve(__dirname, 'test.png'), image, 'base64', function(e) {
    res.send(e)
  })
  cb('success')
}


module.exports = {
  save: save
}
