import https from "https";
import http from 'http';
import path  from 'path';
import fs from "fs";

import app from './app';



/////////////////////////////////////////////////////
///////// mise en place du serveur securisé /////////
/////////////////////////////////////////////////////

const  certificate  = {
    key: fs.readFileSync(path.join(__dirname, '/src/certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/src/certificates', 'cert.pem'))
};
const sslServer = https.createServer( certificate, app);


sslServer.listen (3443, ()=>{
  console.log('Connected to secure server');
});

//////////////////////////////////////////////////////////
/////////// mise en place d'un serveur simple ////////////
//////////////////////////////////////////////////////////
const server = http.createServer(app);

server.listen(3000, ()=>{
  console.log('Connected to simple server');
});
