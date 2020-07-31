const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const {shopRoutes} = require('./routes/shop');
const {adminRoutes} = require('./routes/admin');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req,res,next) => {
  // res.status(404).sendFile(path.join(__dirname,'views/404.html'))
  res.status(404).render('404',{
    pageTitle:'Page Not Found!',
    path:'not found'
  });
})

app.listen(PORT,() => {
  console.log(`server is up on port${PORT}`)
});