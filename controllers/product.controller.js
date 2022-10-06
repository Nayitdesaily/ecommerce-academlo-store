const { Product } = require('../models/product.model')
const { ProductImg } = require('../models/productImg.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const { uploadProductImgs, getProductsWithImgsUrl, getSingleProductWithImgsUrl } = require('../utils/firebase.util')

const createProduct = catchAsync(async(req, res) => {

  const { title, description, price, categoryId, quantity } = req.body
  const { sessionUser } = req

  const newProduct = await Product.create({
    title, 
    description, 
    price, 
    categoryId, 
    quantity,
    userId: sessionUser.id
  })

  await uploadProductImgs(req.files, newProduct.id)

  res.status(201).json({
    status: 'success',
    data: { newProduct }
  })

})

const getAllProducts = catchAsync(async(req, res) => {

  const products = await Product.findAll({ 
    where: { status: 'active' }, 
    attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
    include: {
      model: ProductImg , attributes: { exclude : [ 'createdAt', 'updatedAt' ] }
    }})

  const productsWithImgs = await getProductsWithImgsUrl(products)

  res.status(201).json({
  status: 'success',
  data: { products: productsWithImgs }
  })

})

const getProductById = catchAsync(async(req, res) => {

  const { product } = req

  const productWithImg = await getSingleProductWithImgsUrl(product)

  res.status(201).json({
  status: 'success',
  data: { product: productWithImg }
  })

})

const updateProduct = catchAsync(async(req, res) => {
  const { product } = req
  const { title, description, price, quantity } = req.body

  const updatedProduct = await product.update({ title, description, price, quantity })

  res.status(200).json({
    status: 'active',
    data: { updatedProduct }
  })

})

const deleteProduct = catchAsync(async(req, res) => {
  const { product } = req

 product.update({ status: 'disabled' })

  res.status(204).json({
    status: 'active'
  })

})

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct }

