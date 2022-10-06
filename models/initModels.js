// Models
const { User } = require('../models/user.model');
const { Category } = require('../models/category.model');
const { ProductImg } = require('../models/productImg.model');
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');


const initModels = () => {

  User.hasMany(Order, { foreignKey: 'userId' }),
  Order.belongsTo(User)

  User.hasOne(Cart, { foreignKey: 'userId' })
  Cart.belongsTo(User)

  User.hasMany(Product, { foreignKey: 'userId' }),
  Product.belongsTo(User)

  Cart.hasOne(Order, { foreignKey: 'cartId' })
  Order.belongsTo(Cart)

  Category.hasOne(Product, { foreignKey: 'categoryId' })
  Product.belongsTo(Category)

  Product.hasMany(ProductImg, { foreignKey: 'productId' }),
  ProductImg.belongsTo(Product)

  Product.belongsToMany(Cart, { through: 'productsInCart' })

};

module.exports = { initModels };
