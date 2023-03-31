const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const request = require('request');
const port = 9800;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
    secret:'SUPERSECRET',
    resave:false,
    saveUninitialized:true
}))

// start passport
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    res.render('login')
})


app.get('/profile',(req,res) => {
  console.log(userprofile)
    request({
      url: 'http://localhost:1234/users',
      method: "POST",
      json: true,   // <--Very important!!!
      body: userprofile
  }, function (error, response, body){
      res.redirect(`http://localhost:3000?site=google&id=${userprofile.id}`)
  });
  
})

app.get('/error',(req,res) => {
    res.send('Error while login')
})


passport.deserializeUser((user, done) => {
    done(null, {
      provider: user.provider,
      id: user.provider_id
    });
});

passport.serializeUser((user,cb)=>{
    cb(null,user)
})

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: "http://localhost:9800/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       userprofile = profile;
       return done(null,userprofile);
  }
));

app.get('/auth/google',
  passport.authenticate('google',{scope:['profile','email']})
)

app.get('/auth/google/callback',
  passport.authenticate('google',{failureRedirect:'/'}),
  function(req,res){
    res.redirect('/profile')
  }
)

app.listen(port,() => {
    console.log(`listening on port ${port}`)
})