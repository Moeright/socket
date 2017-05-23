/**
 * Created by hasee on 2017/5/19.
 */
var express = require("express");//使用模板
var app = express();

app.use(express.static("./public"));//使用静态文件

app.get("/",function (req,res) {
    res.send("socket!")//打开根目录的欢迎页面。
});

app.listen(80);//监听80端口
console.log("server run at  port :80");


/*socket server*/
var io = require("socket.io").listen(8080);//使用8080端口的处理数据

var users = {};
var num = 1;

// 使用8080端口处理数据的具体过程
io.on("connection",function (socket) {
    //socket (每个用户的socket都是独立的)
    console.log(socket.client.conn.remoteAddress);//获取用户IP
    var ip = socket.client.conn.remoteAddress;
    // 初始化用户
    // 如果没有这个用户，生成用户id
    if(!users[ip]){
        users[ip]={
            name:"damon"+num++,
            picUrl:"images/1.jpg"
        }
    }
    socket.emit("sendUserInfo",users[ip]);

    //接收消息,广播
    socket.on("message",function (msg) {
        console.log("用户发送的消息："+msg);
        //把接收到的消息，广播个所有人
        socket.broadcast.send({
          msg:msg,
          userInfo:users[ip]
        })
    });

    //监听一个改名的事件，传入参数
    socket.on("rname",function (newName) {
        users[ip].name = newName
    });

    //监听一个头像的事件，传入参数
    socket.on("changepic",function (url) {
        users[ip].picUrl = url;//修改图片id
    })

});
