const { Cart } = require('../models/cart.model')
const { ProductsInCart } = require('../models/productsInCart.model')
const { Product } = require('../models/product.model')
const { Order } = require('../models/order.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')


const createCart = catchAsync(async (req, res) => {

  const { sessionUser } = req

  const newCart = await Cart.create({ userId: sessionUser.id })

  res.status(201).json({
    status: 'active',
    data: { newCart }
  })

})

const getAllCarts = catchAsync(async (req, res) => {

  const carts = await Cart.findAll()

  res.status(201).json({
    status: 'active',
    data: { carts }
  })

})

const getProductsByCartId = catchAsync(async(req, res) => {

  const { id } = req.params

  const productsInCart = await ProductsInCart.findAll({ where: { cartId: id } })

  res.status(200).json({
    status: 'active',
    data: { productsInCart }
  })

})

const deleteProductByCart = catchAsync(async(req, res, next) => {

  const { productId } = req.params
  const { sessionUser } = req

  const cart = await Cart.findOne({ where: {userId: sessionUser.id, status: 'active'} })

  const productInCart = await ProductsInCart.findOne({ where: { cartId:cart.id, productId, status: 'active' } })

  if(!productInCart){
    return next(new AppError('Product does not found in the cart', 404))
  } 

  await productInCart.update ({ status: 'removed', quantity: 0 })

  res.status(204).json({
    status: 'success'
  })

})

const addProduct = catchAsync(async(req, res, next) => {

  const{ productId, quantity } = req.body
  const { sessionUser } = req

  const product = await Product.findOne({ where: { id: productId, status: 'active' } })

  if(!product){
    return next(new AppError('Product do not found', 404))
  } else if(quantity > product.quantity){
    return next(new AppError(`The product only have ${ product.quantity } items`, 400))
  }


  const cart = await Cart.findOne({ where: { userId: sessionUser.id, status: 'active' } })

  if(!cart){
    const newCart = await Cart.create({ userId: sessionUser.id })
    
    await ProductsInCart.create ({ cartId: newCart.id, productId, quantity })
  } else {
    const productInCart = await ProductsInCart.findOne({ where: {cartId: cart.id, productId} })

      if(!productInCart){
        await ProductsInCart.create({ cartId: cart.id, productId, quantity  })

      } else if(productInCart.status === 'active'){
        return next(new AppError('This product is already added in the cart', 400))

      } else if (productInCart.status === 'removed'){
        await productInCart.update({ quantity, status: 'active' }) 
      }
  }
  
  res.status(200).json({
    status: 'success'
  }) 
})

const updateCart = catchAsync(async(req, res, next) => {

  const { productId, newQty } = req.body
  const { sessionUser } = req

  const cart = await Cart.findOne({ where: { userId: sessionUser.id, status: 'active' } })

  if(!cart){
    return next(new AppError('Cart does not found', 404))
  } else {

    const product = await Product.findOne({ where: { id: productId, status: 'active' } }) 
    const productInCart = await ProductsInCart.findOne({ where: { cartId: cart.id, productId} })

    if(!product){
      return next(new AppError('Product does not found', 404))

    } else if (newQty > product.quantity){
      return next(new AppError (`Product only has ${product.quantity} items`, 400))

    } 

    if(!productInCart){
      return next( new AppError('Product does not found in the cart', 404) )

    } else if (newQty === 0){
      await productInCart.update({ quantity: newQty, status: 'removed' })

    } else {
      await productInCart.update({ quantity: newQty, status: 'active' })
    }
  }

  res.status(200).json({
    status: 'success'
  })
})

const purchase = catchAsync(async(req, res, next) => {

  const { sessionUser } = req

  const cart = await Cart.findOne({ where: { userId: sessionUser.id, status: 'active' } })

  const productsInCart = await ProductsInCart.findAll({ where: { cartId: cart.id, status: 'active' } })

  if(!productsInCart){
    return next(new AppError('The cart does not have any product', 400))
  } 

  const productPromise =  productsInCart.map( async productInCart => {

    const product = await Product.findOne({ where: { id: productInCart.productId } })

    await product.update({ quantity: product.quantity - productInCart.quantity })

    await productInCart.update({ status: 'purchased' })

    const totalPriceProduct = productInCart.quantity * product.price

    return totalPriceProduct

    })

  const priceEachProduct = await Promise.all(productPromise)

  const totalPrice = priceEachProduct.reduce( (acc, el) => acc + el )

  await cart.update({ status: 'purchased' })

  const newOrder = await Order.create({ 
    userId: sessionUser.id, 
    cartId: cart.id, 
    totalPrice: totalPrice  })
  
  res.status(201).json({
  status: 'success',
  data: { newOrder }
  })


})

module.exports = { createCart, 
  getAllCarts, 
  addProduct, 
  getProductsByCartId, 
  deleteProductByCart,
  updateCart, 
  purchase }