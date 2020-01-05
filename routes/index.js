var express = require('express');
var router = express.Router();
var userModel = require('../db/usersModel.js');
var articleModel = require('../db/articleModel.js');
var moment = require('moment');

/* 首页*/
router.get('/', function(req, res, next) {
  var {page,size}=req.query;
  page=page||1;
  size=size||8;
  
  articleModel.find().count().then(count=>{
	  
	  var total=Math.ceil(count/size);
	  
	  articleModel.find().sort({time:-1}).skip(size*(page-1)).limit(size).then(arr=>{
		  for(var i=0;i<arr.length;i++){
			  arr[i].time2=moment(arr[i].time).format('YYYY-MM-DD HH-mm-ss');
		  }
		  
		  res.render('index',{list:arr,total:total,username:req.session.username});
	  });
	});
});

/* 注册页面 */
router.get('/regist',function(req,res,next){
	res.render('regist',{});
});

/* 登录页面 */
router.get('/login',function(req,res,next){
	res.render('login',{});
});

/* 写文章页面 */
router.get('/write',function(req,res,next){
	
	var { id } =req.query;
	var username=req.session.username;
	
	if(id){
		/*编辑情况下*/ 
		articleModel.find({_id:id}).then(arr=>{
			res.render('write',{article:arr[0],username});
		})
	} else {
		/*新增情况下*/ 
		var article={
			title:'',
			content:''
		}
		res.render('write',{article,username});
	}
	
});



/* 详情页 */
router.get('/detail',function(req,res,next){
	var {id} =req.query;
	articleModel.find({_id:id}).then(arr=>{
		arr[0].time2=moment(arr[0].time).format('YYYY-MM-DD HH-mm-ss');
		res.render('detail',{article:arr[0],username:req.session.username});
	})
});

module.exports = router;
