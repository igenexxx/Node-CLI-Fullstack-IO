const cuid = require('cuid');

const db = require('./db');
const { productsMapper } = require('./utils/products-mapper');

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: String,
  imgThumb: String,
  img: String,
  link: String,
  userId: String,
  userName: String,
  userLink: String,
  tags: { type: [String], index: true }
});

async function create(fields) {
  return await new Product(productsMapper(fields)).save();
}

async function list(opts = {}) {
  const { offset = 0, limit = 25, tag } = opts;
  try {
    const data = await fs.readFile(productFile);
    const result = JSON.parse(data.toString())
      .slice(offset, offset + limit);

    return tag ? result.filter(product => product.includes(tag)) : result;
  } catch (e) {
    throw new Error(`${__filename}: ${e.message}`);
  }
}

async function get(id) {
  try {
    const data = await fs.readFile(productFile);
    return JSON.parse(data.toString()).find(({ id: productId }) => productId === id) || null;
  } catch (e) {
    throw new Error(`Error while getting product: ${ e.message }`);
  }
}

module.exports = {
  list,
  get,
  create
}
