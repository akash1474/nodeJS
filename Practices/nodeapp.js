const http = require("http")
const path = require("path")
const fs = require("fs");
var PORT = process.env.PORT || 5000;
// var server=http.createServer((req,res)=>{
//     if(req.url==="/"){
//         fs.readFile(path.join(__dirname,"./public","index.html"),(err,data)=>{
//             if(err) throw err;
//         res.writeHead(200,{"Content-Type":"text/html"});
//         res.write(data);
//         res.end();
//         })
//     }
// });

//Creating an api
// var server=http.createServer((req,res)=>{
//     if(req.url==="/api/physics"){
//         fs.readFile(path.join(__dirname,"./public","definations.json"),(err,data)=>{
//             if(err) throw err;
//         res.writeHead(200,{"Content-Type":"application/json"});
//         res.write(data);
//         res.end();
//         })
//     }
// });

var server = http.createServer((req, res) => {
    if(req.url==="/api/physics"){
                fs.readFile(path.join(__dirname,"./public","definations.json"),(err,data)=>{
                    if(err) throw err;
                res.writeHead(200,{"Content-Type":"application/json"});
                res.write(data);
                res.end();
                })
            }else{
                //Building a file path
    let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
    //Extension of file
    let extname = path.extname(filePath);
    //Initial content-type
    let contentType = "text/html";
    //Check the extension and then set the Content-Type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    //Reading a file
    fs.readFile(filePath,(err,data)=>{
        if(err){
            if(err.code==="ENOENT"){
                fs.readFile(path.join(__dirname,"public","err.html"),"utf8",(err,data)=>{
                    res.writeHead(200,{"Content-Type":"text/html"});
                    res.end(data);
                })
            }else{
                res.writeHead(500);
                res.end(`Server Error:${err.code}`);
            }

        }else{
            //Success
            res.writeHead(200,{"Content-Type":contentType}); 
            res.write(data);
            res.end();       
        }
        
    })
            }
});

server.listen(PORT, (data) => {
    console.log(`Server is running at ${PORT}`);
})