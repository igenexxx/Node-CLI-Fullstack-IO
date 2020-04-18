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

async function createProduct(req, res, next) {
  const product = await Products.create(req.body);
  res.json(product);
}

async function editProduct(req, res, next) {
  // console.log(req.body);
  res.json(req.body);
}

async function deleteProduct(req, res, next) {
  res.json({ success: true });
}

module.exports = autoCatch({
  createProduct,
  listProducts,
  getProduct,
});
