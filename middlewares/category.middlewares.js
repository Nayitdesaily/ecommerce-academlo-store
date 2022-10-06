const { Category } = require ('../models/category.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const categoryExist = catchAsync(async (req, res, next) => {
  const { id } = req.params 
  
  const category = await Category.findOne({ where: { id } })

  if(!category){
    return next(new AppError('Category do not found', 404))
  }

  req.category = category
  next()
})

module.exports = { categoryExist }