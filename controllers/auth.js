const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {comfirmedEmail,resetEmail} = require('../email/auth');
const {validationResult} = require('express-validator')

exports.getLogin = (req,res) => {
   let message = req.flash('error');
   if(message.length > 0){
     message = message[0];
   }else{
     message = null;
   }
   const isAuthenticated = req.session.isLoggedIn;
    res.render('auth/login',{
      pageTitle:'Login',
      path:'/login',
      errorMessage:message,
      oldInput:{email:'',password:''},
      validationErrors:[]
    })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    oldInput:{email:'',password:'',comfirmPassword:''},
    validationErrors:[]
  });
};


exports.postLogin = (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage:errors.array()[0].msg,
      oldInput:{email,password},
      validationErrors:errors.array()
    });
  }
  User.findOne({email})
  .then(user => {
    if(!user){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:'Invalid email or password!',
        oldInput:{email,password},
        validationErrors:[{param:'email'},{param:'password'}]
      });
    }
    bcrypt.compare(password,user.password)
    .then(doMatch => {
      if(doMatch){
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
        console.log(err);
        res.redirect('/');
       })
      }
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:'Invalid email or password!',
        oldInput:{email,password},
        validationErrors:[{param:'email'},{param:'password'}]
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    })
   })
}


exports.postSignup = (req, res, next) => {
  const {email,password} = req.body;
  const errors = validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage:errors.array()[0].msg,
      oldInput:{email,password,comfirmPassword:req.body.confirmPassword},
      validationErrors:errors.array()
    });

  }
    return bcrypt.hash(password,12)
    .then(hashPassword => {
      const user = new User({
        email,
        password:hashPassword,
        cart:{items:[]}
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      comfirmedEmail(email);
    })
  .catch(err => {
    console.log(err);
  });
};

exports.postLogout = (req,res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/reset',{
    path:'/reset',
    pageTitle:'Reset Password',
    errorMessage:message
  })
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32,(err,buffer) => {
    if(err){
      console.log(err);
      return red.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email})
    .then(user => {
      if(!user){
        req.flash('error','No account with that email found!');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() +3600000;
      user.save();
    })
    .then(result => {
      res.redirect('/');
      resetEmail(req.body.email,token);
    })
    .catch(err => {
      console.log(err);
    })
  })
}


exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
  .then(user => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    }else{
      message = null;
    }
    res.render('auth/new-password',{
      path:'/new-password',
      pageTitle:'New Password',
      errorMessage:message,
      userId:user._id.toString(),
      passwordToken:token
    })
  })
  .catch(err => {
    console.log(err);
  })

}


exports.postNewPassword = (req,res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:userId})
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword,12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => console.log(err));
}
