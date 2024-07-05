"use client"
import React, { useState } from 'react';

function formatForInput(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 2);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();   
    
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hours.length < 2)
        hours = '0' + hours;
    if (minutes.length < 2)
        minutes = '0' + minutes;

    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
}

function Form({ action, licitacion, disabled = false, usuario }) {

    const [estadoFinal, setEstadoFinal] = useState(licitacion?.estadofinal || '');

    const handleEstadoFinalChange = (event) => {
        setEstadoFinal(event.target.value);
    };

    return (
        <form action={action}>
            <input type='hidden' name='item' value={licitacion?.item} />
            <input type='hidden' name='captadapor' value={licitacion?.captadapor ? licitacion.captadapor : usuario} />
            <fieldset disabled={disabled}>
                <div className='flex flex-col items-center mb-4 text-black'>
                    <div className='grid grid-cols-2 w-[80vw] items-center justify-center align-middle text-right'>
                        <label htmlFor='responsable' className='mb-2 text-3xl mr-20'>Responsable</label>
                        <input type='text' id='responsable' name='responsable'
                            defaultValue={licitacion?.responsable} className="border p-2 rounded text-center text-xl my-1" required/>

                        <label htmlFor='cliente' className='mb-2 text-3xl mr-20'>Cliente</label>
                        <input type='text' id='cliente' name='cliente'
                            defaultValue={licitacion?.cliente} className="border p-2 rounded text-center text-xl my-1" required/>
    
                        <label htmlFor='titulo' className='mb-2 text-3xl mr-20'>Título</label>
                        <input type='text' id='titulo' name='titulo'
                            defaultValue={licitacion?.titulo} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <label htmlFor='numexpediente' className='mb-2 text-3xl mr-20'>Número de expediente</label>
                        <input type='text' id='numexpediente' name='numexpediente'
                            defaultValue={licitacion?.numexpediente} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <hr className='col-span-2 my-5'/>

                        <label htmlFor='fechapresentacion' className='mb-2 text-3xl mr-20'>Fecha de presentación</label>
                        <input type="datetime-local" id="fechapresentacion" name="fechapresentacion"
                            defaultValue={licitacion?.fechapresentacion ? formatForInput(licitacion.fechapresentacion) : ''} 
                            className="border p-2 rounded text-center text-xl my-1" />
    
                        <label htmlFor='tipo' className='mb-2 text-3xl mr-20'>Tipo</label>
                        <input type='text' id='tipo' name='tipo'
                            defaultValue={licitacion?.tipo} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <label htmlFor='tipocontrato' className='mb-2 text-3xl mr-20'>Tipo de contrato</label>
                        <input type='text' id='tipocontrato' name='tipocontrato'
                            defaultValue={licitacion?.tipocontrato} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <label htmlFor='importe' className='mb-2 text-3xl mr-20'>Importe (sin símbolo de €)</label>
                        <input type='number' id='importe' name='importe' min='0' step={0.01}
                            value={Number(licitacion?.importe)}
                            className="border p-2 rounded text-center text-xl my-1"/>
    
                        <label htmlFor='estudiopor' className='mb-2 text-3xl mr-20'>Estudio por</label>
                        <input type='text' id='estudiopor' name='estudiopor'
                            defaultValue={licitacion?.estudiopor} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <label htmlFor='presupuestopor' className='mb-2 text-3xl mr-20'>Presupuesto por</label>
                        <input type='text' id='presupuestopor' name='presupuestopor'
                            defaultValue={licitacion?.presupuestopor} className="border p-2 rounded text-center text-xl my-1" required />
    
                        <label htmlFor='presentadapor' className='mb-2 text-3xl mr-20'>Presentada por</label>
                        <input type='text' id='presentadapor' name='presentadapor'
                            defaultValue={licitacion?.presentadapor} className="border p-2 rounded text-center text-xl my-1" required />

                        <label htmlFor='observaciones' className='mb-2 text-3xl mr-20'>Observaciones</label>
                        <textarea id='observaciones' name='observaciones'
                            rows="2"
                            cols="50"
                            defaultValue={licitacion?.observaciones}
                            className="border p-2 rounded text-center text-xl my-1" />

<div className='grid grid-cols-3 gap-y-4 w-[80vw]'>
<div className="flex flex-col items-center justify-center">
        <label htmlFor='fianza' className='mb-2 text-3xl'>Fianza</label>
        <input type='number' id='fianza' name='fianza' min='0' step={0.01}
            value={Number(licitacion?.fianza)}
            className="border p-2 rounded text-center text-xl my-1" />
    </div>
    <div className="flex flex-col items-center justify-center">
        <label htmlFor='garantia' className='mb-2 text-3xl'>Garantía</label>
        <input type='text' id='garantia' name='garantia'
            value={licitacion?.garantia}
            className="border p-2 rounded text-center text-xl my-1" />
    </div>
    <div className="flex flex-col items-center justify-center">
        <label htmlFor='importeanual' className='mb-2 text-3xl'>Importe Anual</label>
        <input type='number' id='importeanual' name='importeanual' min='0' step={0.01}
            value={Number(licitacion?.importeanual)}
            className="border p-2 rounded text-center text-xl my-1" />
    </div>
    <div className="flex flex-col items-center justify-center">
        <label htmlFor='fechaformalizacion' className='mb-2 text-3xl'>Fecha de inicio</label>
        <input type="datetime-local" id="fechaformalizacion" name="fechaformalizacion"
            defaultValue={licitacion?.fechaformalizacion ? formatForInput(licitacion.fechaformalizacion) : ''} 
            className="border p-2 rounded text-center text-xl my-1" />
    </div>
    <div className="flex flex-col items-center justify-center">
        <label htmlFor='fechafincontrato' className='mb-2 text-3xl'>Fecha de finalización</label>
        <input type="datetime-local" id="fechafincontrato" name="fechafincontrato"
            defaultValue={licitacion?.fechafincontrato ? formatForInput(licitacion.fechafincontrato) : ''} 
            className="border p-2 rounded text-center text-xl my-1" />
    </div>
</div>




                    </div>
                </div>
            </fieldset>
        </form>
    );
}

export default Form