const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: {
    origin: '*'
}});

let salas = {}

// Evento de conexión de un nuevo socket
io.on('connection', (socket) => {
  
    // Evento para crear una nueva sala
    socket.on('crearSala', sala => {
        if (!salas[sala]) {
            salas[sala] = [];
            socket.join(sala);
        }
    });
  
    // Evento para agregar un usuario a una sala
    socket.on('agregarUsuario', (nombre,nombreSala) => {

      if (!salas[nombreSala]["mensajes"]) {
        salas[nombreSala]["mensajes"] = []; // Crea una nueva lista de mensajes si aún no existe
      }

      if (!salas[nombreSala]["usuarios"]) {
        salas[nombreSala]["usuarios"] = []; // Crea una nueva lista de usuarios si aún no existe
      }

      if (salas[nombreSala]["mensajes"].length >= 50) {
        salas[nombreSala]["mensajes"] = []
      }

      const existeUsuario = salas[nombreSala].usuarios.some(usuario => usuario.nombre === nombre)

      if (existeUsuario) {
        // Enviar un mensaje al cliente informando que el nombre de usuario ya está en uso
        socket.emit('usuarioExistente');
        return
      } else {
        // Agregar el usuario a la sala
        const nuevoUsuario = { nombre, socket };
        salas[nombreSala].usuarios.push(nuevoUsuario);

        // Mensaje a enviar
        const mensaje = {nombre, mensaje:`Se ha unido a la sala`}

        // Agregar mensaje de conexion a la lista
        salas[nombreSala].mensajes.push(mensaje)

        // Enviar lista de mensajes actualizados
        io.to(nombreSala).emit("mensajesActualizados", salas[nombreSala].mensajes.map(mensaje => mensaje))

        // Unir al usuario a la sala correspondiente
        socket.join(nombreSala)

        io.to(nombreSala).emit('usuariosConectados', salas[nombreSala].usuarios.map(usuario => usuario.nombre));
      }

      console.log(salas[nombreSala])

      // salas[nombreSala]["usuarios"].push(nombre)

      // io.to(nombreSala).emit('usuariosConectados', salas[nombreSala].usuarios.map(nombre => nombre));

      // salas[nombreSala].mensajes.push(mensaje)

      // io.to(nombreSala).emit("mensajesActualizados", salas[nombreSala].mensajes.map(mensaje => mensaje))

      //---------------------------------------------------------------



      // Verificar si el nombre de usuario ya existe en la sala

      // console.log(salas[nombreSala].usuarios)

      // const usuarios = salas[nombreSala]
      // const existeUsuario = usuarios.some(usuario => usuario.nombre === nombre);
  
      // if (existeUsuario) {
      //   // Enviar un mensaje al cliente informando que el nombre de usuario ya está en uso
      //     // socket.emit('usuarioExistente');
      //     return
      // } else {
      //   // Verificar el límite de 50 usuarios
      //   if (usuarios.length >= 50) {
      //   //   Enviar un mensaje al cliente informando que se ha alcanzado el límite de usuarios
      //       return
      //   } else {
      //   //   Agregar el usuario a la sala
      //     const nuevoUsuario = { nombre, socket };
      //     usuarios.push(nuevoUsuario);
  
      //     // Unir al usuario a la sala correspondiente
      //     socket.join(nombreSala);
  
      //     // Enviar la lista de usuarios actualizada a todos los clientes en la sala
      //     io.to(nombreSala).emit('usuariosConectados', usuarios.map(usuario => usuario.nombre));
      //   }
      // }
    });

  // Envio los mensajes al cliente
    socket.on("mensaje", (mensaje, nombre, sala) => {

      // if (!salas["mensajes"]) {
      //   salas["mensajes"] = []; // Crea una nueva lista de mensajes si aún no existe
      // }

      if (salas[sala]["mensajes"].length >= 50) {
        salas[sala]["mensajes"] = []
      }

      if (mensaje.length > 0) {
        salas[sala].mensajes.push({nombre, mensaje});
      }

      socket.to(sala).emit("mensajesActualizados", salas[sala].mensajes.map(mensaje => mensaje))
    })

    socket.on("escribiendo", (nombre, sala) => {

      socket.to(sala).emit("escribiendo", nombre)

    })

  // Envio un mensaje una vez el usuario se conecta a la sala
    // socket.on("usuarioConectado", (nombre, nombreSala) => {
    // })

    socket.on("borrarUsuario", sala => {

      const usuarioIndex = salas[sala].usuarios.findIndex((usuario) => usuario.socket === socket);
  
      if (usuarioIndex !== -1) {
        const usuarioEliminado = salas[sala].usuarios.splice(usuarioIndex, 1)[0];

        const mensaje = {nombre: usuarioEliminado.nombre, mensaje: `Se ha desconectado de la sala`}

        salas[sala].mensajes.push(mensaje)

        io.to(sala).emit("mensajesActualizados", salas[sala].mensajes.map(mensaje => mensaje))

        io.to(sala).emit('usuariosConectados', salas[sala].usuarios.map((usuario) => usuario.nombre));
      }

      socket.leave(sala)
    })
  
    // Evento de desconexión de un socket
    socket.on('disconnect', () => {
  
    // Eliminar al usuario desconectado de todas las salas
      for (const nombreSala in salas) {
        const sala = salas[nombreSala];
        const usuarioIndex = sala.usuarios.findIndex((usuario) => usuario.socket === socket);
  
        if (usuarioIndex !== -1) {
          const usuarioEliminado = sala.usuarios.splice(usuarioIndex, 1)[0];

          const mensaje = {nombre: usuarioEliminado.nombre,mensaje: `Se ha desconectado de la sala`}

          sala.mensajes.push(mensaje)

          io.to(nombreSala).emit("mensajesActualizados", sala.mensajes.map(mensaje => mensaje))
  
          // Enviar la lista de usuarios actualizada a todos los clientes en la sala
          io.to(nombreSala).emit('usuariosConectados', sala.usuarios.map((usuario) => usuario.nombre));
        }
      }
    });
    
    
})



server.listen(5000, () => {
    console.log('listening on ', 5000);
})