var mongoose = require('mongoose');

// 执行数据库连接
mongoose.connect('mongodb://localhost/test1917', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db =mongoose.connection;
db.on('open', function() {
  console.log('数据库连接成功')
});
db.on('error', function(err) {
  console.log('数据库连接失败')
});