import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js'

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/', viewsRouter);
app.use(express.static(`${__dirname}/public`));

//referencia al servidor
const server = app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


const socketServer = new Server(server);

//Comunicacion Bidireccional

app.use(( req, res, next) => {
    req.io = socketServer;
    next();
})


const messages = [];
 

socketServer.on('connection', (socketClient) => {
    //callback
    console.log('Client connected with id: ', socketClient.id);

    socketServer.emit("log", messages);

    socketClient.on('authenticated', data => {
        // El server lo envia a todos 
        // El socketClient lo envia solo al cliente
        // El socket Broadcast lo envia a todos menos al cliente

        socketClient.broadcast.emit('newUserConnected', data);

    });

    socketClient.on('message', (data) => {

        messages.push(data);

        socketServer.emit("log", messages);

    })

})