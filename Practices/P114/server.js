const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//CONFIGURING THE DOTENV
dotenv.config({ path: `${__dirname}/../config.env` });
//CONNECTING TO MONGOOSE DATABASE
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connection Established');
  });
//CREATING THE SERVER
app.listen(process.env.PORT, 'localhost', (req, res) => {
  console.log(`Server Running at PORT:${process.env.PORT}`);
});
