"use client"

function createRutaCarpeta(ruta) {
    if (!ruta.startsWith('localexplorer:')) {
        ruta = 'localexplorer:' + ruta.replace('file:///', '');
    }
    return ruta;
}

function Licitacion({ children, licitacion }) {

    function estadoInicialLicitacion({ licitacion }) {
        switch (licitacion.estadoini) {
            case "PRESENTADA":
                return (<span className="rounded-xl bg-[#83f28f] text-black border-2 p-1">{licitacion.estadoini}</span>)

            case "DESESTIMADA":
                return (<span className="rounded-xl bg-[#d3d3d3] text-black border-2 p-1">{licitacion.estadoini}</span>)


            case "EN ESTUDIO":
                return (<span className="rounded-xl bg-[#ADD8E6] text-black border-2 p-1">{licitacion.estadoini}</span>)


            case "ANULADA":
                return (<span className="rounded-xl bg-[#ff474c] text-white border-2 p-1">{licitacion.estadoini}</span>)

            default:
                return null; // Añadido para manejar el caso por defecto
        }
    }

    function estadoFinalLicitacion({ licitacion }) {
        switch (licitacion.estadofinal) {
            case "ADJUDICADA":
                return (<span className="rounded-xl bg-[#83f28f] text-black border-2 p-1">{licitacion.estadofinal}</span>)

            case "ANULADA":
                return (<span className="rounded-xl bg-[#ff474c] text-white border-2 p-1">{licitacion.estadofinal}</span>)

            case "DESESTIMADA":
                return (<span className="rounded-xl bg-[#d3d3d3] text-black border-2 p-1">{licitacion.estadofinal}</span>)

            case "DESIERTA":
                return (<span className="rounded-xl bg-[#cab53f] text-black border-2 p-1">{licitacion.estadofinal}</span>)

            case "EN ESPERA RESOLUCIÓN":
                return (<span className="rounded-xl bg-[#ADD8E6] text-black border-2 p-1">{licitacion.estadofinal}</span>)

            case "NO ADJUDICADA":
                return (<span className="rounded-xl bg-[#ff474c] text-white border-2 p-1">{licitacion.estadofinal}</span>)

            default:
                return null; // Añadido para manejar el caso por defecto
        }
    }

    const dia = licitacion?.fechapresentacion?.getDate()
    const mes = licitacion?.fechapresentacion?.getMonth() + 1
    const anyo = licitacion?.fechapresentacion?.getFullYear()
    const hora = (licitacion?.fechapresentacion?.getHours() < 10 ? '0' : '') + licitacion?.fechapresentacion?.getHours()
    const minuto = (licitacion?.fechapresentacion?.getMinutes() < 10 ? '0' : '') + licitacion?.fechapresentacion?.getMinutes()

    const dia1 = licitacion?.prorroga1?.getDate()
    const mes1 = licitacion?.prorroga1?.getMonth() + 1
    const anyo1 = licitacion?.prorroga1?.getFullYear()
    const hora1 = (licitacion?.prorroga1?.getHours() < 10 ? '0' : '') + licitacion?.prorroga1?.getHours()
    const minuto1 = (licitacion?.prorroga1?.getMinutes() < 10 ? '0' : '') + licitacion?.prorroga1?.getMinutes()

    const dia2 = licitacion?.prorroga2?.getDate()
    const mes2 = licitacion?.prorroga2?.getMonth() + 1
    const anyo2 = licitacion?.prorroga2?.getFullYear()
    const hora2 = (licitacion?.prorroga2?.getHours() < 10 ? '0' : '') + licitacion?.prorroga2?.getHours()
    const minuto2 = (licitacion?.prorroga2?.getMinutes() < 10 ? '0' : '') + licitacion?.prorroga2?.getMinutes()

    const dia3 = licitacion?.prorroga3?.getDate()
    const mes3 = licitacion?.prorroga3?.getMonth() + 1
    const anyo3 = licitacion?.prorroga3?.getFullYear()
    const hora3 = (licitacion?.prorroga3?.getHours() < 10 ? '0' : '') + licitacion?.prorroga3?.getHours()
    const minuto3 = (licitacion?.prorroga3?.getMinutes() < 10 ? '0' : '') + licitacion?.prorroga3?.getMinutes()

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

    const rutacarpeta = createRutaCarpeta(licitacion.rutacarpeta);

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="col-span-4">
                <div style={{ 'border': '1px solid black', 'padding': '20px' }} className="mb-4 rounded-xl flex text-black text-left w-[100%]">
                    {licitacion.estadofinal !== "ADJUDICADA" ? (
                        <>
                            <div className="w-1/3 pr-6 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Detalles del Cliente</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    <p><strong>Cliente: {licitacion.cliente}</strong></p>
                                    <p><strong>Número expediente: {licitacion.numexpediente}</strong></p>
                                    <p>Título: {licitacion.titulo}</p>
                                    {anyo == null ? (
                                        <p>Fecha de presentación no disponible</p>
                                    ) : (
                                        <p>Fecha de presentación: {dia}/{mes}/{anyo} - {hora}:{minuto}h</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 px-6 border-l border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Información del Contrato</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    {licitacion?.tipo == null ? (
                                        <p>Tipo licitación no disponible</p>
                                    ) : (
                                        <p>Tipo: {licitacion?.tipo}</p>
                                    )}
                                    {licitacion?.tipocontrato == null ? (
                                        <p>Tipo de contrato no disponible</p>
                                    ) : (
                                        <p>Tipo de contrato: {licitacion?.tipocontrato}</p>
                                    )}
                                    {licitacion?.importe == null ? (
                                        <p>Importe vacío</p>
                                    ) : (
                                        <p>Importe: {licitacion?.importe?.toString()} €</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 pl-6 border-l border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Responsables</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    <p>Captada por: {licitacion?.captadapor == null || licitacion?.captadapor == '' ? (<span>No disponible</span>) : (<strong>{licitacion.captadapor}</strong>)}</p>
                                    <p>Estudio por: {licitacion?.estudiopor == null || licitacion?.estudiopor == '' ? (<span>No disponible</span>) : (<strong>{licitacion.estudiopor}</strong>)}</p>
                                    <p>Presupuesto por: {licitacion?.presupuestopor == null || licitacion?.presupuestopor == '' ? (<span>No disponible</span>) : (<strong>{licitacion.presupuestopor}</strong>)}</p>
                                    <p>Presentada por: {licitacion?.presentadapor == null || licitacion?.presentadapor == '' ? (<span>No disponible</span>) : (<strong>{licitacion.presentadapor}</strong>)}</p>
                                </div>
                            </div>
                            <div className="w-1/3 pl-6 border-x border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Estado y Archivos</h3>
                                <div className="flex flex-col justify-center items-center flex-grow">
                                    <p className="pb-2">Estado inicial: {estadoInicialLicitacion({ licitacion })}</p>
                                    <p className="pb-2">Estado final: {estadoFinalLicitacion({ licitacion })}</p>
                                    {licitacion.rutacarpeta == null ? (
                                        <div className="border border-gray-400 rounded bg-gray-100 transition duration-500 hover:bg-red-400 w-[80%] h-[50px] flex items-center justify-center text-center">
                                            Ruta de carpeta no disponible
                                        </div>
                                    ) : (
                                        <a href={licitacion.rutacarpeta} target="_blank" rel="noopener noreferrer">
                                            <div className="border border-gray-400 rounded bg-gray-100 cursor-pointer transition duration-500 hover:bg-blue-400 w-[80%] h-[50px] flex items-center justify-center text-center">
                                                Abrir carpeta
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>


                        </>) : (
                        <>
                            <div className="w-1/3 pr-6 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Detalles del Cliente</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    <p><strong>Cliente: {licitacion.cliente}</strong></p>
                                    <p><strong>Número expediente: {licitacion.numexpediente}</strong></p>
                                    <p>Título: {licitacion.titulo}</p>
                                    {licitacion.fechaformalizacion == null ? (
                                        <p>Duración no disponible</p>
                                    ) : (
                                        <p>
                                            Duración de contrato: <br />
                                            {diaformalizacion}/{mesformalizacion}/{anyoformalizacion} - {horaformalizacion}:{minutoformalizacion}h
                                            <br />
                                            {diafinalizacion}/{mesfinalizacion}/{anyofinalizacion} - {horafinalizacion}:{minutofinalizacion}h
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 px-6 border-l border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Información del Contrato</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    {licitacion?.tipo == null ? (
                                        <p>Tipo licitación no disponible</p>
                                    ) : (
                                        <p>Tipo: {licitacion?.tipo}</p>
                                    )}
                                    {licitacion?.tipocontrato == null ? (
                                        <p>Tipo de contrato no disponible</p>
                                    ) : (
                                        <p>Tipo de contrato: {licitacion?.tipocontrato}</p>
                                    )}
                                    {licitacion?.importe == null ? (
                                        <p>Importe vacío</p>
                                    ) : (
                                        <p>Importe: {licitacion?.importe?.toString()} €</p>
                                    )}
                                    {licitacion?.importeanual == null ? (
                                        <p>Importe anual no disponible</p>
                                    ) : (
                                        <p>Importe anual: {licitacion?.importeanual?.toString()} €</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 pl-6 border-l border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Responsables</h3>
                                <div className="flex flex-col justify-center flex-grow">
                                    <p>Responsable: {licitacion?.responsable == null || licitacion?.responsable == '' ? (
                                        <span>No disponible</span>
                                    ) : (
                                        <strong>{licitacion.responsable}</strong>
                                    )}</p>
                                    {licitacion?.fianza == null || licitacion?.fianza == '' ? (
                                        <p>Fianza no disponible</p>
                                    ) : (
                                        <p>Fianza: {licitacion?.fianza} €</p>
                                    )}
                                    {licitacion?.garantia == null || licitacion?.garantia == '' ? (
                                        <p>Garantía no disponible</p>
                                    ) : (
                                        <p>Garantía: {licitacion?.garantia}</p>
                                    )}
                                    {licitacion?.prorrogas == null || licitacion?.prorrogas == '' ? (
                                        <p>No hay prórroga</p>
                                    ) : (
                                        <p>Duración de prórroga: {licitacion?.prorrogas}</p>
                                    )}
                                    {licitacion?.prorroga1 !== null && licitacion?.prorroga1 !== '' && (
                                        <p>Prórroga 1: {dia1}/{mes1}/{anyo1} - {hora1}:{minuto1}h</p>
                                    )}
                                    {licitacion?.prorroga2 !== null && licitacion?.prorroga2 !== '' && (
                                        <p>Prórroga 2: {dia2}/{mes2}/{anyo2} - {hora2}:{minuto2}h</p>
                                    )}
                                    {licitacion?.prorroga3 !== null && licitacion?.prorroga3 !== '' && (
                                        <p>Prórroga 3: {dia3}/{mes3}/{anyo3} - {hora3}:{minuto3}h</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 pl-6 border-x border-gray-200 flex flex-col">
                                <h3 className="font-bold mb-2 text-center">Estado y Archivos</h3>
                                <div className="flex flex-col justify-center items-center flex-grow">
                                    <p className="pb-2">Estado inicial: {estadoInicialLicitacion({ licitacion })}</p>
                                    <p className="pb-2">Estado final: {estadoFinalLicitacion({ licitacion })}</p>
                                    {licitacion.rutacarpeta == null ? (
                                        <div className="border border-gray-400 rounded bg-gray-100 transition duration-500 hover:bg-red-400 w-[80%] h-[50px] flex items-center justify-center text-center">
                                            Ruta de carpeta no disponible
                                        </div>
                                    ) : (
                                        <a href={rutacarpeta} target="_blank">
                                            <div className="border border-gray-400 rounded bg-gray-100 cursor-pointer transition duration-500 hover:bg-blue-400 w-[80%] h-[50px] flex items-center justify-center text-center">
                                                Abrir carpeta
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>

                        </>
                    )}

                    {children}
                </div>
            </div>
        </div>
    )
}

export default Licitacion;
