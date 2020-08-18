const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const {shopRoutes} = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();
const store = new MongoDBStore({
  uri:process.env.MONGODB_URL,
  collection:'sessions'
});
const csrfProtection = csrf();


const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views','views');


const storage = multer.diskStorage({
  destination:function(req,file,cb)  {
    cb(null,'images/');
  },
  filename:function(req,file,cb) {
    cb(null, Date.now().toString() + '_' + file.originalname);
  }
});

const fileFilter = (req,file,cb) =>{
  if(file.mimetype === 'image/png'  || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage,fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;  
  res.locals.csrfToken = req.csrfToken(); 
  next(); 
})

app.use((req,res,next) => {
  // throw new Error('dummy')
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    // throw new Error('dummy')
    if(!user){
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
})



app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.get500);

app.use(errorController.get404);


app.use((error,req,res,next) => {

  // res.redirect('/500');
  res.status(500).render('500',{
    pageTitle:'Error!',
    path:'/500',
    isAuthenticated:req.session.isLoggedIn
  });
})




mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('database connecting!')
  app.listen(PORT);
})
.catch(err => console.log(err));

