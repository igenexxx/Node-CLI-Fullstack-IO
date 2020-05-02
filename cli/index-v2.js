#!/usr/bin/env node
const yargs = require('yargs');
const Table = require('cli-table');
const ApiClient = require('./api-clients');

yargs
  .option('endpoint', {
    alias: 'e',
    default: 'http://localhost:1337',
    describe: 'The endpoint of the API'
  })
  .command(
    'list products',
    'Get a list of products',
    {
      tag: {
        alias: 't',
        describe: 'Filter results by tag'
      },
      limit: {
        alias: 'l',
        type: 'number',
        default: 25,
        describe: 'Limit the number of results'
      },
      offset: {
        alias: 'o',
        type: 'number',
        default: 0,
        describe: 'Skip number of results'
      }
    },
    listProducts
  )
  .command(
    'view product <id>',
    'View a product',
    {},
    viewProduct
  )
  .command(
    'edit product <id>',
    'Edit a product',
    {
      key: {
        alias: 'k',
        required: true,
        describe: 'Product key to edit'
      },
      value: {
        alias: 'v',
        required: true,
        describe: 'New value for product key'
      },
      username: {
        alias: 'u',
        required: true,
        describe: 'Login username'
      },
      password: {
        alias: 'p',
        required: true,
        describe: 'Login password'
      }
    },
    editProduct,
  )
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .parse();

async function listProducts(opts) {
  const { tag, offset, limit, endpoint } = opts;
  const api = ApiClient({ endpoint });
  const products = await api.listProducts({ tag, offset, limit });

  const cols = process.stdout.columns - 10;
  const colsId = 30;
  const colsProps = Math.floor((cols - colsId) / 3);
  const table = new Table({
    head: ['ID', 'Description', 'Tags', 'User'],
    colWidths: [colsId, colsProps, colsProps, colsProps]
  });

  products.forEach(product => {
    table.push([
      product._id,
      product.description,
      product.userName,
      product.tags.slice(0, 3).join(', ')
    ])
  });

  console.log(table.toString());
}

async function viewProduct(opts) {
  const { id, endpoint } = opts;
  const api = ApiClient({ endpoint });
  const product = await api.getProduct(id);

  const cols = process.stdout.columns - 3;
  const table = new Table({
    colWidths: [15, cols - 15]
  });

  Object.keys(product).forEach(k => table.push({ [k]: JSON.stringify(product[k])}));

  console.log(table.toString());
}

async function editProduct(opts) {
  const { id, key, value, endpoint, username, password } = opts;
  const change = { [key]: value };

  const api = ApiClient({ username, password, endpoint });
  await api.editProduct(id, change);

  await viewProduct({ id, endpoint });
}