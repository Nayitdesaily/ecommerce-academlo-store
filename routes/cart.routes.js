const express = require('express')

//Controllers
const { createCart, getAllCarts, addProduct, getProductsByCartId, deleteProductByCart, updateCart, purchase } = require('../controllers/cart.controller')

//Middlewares
const { protectSession } = require('../middlewares/auth.middlewares')
const { cartExist } = require('../middlewares/cart.middlewares')

const cartsRouter = express.Router()

cartsRouter.use(protectSession)

  cartsRouter.post('/', cartExist, createCart )
  cartsRouter.get('/', getAllCarts )

  cartsRouter.post('/add-product', addProduct )
  cartsRouter.delete('/:productId', deleteProductByCart )
  cartsRouter.patch('/update-cart', updateCart )
  cartsRouter.post('/purchase', purchase )

  cartsRouter.get('/products-in-cart/:id', getProductsByCartId)


module.exports = { cartsRouter }