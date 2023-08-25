import { useState } from "react"

export function PanelDeMensajes({ socket, nombre, sala }) {

  const [listaMensajes, setListaMensajes] = useState([])
  const [mensaje, setMensaje] = useState([])
  const [escribiendo, setEscribiendo] = useState("")

  socket.on("mensajesActualizados", mensaje => setListaMensajes(mensaje))

  const controlMensajeInput = (e) => {
    const value = e.target.value

    if (value !== "") {
      socket.emit("escribiendo", nombre, sala)
    } else {
      socket.emit("escribiendo", "", sala)
    }

    setMensaje(value)
  }

  socket.on("escribiendo", nombre => setEscribiendo(nombre))

  const controlSubmitInput = (e) => {
    e.preventDefault()

    socket.emit("mensaje", mensaje, nombre, sala)
    socket.emit("escribiendo", "", sala)

    setMensaje("")
  }

  return (
    <div className="col-4 h-100 border bg-light rounded-4 ms-5 ">
      <ul className="overflow-auto h-100">
        {listaMensajes.map((mensaje, index) => <li key={index} className={`my-2 p-2 rounded-2 d-block col-6 ${mensaje.nombre === nombre ? 'text-white bg-dark ms-auto' : 'bg-secondary ml-auto'}`}>
          <b>{mensaje.nombre}</b> {mensaje.mensaje}
        </li>)}
      </ul>

      <form onSubmit={controlSubmitInput} className="d-flex flex-column w-100">
          {escribiendo ? <h6 className="ms-2">{escribiendo} esta escribiendo...</h6> : ""}
          <div className="d-flex">
            <input onInput={controlMensajeInput} value={mensaje} className="form-control" placeholder="Mensaje" type="text" />
            <button className="btn btn-success mx-2" type="submit"> > </button>
          </div>
      </form>

    </div>
  )
}