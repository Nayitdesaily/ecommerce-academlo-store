const { Product } = require('../models/product.model')
const { ProductsInCart } = require('../models/productsInCart.model')
const { Cart } = require('../models/cart.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const productExistBeforeAddCart = catchAsync(async(req, res, next) => {
  const { productId } = req.body

  const product = await Product.findOne({ where: { id: productId, status: 'active' } })

  if(!product){
    return(next(new AppError('Product is not available to add cart', 404)))
  }

  req.product = product

  next()
})

const quantityLimitOfProduct = catchAsync(async(req, res, next) => {
  const { quantity } = req.body
  const { product } = req

  if(quantity > product.quantity){
    return next(new AppError('Quantity is not available in the stock of the product', 403))
  }

  next()
})

const productExistInCart = catchAsync(async(req, res, next) => {
  const { product } = req
  const { sessionUser } = req

  const cart = await Cart.findOne({ where: { userId: sessionUser.id, status:'active' } })

  if(!cart){
    return next(new AppError('Cart do not found', 404))
  }

  req.cart = cart

  const registeredProductInCart = await ProductsInCart.findOne({ 
    where: { cartId: cart.id, 
    productId: product.id, status: 'active'}})

  if(registeredProductInCart){
    return next(new AppError('Product is already registered in the cart', 403))
  }
  
  next()

})

const productIdExist = catchAsync(async(req, res, next) => {
  const { productId } = req.params
  const { sessionUser } = req

  const cart = await Cart.findOne({ where: { userId: sessionUser.id, status:'active' } })

  if(!cart){
    return next(new AppError('Cart do not found', 404))
  }

  const productIdExistInTheCart = await ProductsInCart.findOne({ cartId: cart.id, productId: productId })

  if(!productExistInCart){
    return(next(new AppError('Product do not found in the cart')))
  }

  req.productIdInTheCart = productIdExistInTheCart

  next()
})


module.exports = { productExistBeforeAddCart, quantityLimitOfProduct, productExistInCart, productIdExist }