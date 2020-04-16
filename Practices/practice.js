var path = require("path");
var fs = require("fs");
// var person=require("./user");
// console.log(person);

// //Base file name
// console.log(path.basename(__filename));

// //Directory
// console.log(path.dirname(__filename));

//creating a folder
// fs.mkdir(path.join(__dirname,"./google"),{},err=>console.log("Your folder was created!!!"));


// //file Extension
// console.log(path.extname(__filename));

// //create path object
// console.log(path.parse(__filename));

// //concatename path
// console.log(path.join(__dirname,"test","index.html"));

//Working with files

// create folder
// fs.mkdir(path.join(__dirname, '/test'), {}, err => {
//     if (err) throw err;
//     console.log("folder was created...");
// })

// //create a file and write
// fs.appendFile(path.join(__dirname, "./test", "hello.json"),`[{"name":"Akash", "age":12}]`, err => {
//     if (err) throw err;
//     console.log("file was created...");
// })

const os=require("os");
// console.log(os.cpus());
// os.platform();
// os.arch();
// os.freemem();
// os.totalmem();
// os.homedir();
// os.uptime();


// fs.readFile(path.join(__dirname,"./test","hello.json"),"utf8",(err,data)=>{
//     console.log(JSON.parse(data));
// })

// fs.rename(
//     path.join(__dirname,"./test","hello.txt"),
//     path.join(__dirname,"./test","main.txt"),
//     err=>{console.log("Your file was renamed!!!!")}
// )


const url=require("url");
var Url=new URL("https://www.ak1474p.freetzi.com/moviesDatabase?name=akash&surname=pandit");

// Url.host
// www.ak1474p.freetzi.com

Url.searchParams.append("websitName","freetzi");

var data=Url.searchParams;
// URLSearchParams { 'name' => 'akash', 'surname' => 'pandit', 'websitName' => 'freetzi' }

// Working with http
const http=require("http");
// console.log(http);

//Creating a server !!!
http.createServer((req,res)=>{
    res.write("Hello I am listening!!");
    res.end();
}).listen(5000,(port)=>console.log(`Server Running`));