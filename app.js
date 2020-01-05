var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// 引入配置路由文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

require('./db/connect.js');

var app = express();

// view engine setup师徒引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 静态资源配置
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'test1917',
  resave: false,
  saveUninitialized: true,
  cookie: { max: 1000*60*60*48 }
}))

// 登录拦截
app.get('*', function(req, res, next) {
  if (req.url !== '/login' && req.url !== '/regist') {
    if (!req.session.username) {
      // 如果cookie里没有用户名，表示用户未登录，跳转至登录
      res.redirect('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})






// 路由配置
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter);

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
