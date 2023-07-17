import { useState } from "react"

export function PanelDeUsuarios({socket, sala, nombre}) {

  const [listaUsuarios, setListaUsuarios] = useState([])

  socket.on("usuariosConectados", (nombreUsuario) => setListaUsuarios(nombreUsuario))

  const controlButton = () => {
    socket.emit("borrarUsuario", sala)
  }

  return (
    <div className="col-2 border">
      {listaUsuarios.map( (nombreUsuario, index) => <div key={index} className="d-flex fs-5 align-items-center justify-content-between p-2 text-white bg-primary rounded-3 border">{nombreUsuario} { nombreUsuario === nombre ? <button onClick={controlButton} className="btn bg-danger text-white py-1">X</button> : ""} </div>)}
    </div>
  )
}