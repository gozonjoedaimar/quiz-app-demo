const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const glob = require('glob');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Include api route files
let globdata = [];
let result = glob.sync('routes/api/**/*.js', { cwd: path.resolve() });

// Define api routes
(function(result) {
  // parse path
  result = result.map( item => ({...path.parse(item), fullpath: item}) );

  // generate route group
  result = result.map( item => ({ ...item, routegroup: path.dirname(item.fullpath.replace('routes/api','')) }) )

  // generate route name
  result = result.map( item => ({ ...item, routename: path.resolve(item.routegroup, item.name) }) )
  
  globdata = result;
  
  // initiate api routes
  globdata.map( info => {
    app.use(`/api${info.routename}`, require('./'+info.fullpath))
  });
})(result);

// console.log(globdata);

// app.use('/debug', function(req, res) {
//   res.send(globdata);
// });

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
  if (req._parsedUrl.pathname.includes('/api/')) {
    res.send(err.message);
  }
  else {
    res.render('error');
  }
});

module.exports = app;
