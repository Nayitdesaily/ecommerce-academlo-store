const { Category } = require('../models/category.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const createCategory = catchAsync(async(req, res) => {
  const { name } = req.body

  const newCategory = await Category.create({ name })

  res.status(201).json({
    status: 'success',
    data: { newCategory }
  })
})

const getAllCategories = catchAsync(async(req, res) => {

  const categories = await Category.findAll({where: { status: 'active' } })

  res.status(201).json({
    status: 'success',
    data: { categories }
  })
})

const updateCategory = catchAsync(async(req, res) => {

  const { category } = req
  const { name } = req.body

  await category.update({ name })

  res.status(201).json({
    status: 'success',
    data: { category }
  })
})



module.exports = { createCategory, getAllCategories, updateCategory }