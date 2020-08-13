const express = require("express");
const app = express();
const exposedDir = __dirname + "/public/";
const User = require('./user.js')
User.sync({ alter: true }); //this can be removed after the table is created

//i prefer to use static html in this case instead of 
//a template like pug
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

//session stuff
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const LocalStrategy = require('passport-local').Strategy;

const db = require('./database.js');
const sessionStore = new SequelizeStore({
  db: db,
})
sessionStore.sync() //this can be removed after the table is created
/*
after this is executed first time:
testingpassport=# \dt
           List of relations
 Schema |  Name   | Type  |    Owner
--------+---------+-------+-------------
 public | Session | table | mcastrucci
 public | users   | table | development

*/

/* Passport login methods */

passport.serializeUser((user, done) => {
    done(null, user.email);
})
  
passport.deserializeUser((email, done) => {
    User.findOne({ where: { email: email } }).then((user) => {
        done(null, user);
    });
})

passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (email, password, done) {
        if (!email || !password) {
          done('Email and password required', null)
          return
        }
  
        console.log("going to try auth");
        const user = await User.findOne({ where: { email: email } })
  
        if (!user) {
          done('User not found', null)
          return
        }
  
        const valid = await user.isPasswordValid(password)
  
        if (!valid) {
          done('Email and password do not match', null)
          return
        }
  
        done(null, user)
      }
    )
  )

  

app.use(
    session({
      secret: '343ji43j4n3jn4jk3n', //enter a random string here
      resave: false,
      saveUninitialized: true,
      name: 'testingpassport',
      cookie: {
        secure: false, //CRITICAL on localhost
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      },
      store: sessionStore,
    }),
    passport.initialize(),
    passport.session()
  )

const checkSignedOn = (req, res, next) => {
    console.log(req.method, " ", req.url)
    //if route is /signin, we allow it to continue
    if((req.url === "/login" || req.url === "/signup") || req.url === "/signup/"){ //only if it is a post request
        next();
        return;
    }
    if(!req.session.passport){
        res.redirect("/signup");
        return;
    }
    console.log("next");
    next();
}

app.use(checkSignedOn);

app.get("/", (req, res)=> {
    console.log(req.session.passport);
    res.sendFile(getDir('/index/index.html'));   
})


app.get("/login", (req, res) => {
    res.sendFile(exposedDir + "signin/signin.html");
})

app.get("/signup", (req, res) => {
    res.sendFile(exposedDir + "signup/signup.html");
})

app.post('/login', async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(500).json({error: err})
      if (!user) return res.status(400).json({ message: 'No user matching credentials!' })
  
      req.login(user, (err) => {
        if (err) return res.status(500).json({error: err});
        res.sendFile(getDir('/index/index.html'));  
      })
    })(req, res)
  })

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await User.create({ email: email, password: password });
        req.login(user, (err) => {
            if(err)
                throw ex;
            else
            res.sendFile(getDir('/index/index.html'));  
        });
    } catch (ex) {
        //validation of error messages
        if (ex.errors){
            let error = ex.errors[0];
            if (error) {
                if (error.type === "unique violation")
                    return res.send("user already exists, use login instead of signup");
                else
                    return res.send("user or password invalid"); //TODO what to do here
            } else {
                return res.send("Something failed");//error but no error?
            }
            res.send(ex.details);
        } else {
            res.send("Something failed"); //TODO check what could fail here
        }
       
    }
})

app.get("/logout", (req, res)=> {
    console.log("loging out");
    req.logout();
    req.session.destroy(req => {  
        req.session = "";
        res.redirect("/");
    });
    
})

app.listen(3000, ()=> {
    console.log("server running");
})

//this is a util to return an specific html starting from  the exposed dir
const getDir = path => {
    return exposedDir + path;
}