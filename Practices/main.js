//31-03-2020 Tuesday
const fs = require('fs');
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const EventEmitter = require('events');
// process.env.UV_THREADPOOL_SIZE = 1;
//////////////////////////////
//Sync file read
//////////////////////////////
// const data = fs.readFileSync("info.txt", "utf8");
// console.log(data);
// const toSave = `Google is awesome and also I can remember this '${data}'`;
// fs.writeFileSync("./google.txt", toSave);

///////////////////////////////
//Async file read and write
//////////////////////////////
// fs.readFile("./definations.json", "utf8", (err, data) => {
//   console.log(JSON.parse(data));
// });
// fs.writeFile("./asss.txt", "As the hardhsip of the", "utf8", (err, data) => {
//   console.log(data);
// });

////////////////////////////////////////////
//////Server
//////////////////////////////////////////

// const data = fs.readFileSync(`${__dirname}/definations.json`, "utf-8");
// const info = JSON.parse(data);
//Creating a server and using it
// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/" || pathName === "/overview") {
//     res.end("This is the overview");
//   } else if (pathName === "/api") {
//     res.writeHead(200, { "Content-type": "application/json" });
//     res.end(data);
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-content": "hello-world"
//     });
//     res.end('<h1 style="font-family:Monospace; text-align:center;">Page Not Found</h1>');
//   }
// });
// server.listen(5000, "localhost", () => {
//   console.log("Server started at port 5000");
// });

//Day 2 NodeJs 05-04-2020 Sunday

//Understanding the Process
// setTimeout(() => {
//     console.log('Timer 1');
// }, 0);
// setImmediate(() => {
//     console.log('I am immediate!');
// });

// fs.readFile('txt/append.txt', 'utf-8', () => {
//     console.log('I am file!!');
//     console.log(`---------------------------`);
//     setTimeout(() => {
//         console.log('Second Timer');
//     });
//     setImmediate(() => {
//         console.log('I am immediate!');
//     });
//     process.nextTick(() => {
//         console.log('Process.nextTice');
//     });
//     //Using the crypto to encrypt the password
//     crypto.pbkdf2('password', 'salt', 50000, 1024, 'sha512', () => {
//         console.log('Passowrd encrypted!!');
//     });
//     crypto.pbkdf2('password', 'salt', 50000, 1024, 'sha512', () => {
//         console.log('Passowrd encrypted!!');
//     });
//     crypto.pbkdf2('password', 'salt', 50000, 1024, 'sha512', () => {
//         console.log('Passowrd encrypted!!');
//     });
//     crypto.pbkdf2('password', 'salt', 50000, 1024, 'sha512', () => {
//         console.log('Passowrd encrypted!!');
//     });
// });
// console.log('I am top level!!!');
