const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/printshop',
  { useNewUrlParser: true, useCreateIndex: true }
).catch(err => console.error(err));

module.exports = mongoose;
