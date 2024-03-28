var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var todosRouter = require('./routes/todos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// mount middleware into the middleware request 
app.use(function(req, res, next) {
  console.log('Hello SEI!');
  // add a time property to the res.locals object
  // the time property will be accesible when rendering a view 
  req.locals.time  = new Date().toLocaleTimeString();
  next();
});


// login the terminal the http request info 
app.use(logger('dev'));
// process data sent to the body of the requiest if it's json 
app.use(express.json());
// this processes data sent in the 'form' body of the request 
app.use(express.urlencoded({ extended: false }));
// add a cookies property for each cookie sent in the request
app.use(cookieParser());
// if the request is for a static asset, returns the file 
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//first arg is the "starts with" path 
// paths within the route modules are combines to start with paths 
app.use('/', indexRouter);
app.use('/todos', todosRouter);

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
  res.render('error');
});

module.exports = app;