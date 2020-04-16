//05-04-2020 Saturday
/*
Streams
    1.We can read and write the data piece by piece without reading the whole data
    2.eg Netflix and Youtube
    3.Processing is done piece by piece
    4.Good for handeling the large mount of data
    5.Makes processing large data easy
    6.Are instances of EventEmitter class ie they can emit and listen named events 

    ///////////
    There are 4 types of streams
    1.Readable
        Streams from which we can read data
        eg http request fs.read stream
        two important events data and end 
        functions
                pipe()=>used for passing data from one stream to other
                read()=>
    2.Writeable
        Opposite to read
        eg http response fs.write
        important events are drain and finish
        function write() and end()
    3.Duplex
        are both readable and writeable at same time
        eg websocket => communication channel between client and server 
    4.Transfrom
        duplex stream can modify and transfrom data as it read or written 
        eg zlib Gzip creation
*/

//[1]
const fs = require('fs');
const server = require('http').createServer(); //A way of creating a server

server.on('request', (req, res) => {
  // Solution 1
  // Not good for loading a large file
  fs.readFile('../txt/info.txt', 'utf-8', (err, data) => {
    if (err) console.log(err);
    res.end(data);
  });

  //Solution 2:Streams
  const readable = fs.createReadStream('../txt/asss.txt');
  //here chunk is the small amoutnt of data
  readable.on('data', (chunk) => {
    //Contuniously sends data to server
    res.write(chunk); //Writing the information to the client
  });
  //Will not work without this
  readable.on('end', () => {
    res.end(); //Signals that the data has been received
  });
  //Error event
  readable.on('error', (err) => {
    console.log(err);
    res.statusCode = 500;
    res.end('File not found');
  });
  //readable stream is much faster than the data send  problem=> back pressure {res not fast as read}
  //Solution for above error

  //Solution 3
  // const readable = fs.createReadStream('asss.txt');
  //readableSource.pipe(writableDestination);
  readable.pipe(res);
  //here res is the destination
});

server.listen(8000, 'localhost', () => {
  console.log(`server started`);
});
