//06-04-2020 Monday[Practice]
const fs = require('fs');
const http = require('http');
const url = require('url');
const EventEmitter = require('events');
const path = require('path');
const data1 = path.parse('./nodeJs/event.js');
// console.log(data1);
// const event = new EventEmitter();
// event.on('google', (data) => {
//   console.log(data);
// });

// event.emit('google', { name: 'Akash', age: 15 });
// const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
// const info = JSON.parse(data);
// const server = http.createServer((req, res) => {
//   const { query, pathname } = url.parse(req.url, true);
//   if (pathname === '/api') {
//     res.writeHead(200, { 'Content-type': 'application/json' });
//     const readable = fs.createReadStream('./data/data.json');
//     readable.on('data', (chunk) => {
//       res.write(chunk);
//     });

//     readable.on('end', () => {
//       res.end();
//     });

//     readable.on('error', (err) => {
//       console.log(err);
//     });
//   } else {
//     res.writeHead(404, { 'Content-type': 'text/html' });
//     res.end('Page not found');
//   }
// });

// server.listen(5000, 'localhost', () => {
//   console.log('Server is running at port 5000...');
// });
