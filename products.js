const fs = require('fs').promises;
const path = require('path');

const productFile = path.join(__dirname, './products.json');

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
  get
}
