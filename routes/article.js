var express = require('express');
var router = express.Router();
var articleModel=require('../db/articleModel');
var multiparty= require('multiparty');
var path=require('path');
var fs=require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello article')
  // res.render('index', { title: 'Express' });
});

// 文章新增与编辑
router.post('/write', function(req, res, next) {
  // 接收数据、验证数据
  var { title, content, id } = req.body

  if (!title || !content) {
    // res.json({err:1, msg:'表单不能为空'})
    res.redirect('/write')
    return
  }
  var time = Date.now()
  var author = req.session.username
  if (id) {
    // 修改
    articleModel.updateOne({_id: id}, {title,content,time}).then(()=>{
      res.redirect('/')
    }).catch(err=>{
      res.redirect('/write?id='+id)
    })
  } else {
    // 新增
    articleModel.insertMany([{title, content, author, time}]).then(()=>{
      res.redirect('/')
    }).catch(err=>{
      res.redirect('/write')
    })
  }

})




// 文章删除
router.get('/delete', function(req, res, next) {
  var { id } = req.query
  articleModel.deleteOne({_id:id}).then(()=>{
    res.redirect('/')
  }).catch(err=>{
    res.redirect('/')
  })
})


// 图片上传接口
router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form()
  form.parse(req, function(err,fields, files) {
    if(err) {
      console.log('文件上传失败')
    } else {
      // 获取multiparty插件所解析出来的文件数据
      var img = files.filedata[0]
      console.log('一张图片', img)
      // 创建管道流，把临时路径里的图片，写入静态资源服务器中
      var read = fs.createReadStream(img.path)
      // 使用时间戳，避免文件名重复导致覆盖
      var now = Date.now()
      var uploadPath = path.join(__dirname, '../public/upload/'+now+'-'+img.originalFilename)
      var write = fs.createWriteStream(uploadPath)
      read.pipe(write)

      // 管道流关闭的时候
      write.on('close', function() {
        // 把图片的访问路径，返回xheditor
        res.send({err:0, msg:'/upload/'+now+'-'+img.originalFilename})
      })
    }
  })
})

module.exports = router;
