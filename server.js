const app = express(); 
const port = 4091 //process.env.PORT || 3010; 
import usersRouter from "./app_server/router/users.js";
import pollsRouter from "./app_server/router/polls.js";
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import session from "express-session";
import cors from 'cors';

import "./app_server/models/db.js"

const corsOptions = {
  // set origin to a specific origin.
  origin: 'http://localhost:4090',
  
  // or, set origin to true to reflect the request origin
  //origin: true,

  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4090"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/polls', pollsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
app.use(session({
  name: "SessionID",
  secret: 'asfgff5678uyghjkljjh', // A secret key used to sign the session ID cookie
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
  cookie: {
    maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
    httpOnly: true, // Reduces client-side script control over the cookie
  }
}));

/* app.use((req, res, next) => {
  if (req.cookies.user_cpoll && !req.session.name) {
      res.clearCookie('user_cpoll');        
  }
  next();
}); */

app.listen(port, () => {
  console.log(`Api up and running at: http://localhost:${port}`);
});