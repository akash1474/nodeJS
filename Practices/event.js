//05-04-2020 Saturday
//Working with events
const http = require('http');

//[1]
//Used for emitting a named event
const EventEmitter = require('events');

//[6]
//Here we can also say that the Sales inherites all the information from the EventEmitter Class
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
//[7]
const myNew = new Sales();
myNew.on('newerSale', (data) => {
  console.log(`new saleer ${data}`);
});
myNew.emit('newerSale', 'Akash');

//[2]
//Creating an instance of a class
const myEmitter = new EventEmitter();

//[4]
//Both below are the observers that listen for the events
myEmitter.on('newSale', () => {
  console.log('There is a new Sale!!!'); //Listents for the event
});
myEmitter.on('newSale', () => {
  console.log('Customer name Akash'); //Listents for the event
});
//[5]
//Thsi is how the "9" is used as the parameter
myEmitter.on('newSale', (data) => {
  console.log(`We have ${data} items left in stock!!!`);
});

//[3]
//here 'new Sale' is the event that is emitted which is then listened by the myEmitter.on();
myEmitter.emit('newSale', 9); //Emmits the event
//Here "9" is passes as an information to the events which we can pass in the call back fn

//[8]
//Listening the events that the server emits
const server = http.createServer();
server.on('request', (req, res) => {
  console.log('Request received');
  console.log(req.url);
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request');
});

server.on('close', () => {
  console.log('Server Ended');
});

server.listen(8000, 'localhost', () => {
  console.log('Server is running');
});
