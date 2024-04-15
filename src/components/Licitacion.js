
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
               
        }
    }

    function estadoFinalLicitacion({ licitacion }) {
        switch (licitacion.estadofinal) {
            case "ADJUDICADA":
                return (<span className="rounded-xl bg-[#83f28f] text-black border-2 p-1">{licitacion.estadofinal}</span>)

            case "DESESTIMADA":
                return (<span className="rounded-xl bg-[#d3d3d3] text-black border-2 p-1">{licitacion.estadofinal}</span>)
               

            case "EN ESPERA RESOLUCIÓN":
                return (<span className="rounded-xl bg-[#ADD8E6] text-black border-2 p-1">{licitacion.estadofinal}</span>)
               

            case "NO ADJUDICADA":
                return (<span className="rounded-xl bg-[#ff474c] text-white border-2 p-1">{licitacion.estadofinal}</span>)
               
            default:
               
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="col-span-4">
                <div style={{ 'border': '1px solid black', 'padding': '20px' }} className="mb-4 rounded-xl flex">
                    <div className="w-1/3 pr-8">
                        <p><strong>Cliente: {licitacion.cliente}</strong></p>
                        <p><strong>Número expediente: {licitacion.numexpediente}</strong></p>
                        <p>Título: {licitacion.titulo}</p>
                        <p>Fecha de presentación: {licitacion.fechapresentacion.toString()}</p>
                    </div>
                    <div className="w-1/3 pl-8">
                        <p>Tipo de Contrato: {licitacion.tipocontrato}</p>
                        <p>Tipo: {licitacion.tipo}</p>
                        <p>Importe: {licitacion.importe.toString()} €</p>
                    </div>
                    <div className="w-1/3 pl-8">
                        <p>Captada por: <strong>{licitacion.captadapor}</strong></p>
                        <p>Estudio por: <strong>{licitacion.estudiopor}</strong></p>
                        <p>Presupuesto por: <strong>{licitacion.presupuestopor}</strong></p>
                        <p>Presentada por: <strong>{licitacion.presentadapor}</strong></p>
                    </div>
                    <div className="w-1/3 pl-8 content-center">
                        <p>Estado inicial: {estadoInicialLicitacion({licitacion})}</p>
                        <p>Estado final: {estadoFinalLicitacion({licitacion})}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Licitacion