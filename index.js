var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer');
const path = require('path');

// 实例化一个对象
var app = express();

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(multer().single('images'));

app.get('/upload',function (req,res) {
    // 读取目录
    fs.readdir(`.${req.url}`,function(err,files){
        if(err){
            return console.log(err);
        }
        res.send(`<ul>${files.map(item=>`<li>${item}&nbsp;<a href="download/${item}" rel="external nofollow" >下载文件</a></li>`).join('')}</ul>`);
    });
});

 app.get('/', function (req, res) {
    res.sendFile( path.resolve(__dirname,'index.htm'));
 })
   // 上传文件
 app.post('/file_upload', function (req, res) {
    res.setHeader('content-type', 'text/plain;charset=utf-8');
    console.log('上传文件的信息为：',req.file);  
    // 上传的文件信息,multer解析完上传文件后，会被保存为一个包含path,encoding等字段的对象req.file
  
    var des_file = path.resolve(__dirname,'upload',req.file.originalname);
    // des_file：目的文件地址，即将读取到的文件信息写入到该文件里

    fs.writeFile(des_file, req.file.buffer, function (err) {
        if( err ){
            console.log( err );
        }else{
            response = {
                message:'File uploaded successfully', 
                filename:req.file.originalname
            };
        }
        console.log('response is:', response );
        res.end( JSON.stringify( response ) );
    });

 })

 // 设置download文件夹为静态 才能下载
 app.use('/download', express.static(path.resolve(__dirname, 'download')));

 app.get('/download/:id',function(req,res){
    
    var realPath = path.resolve('./upload/' , req.params.id );
    fs.exists(realPath, function (exists) {
        if (!exists) { //文件不存在
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            // res.sendStatus(404);
            res.send("This request URL " + pathname + " was not found on this server.");
        } else {
            res.download(realPath);
        }
    });
});

//监听当前端口号
// app.listen(3000);
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
   
  })
//写入数据
// function writeFile(fileName) {
//     fs.writeFile(fileName,'我是写入的数据',function(err){
//         if(err){
//             return console.log(err);
//         }
//         console.log('数据写入成功');
//     })
// }
// writeFile('input.txt');