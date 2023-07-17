import React, { useState } from "react"
import { Sala } from "./Sala"

export function Form({socket}) {

    const [nombre, setNombre] = useState("")
    const [nombreSala, setNombreSala] = useState("")
    const [estadoInput, setEstadoInput] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        socket.emit("crearSala", nombreSala)

        socket.emit("agregarUsuario", nombre, nombreSala)

        // socket.emit("usuarioConectado", nombre, nombreSala)

        setEstadoInput(true)
    }

    const controlInputNombre = (e) => {
        const value = e.target.value
        setNombre(value)
    }

    const controlInputNombreSala = (e) => {
        const value = e.target.value
        setNombreSala(value)
    }

  return (
    <>
        <form onSubmit={handleSubmit} className="d-flex flex-column text-center justify-content-center align-items-center mt-5">
            <div className="col-6">
                <label htmlFor="Nombre" className="form-label">Nombre</label>
                <input onChange={controlInputNombre} disabled={estadoInput} value={nombre} id="Nombre" type="text" className="form-control mb-4" required />
            </div>
            <div className="col-6">
                <label htmlFor="NombreSala" className="form-label">Nombre de la sala</label>
                <input onChange={controlInputNombreSala} value={nombreSala} id="NombreSala" type="text" className="form-control mb-4" required />
            </div>
            <button type="submit" className="col-6 btn btn-success">Unirme a la sala</button>
        </form>

        {estadoInput ? <Sala socket={socket} nombre={nombre} sala={nombreSala}/> : ""}
    </>
  )
}
