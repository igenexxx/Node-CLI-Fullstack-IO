const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }));
}

async function getProduct(req, res, next) {
  const { id } = req.params;

  const product = await Products.get(id);
  if (!product) return next();
}

module.exports = autoCatch({
  listProducts,
  getProduct,
});
