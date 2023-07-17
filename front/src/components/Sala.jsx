import { PanelDeMensajes } from "./PanelDeMensajes";
import { PanelDeUsuarios } from "./PanelDeUsuarios";

export function Sala({socket, nombre, sala}) {
  return (
    <>
        <h4 className="text-center mt-5">Sala</h4>

        <div className="row d-flex justify-content-center h-50 d-flex">
            <PanelDeUsuarios socket={socket} sala={sala} nombre={nombre}/>
            <PanelDeMensajes socket={socket} nombre={nombre} sala={sala}/>
        </div>
    </>
  )
}