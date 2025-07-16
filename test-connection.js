const mongoose = require('mongoose');

const uri = 'mongodb+srv://codedpool10:9N6ERIXJXYgfdAvO@adalabs-chatbot.lnnjvs2.mongodb.net/?retryWrites=true&w=majority&appName=adalabs-chatbot';

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connection successful');
    const db = mongoose.connection.useDb('adalabs');
    console.log('Database object:', db);
    console.log('Database name:', db.name);
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });