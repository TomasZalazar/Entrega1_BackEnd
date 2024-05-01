import { Server } from 'socket.io';

const initSocket = (httpServer) => {
    let messages = [];
    const io = new Server(httpServer);

    io.on('connection', client => {
        // client.emit('chatLog', messages);
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

        // client.on('newMessage', data => {
        //     messages.push(data);
        //     console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);

        //     io.emit('messageArrived', data);
        // });
        
        client.on('nuevoProducto', productoNuevo => {
            
            console.log('Nuevo producto recibido:', productoNuevo);
            // Emitir el evento 'nuevoProducto' a todos los clientes conectados
            io.emit('nuevoProducto', productoNuevo);
        });
    });

    return io;
}

export default initSocket;
