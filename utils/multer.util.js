const multer = require('multer')
// const path = require('path')

//const storage = multer.diskStorage({
  // destination: (req, file, cb) => {

    // const desPath = path.join(__dirname, '..', 'imgs')

    // cb(null, desPath)
//   },

//   //filename:  (req, file, cb) => {

//     //const [ originalname, ext ] = file.originalname.split('.')
//    // const filename = `${originalname}-${Date.now()}.${ext}`

//     cb(null, filename)
//   }
//})

const storage = multer.memoryStorage()

const upload = multer({ storage })

module.exports = { upload }


