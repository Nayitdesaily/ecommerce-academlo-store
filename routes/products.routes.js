const express = require('express')

//Controllers
const { createCategory,getAllCategories, updateCategory } = require('../controllers/category.controller')
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller')

//Middlewares
const { protectSession, protectProductAccount } = require('../middlewares/auth.middlewares')
const { createProductValidators } = require('../middlewares/validators.middlewares')
const {  productExist } = require('../middlewares/product.middlewares')
const {  categoryExist } = require('../middlewares/category.middlewares')

//Utils
const { upload } = require('../utils/multer.util')

const productsRouter = express.Router()

productsRouter.get('/categories', getAllCategories)
productsRouter.get('/', getAllProducts)
productsRouter.get('/:id', productExist, getProductById)


productsRouter.use(protectSession)

productsRouter.post('/categories',createCategory)
productsRouter.patch('/categories/:id', categoryExist, updateCategory )

productsRouter.post('/', upload.array('productImg', 5), createProductValidators, createProduct)

productsRouter.patch('/:id',productExist,protectProductAccount, updateProduct )
productsRouter.delete('/:id',productExist,protectProductAccount, deleteProduct )



module.exports = { productsRouter }