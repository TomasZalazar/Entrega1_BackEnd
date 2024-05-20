import { Server } from 'socket.io';

const initSocket = (httpServer) => {
    
    const io = new Server(httpServer);

    io.on('connection', client => {
    
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

        client.on('nuevoProducto', (producto) => {
            console.log('Nuevo producto recibido en el servidor:', producto);
            // Realizar acciones con el nuevo producto aquí
        });

        client.on('productoEliminado', (producto) => {
            console.log('Producto eliminado en el servidor:', producto);
            // Realizar acciones con el producto eliminado aquí
            io.emit('productoEliminado',  producto );
        });
    });

    return io;
}

export default initSocket;
