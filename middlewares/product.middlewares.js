const { Product } = require('../models/product.model')
const { ProductImg } = require('../models/productImg.model')


const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const productExist = catchAsync(async(req, res ,next) => {

  const { id } = req.params
  const product = await Product.findOne({ 
    where: { id, status: 'active' },
    attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
    include: {model: ProductImg , attributes: { exclude : [ 'createdAt', 'updatedAt' ] }}
  })

  if(!product){
    return next(new AppError('Product does not found', 404))
  }

  req.product = product
  next()

})



module.exports = { productExist }