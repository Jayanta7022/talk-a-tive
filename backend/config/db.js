const mongoose = require('mongoose');
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    process.exit();
  }
};
module.exports = dbConnect;
