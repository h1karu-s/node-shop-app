const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const {shopRoutes} = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');
const { mongoConnect }= require('./util/database');
const User = require('./models/user');


const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next) => {
  User.findById('5f327ddab780b50ec4cdcb0b')
  .then(user => {
    req.user = new User(user.name,user.email,user.cart,user._id.toString()) //user._id is Object !!!! convert string
    next();
  })
  .catch(err => console.log(err));
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT);
});


