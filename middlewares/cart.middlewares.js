const { Cart } = require('../models/cart.model')

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const   cartExist = catchAsync(async (req, res, next) => {
  const { sessionUser } = req

  const cart = await Cart.findOne({ where: {userId: sessionUser.id, status: 'active'} })

  if(cart){
    return(next(new AppError('The owner of the session already have a cart', 403)))
  }

  next()

})


module.exports = { cartExist }

