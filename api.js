const AWS = require('aws-sdk');
const { promisify } = require('util');

const Products = require('./models/products');
const Orders = require('./models/orders');
const Users = require('./models/users');
const autoCatch = require('./lib/auto-catch');

const s3 = new AWS.S3();
s3.uploadP = promisify(s3.upload);

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
  res.json(product);
}

async function createProduct(req, res, next) {
  const product = await Products.create(req.body);
  res.json(product);
}

async function editProduct(req, res, next) {
  const change = req.body;
  const product = await Products.edit(req.params.id, change);

  res.json(req.body);
}

async function deleteProduct(req, res, next) {
  await Products.remove(req.params.id);
  res.json({ success: true });
}

async function createOrder(req, res, next) {
  const order = await Orders.create(req.body);
  res.json(order);
}

async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query;

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status,
  });

  res.json(orders);
}

async function setProductImage(req, res) {
  const productId = req.params.id;

  const ext = {
    'image/png': 'png',
    'image/jpeg': 'jpg'
  }[req.headers['content-type']];

  if (!ext) throw new Error('Invalid Image Type');

  const params = {
    Bucket: 'fullstack-printshop',
    Key: `product-images/${productId}.${ext}`,
    Body: req, // req is a stream, similar to fs.createReadStream
    ACL: 'public-read'
  };

  const object = await s3.uploadP(params); //our custom promise version

  const change = { img: object.Location };
  const product = await Products.edit(productId, change);

  res.json(product);
}

async function createUser(req, res, next) {
  const user = await Users.create(req.body);
  const { username, email } = user;
  res.json({ username, email });
}

module.exports = autoCatch({
  createProduct,
  listProducts,
  getProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  setProductImage,
  createUser
});
