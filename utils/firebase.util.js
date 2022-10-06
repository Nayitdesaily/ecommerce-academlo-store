const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { ProductImg } = require('../models/productImg.model')

const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  appId: process.env.APP_ID
};

const firebaseApp =  initializeApp(firebaseConfig)

const storage = getStorage(firebaseApp)

const uploadProductImgs = async (imgs, productId) => {

  const imagesPromise = imgs.map(async img => {

    const [originalName,ext] = img.originalname.split('.')

    const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`

    const imgRef = ref(storage, filename)

    const result = await uploadBytes(imgRef, img.buffer)

    await ProductImg.create({
      productId,
      imgUrl: result.metadata.fullPath
    })  

  })

  await Promise.all(imagesPromise)
}

const getProductsWithImgsUrl = async products => {

  const productsWithImgPromise = products.map( async product => {

    const productImagePromise = product.productImgs.map( async productImg => {
      
      const imgRef = ref(storage, productImg.imgUrl)
      const productImgUrl = await getDownloadURL(imgRef)

      productImg.imgUrl = productImgUrl

      return productImg
    } )

    const productImages = await Promise.all( productImagePromise )
    product.productImgs = productImages

    return product
  } )

  return await Promise.all(productsWithImgPromise)

}

const getSingleProductWithImgsUrl = async product => {

    const productImagePromise = product.productImgs.map( async productImg => {
      
      const imgRef = ref(storage, productImg.imgUrl)
      const productImgUrl = await getDownloadURL(imgRef)

      productImg.imgUrl = productImgUrl

      return productImg
    } )

    const productImages = await Promise.all( productImagePromise )
    product.productImgs = productImages

    return product
    
}

module.exports = { storage, uploadProductImgs, getProductsWithImgsUrl, getSingleProductWithImgsUrl }