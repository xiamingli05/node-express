var express = require('express');
var router = express.Router();
var userModel=require('../db/usersModel');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* 注册页面 */
router.post('/regist',function(req,res,next){
	var {username,password,password2}=req.body;
	
	if(!username || !password || !password2){
		res.redirect('/regist');
		return;
	} 
	
	if(password !== password2){
		res.redirect('/regist');
		return;
	}
	
	userModel.find({username}).then(arr=>{
		if(arr.length>0){
			res.redirect('/regist');
		} else{
			userModel.insertMany({username,password,date:Date.now()}).then(()=>{
				res.redirect('/login');
			}).catch(err=>{
				res.redirect('/regist');
			});
		}
	});
	
});


/* 登录页面 */
router.post('/login',function(req,res,next){
	var {username,password}=req.body;
	
	userModel.find({username,password}).then(arr=>{
		if(arr.length>0){
			// 当用户登录成功，向客户端写入一个cookie
			req.session.isLogin = true;
			req.session.username = username;
			// 跳转至首页
			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	}).catch(err=>{
		res.redirect('/login');
	});
});

// 登录接口
router.post('/login', function(req, res, next) {
  // 取值
  var { username, password } = req.body
  // 查询数据库，有没有这个用户
  userModel.find({username,password}).then(arr=>{
    if(arr.length > 0) {
      // 当用户登录成功，向客户端写入一个cookie
      req.session.isLogin = true
      req.session.username = username
      // 跳转至首页
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  }).catch(err=>{
    res.redirect('/login')
  })
})


// 退出登录
router.get('/logout', function(req, res, next) {
  // 销毁服务器写给客户端的cookie
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
