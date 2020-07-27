const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const {shopRoutes} = require('./routes/shop');
const {adminRoutes} = require('./routes/admin');

const app = express();

const PORT = process.env.PORT || 3000;
app.engine('hbs',expressHbs({
  layoutsDir:'views/layouts/',
  defaultLayout:'main-layout',
  extname:'hbs'
}));

app.set('view engine','hbs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req,res,next) => {
  // res.status(404).sendFile(path.join(__dirname,'views/404.html'))
  res.status(404).render('404',{
    pageTitle:'Page Not Found!'
  });
})

app.listen(PORT,() => {
  console.log(`server is up on port${PORT}`)
});