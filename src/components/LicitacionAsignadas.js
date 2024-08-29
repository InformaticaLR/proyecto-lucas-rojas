"use client"
import Link from "next/link"

function Licitacion({ children, licitacion }) {

    const diaformalizacion = licitacion?.fechaformalizacion?.getDate()
    const mesformalizacion = licitacion?.fechaformalizacion?.getMonth() + 1
    const anyoformalizacion = licitacion?.fechaformalizacion?.getFullYear()
    const horaformalizacion = (licitacion?.fechaformalizacion?.getHours() < 10 ? '0' : '') + licitacion?.fechaformalizacion?.getHours()
    const minutoformalizacion = (licitacion?.fechaformalizacion?.getMinutes() < 10 ? '0' : '') + licitacion?.fechaformalizacion?.getMinutes()

    const diafinalizacion = licitacion?.fechafincontrato?.getDate()
    const mesfinalizacion = licitacion?.fechafincontrato?.getMonth() + 1
    const anyofinalizacion = licitacion?.fechafincontrato?.getFullYear()
    const horafinalizacion = (licitacion?.fechafincontrato?.getHours() < 10 ? '0' : '') + licitacion?.fechafincontrato?.getHours()
    const minutofinalizacion = (licitacion?.fechafincontrato?.getMinutes() < 10 ? '0' : '') + licitacion?.fechafincontrato?.getMinutes()

    const rutacarpeta = "file:///" + licitacion.rutacarpeta

    return (
<div className="grid grid-cols-1 gap-4">
    <div className="col-span-1">
        <div style={{ 'border': '1px solid black', 'padding': '20px' }} className="mb-4 rounded-xl flex text-black text-left w-[100%] content-center items-center justify-between">
            <div className="w-64 flex items-left justify-left">
                <p><strong>Cliente:</strong> {licitacion.cliente}</p>
            </div>
            <div className="w-64 pl-8 flex items-center justify-center">
                <p><strong>Número expediente:</strong> {licitacion.numexpediente}</p>
            </div>
            <div className="w-64 pl-8 flex items-center justify-center">
                <p>Responsable: {licitacion?.responsable == null || licitacion?.responsable == '' ? (<span>No disponible</span>):(<strong>{licitacion.responsable}</strong>)}</p>
            </div>
            <div className="w-64 pl-8 flex items-center justify-center">
                {licitacion.fechaformalizacion == null ? (
                    <p>Duración no disponible</p>
                ) : (
                    <p>Duración de contrato: <br />{diaformalizacion}/{mesformalizacion}/{anyoformalizacion} - {horaformalizacion}:{minutoformalizacion}h // {diafinalizacion}/{mesfinalizacion}/{anyofinalizacion} - {horafinalizacion}:{minutofinalizacion}h</p>
                )}
            </div>
            <div className="w-32 pl-8 flex align-right items-right text-center justify-right">
                {licitacion.rutacarpeta == null ? (
                    <div className="border border-black rounded bg-gray-300 cursor-pointer transition duration-500 hover:bg-red-500 w-[100px] h-[80px] flex">
                        Ruta de carpeta no disponible
                    </div>
                ) : (
                    <a href={rutacarpeta} target="_blank" className="flex align-right items-right text-center justify-right">
                        <div className="border border-gray-400 rounded bg-gray-100 cursor-pointer transition duration-500 hover:bg-blue-400 w-[100px] h-[50px] flex items-center justify-center text-center">
                            Abrir carpeta
                        </div>
                    </a>
                )}
            </div>
            {children}
        </div>
    </div>
</div>


    )
}

export default Licitacion;
