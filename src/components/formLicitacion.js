"use client"
import Button from '@/components/button-form'
import React, { useState, useEffect } from 'react';

function formatForInput(dateString) {
    const date = new Date(dateString);
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

function Form({ action, title, licitacion, disabled = false, onClick, usuario }) {

    const [estadoFinal, setEstadoFinal] = useState(licitacion?.estadofinal || '');
    const [tipo, setTipo] = useState(licitacion?.tipo || '');
    const [importe, setImporte] = useState(Number(licitacion?.importe) || 0);
    const [estadoini, setEstadoIni] = useState(licitacion?.estadoini || '');
    const [estadofinal1, setEstadoFinal1] = useState(licitacion?.estadofinal || '');
    const [presentadapor, setPresentadapor] = useState(licitacion?.presentadapor || "");
    const [estadoini1, setEstadoini1] = useState(licitacion?.estadoini || "");

    useEffect(() => {
        if (presentadapor !== "") {
          setEstadoini1("PRESENTADA");
        }
      }, [presentadapor]);
    
      const handlePresentadaporChange = (e) => {
        setPresentadapor(e.target.value);
      };
    
      const handleEstadoIniChange1 = (e) => {
        setEstadoIni(e.target.value);
      };

    useEffect(() => {
        if (tipo === 'ACUERDO MARCO') {
            setImporte(0);
        }
    }, [tipo]);

    const handleTipoChange = (event) => {
        setTipo(event.target.value);
    };

    const handleImporteChange = (event) => {
        setImporte(event.target.value);
    };

    const handleEstadoFinalChange = (event) => {
        setEstadoFinal(event.target.value);
    };

    useEffect(() => {
        if (estadoini === 'DESESTIMADA') {
            setEstadoFinal('DESESTIMADA');
        }
    }, [estadoini]);

    const handleEstadoIniChange = (event) => {
        setEstadoIni(event.target.value);
    };

    const handleEstadoFinalChange1 = (event) => {
        setEstadoFinal(event.target.value);
    };


    return (

        <form action={action} className='mb-[25px]'>

            <input type='hidden' name='item' value={licitacion?.item} />
            <input type='hidden' name='captadapor' value={licitacion?.captadapor ? licitacion.captadapor : usuario} defaultValue={licitacion?.captadapor}/>            
            <fieldset disabled={disabled}>
                <div className='flex flex-col items-center mb-4 text-black'>
                    <div className='grid grid-cols-2 w-[80vw] items-center justify-center align-middle text-right'>
                        <label htmlFor='cliente' className='mb-2 text-3xl mr-20'>Cliente</label>
                        <input type='text' id='cliente' name='cliente'
                            defaultValue={licitacion?.cliente} className="border p-2 rounded text-center text-xl my-1" required/>

                        <label htmlFor='titulo' className='mb-2 text-3xl mr-20'>Título</label>
                        <input type='text' id='titulo' name='titulo'
                            defaultValue={licitacion?.titulo} className="border p-2 rounded text-center text-xl my-1" required />

                        <label htmlFor='numexpediente' className='mb-2 text-3xl mr-20'>Número de expediente</label>
                        <input type='text' id='numexpediente' name='numexpediente'
                            defaultValue={licitacion?.numexpediente} className="border p-2 rounded text-center text-xl my-1" required />

                        {disabled ? (
                            <>
                                <label htmlFor='fechapresentacion' className='mb-2 text-3xl mr-20'>fechapresentacion</label>
                                <input type='hidden' id='fechapresentacion' name='fechapresentacion'
                                    value={licitacion?.fechapresentacion} className="border p-2 rounded text-center text-xl my-1" disabled />
                                <input type='text' id='fechapresentacionmostrada' name='fechapresentacionmostrada'
                                    value={`${licitacion?.fechapresentacion?.getDay()}/${licitacion?.fechapresentacion?.getMonth()}/${licitacion?.fechapresentacion?.getFullYear()} ${licitacion?.fechapresentacion?.getHours()}:${licitacion.fechapresentacion?.getMinutes()}`} className="border p-2 rounded text-center text-xl my-1" disabled />
                                <select id='fechapresentacion' name='fechapresentacion' className="border p-2 rounded text-center text-xl my-1" hidden>
                                    <option value={licitacion?.fechapresentacion}></option>
                                </select>
                            </>
                        ) : (<>
                            <label htmlFor='fechapresentacion' className='mb-2 text-3xl mr-20'>Fecha de presentación</label>
                            <input type="datetime-local" id="fechapresentacion" name="fechapresentacion"
                                defaultValue={licitacion?.fechapresentacion ? formatForInput(licitacion.fechapresentacion) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />
                        </>)}
                        {disabled ? (
                            <>
                                <label htmlFor='tipo' className='mb-2 text-3xl mr-20'>Tipo</label>
                                <select id='tipo' name='tipo' className="border p-2 rounded text-center text-xl my-1" value={tipo} onChange={handleTipoChange}>
                                    {licitacion?.tipo == '' && licitacion?.tipo == null && (
                                        <option value={licitacion?.tipo}>{licitacion?.tipo}</option>
                                    )}
                                    <option value="LICITACION">Licitación</option>
                                    <option value="CONTRATO MENOR">Contrato menor</option>
                                    <option value="ACUERDO MARCO">Acuerdo marco</option>
                                    <option value="LIC NO PUBLICA">Licitación no pública</option>
                                    <option value="INVITACION">Invitación</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='tipo' className='mb-2 text-3xl mr-20'>Tipo</label>
                                <select id='tipo' name='tipo' className="border p-2 rounded text-center text-xl my-1" value={tipo} onChange={handleTipoChange}>
                                    {licitacion?.tipo && (
                                        <option value={licitacion?.tipo}>{licitacion?.tipo}</option>
                                    )}
                                    <option value="LICITACION">Licitación</option>
                                    <option value="CONTRATO MENOR">Contrato menor</option>
                                    <option value="ACUERDO MARCO">Acuerdo marco</option>
                                    <option value="LIC NO PUBLICA">Licitación no pública</option>
                                    <option value="INVITACION">Invitación</option>
                                </select>
                            </>
                        )}

                        {disabled ? (
                            <>
                                <label htmlFor='tipocontrato' className='mb-2 text-3xl mr-20'>Tipo de contrato</label>
                                <select id='tipocontrato' name='tipocontrato' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.tipocontrato !== '' && (
                                        <option value={licitacion?.tipocontrato}>{licitacion?.tipocontrato}</option>
                                    )}
                                    <option value="MAT OFICINA">Material de oficina</option>
                                    <option value="MAQ OFICINA">Maquinaria de oficina</option>
                                    <option value="INFORMÁTICA">Informática</option>
                                    <option value="EPI'S">EPIs</option>
                                    <option value="MOBILIARIO">Mobiliario</option>
                                    <option value="ROPA LABORAL">Ropa laboral</option>
                                    <option value="JUEGOS">Juegos</option>
                                    <option value="LIMPIEZA">Limpieza</option>
                                    <option value="SSGG">SSGG</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='tipocontrato' className='mb-2 text-3xl mr-20'>Tipo de contrato</label>
                                <select id='tipocontrato' name='tipocontrato' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.tipocontrato && (
                                        <option value={licitacion?.tipocontrato}>{licitacion?.tipocontrato}</option>
                                    )}
                                    <option value="MAT OFICINA">Material de oficina</option>
                                    <option value="MAQ OFICINA">Maquinaria de oficina</option>
                                    <option value="INFORMÁTICA">Informática</option>
                                    <option value="EPI'S">EPIs</option>
                                    <option value="MOBILIARIO">Mobiliario</option>
                                    <option value="ROPA LABORAL">Ropa laboral</option>
                                    <option value="JUEGOS">Juegos</option>
                                    <option value="LIMPIEZA">Limpieza</option>
                                    <option value="SSGG">SSGG</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                            </>
                        )}

                        <label htmlFor='importe' className='mb-2 text-3xl mr-20'>Importe (sin símbolo de €)</label>
                        <input type='number' id='importe' name='importe' min='0' step={0.01}
                            defaultValue={Number(licitacion?.importe)}
                            onChange={handleImporteChange} disabled={tipo.value === 'ACUERDO MARCO'}
                            className="border p-2 rounded text-center text-xl my-1"
                            pattern='/^\d*\.?\,?\d*$/' />

                        {!licitacion?.estudiopor == '' || disabled ? (
                            <>
                                <label htmlFor='estudiopor' className='mb-2 text-3xl mr-20'>Estudio por</label>
                                <select id='estudiopor' name='estudiopor' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.estudiopor !== '' && (
                                        <option value={licitacion?.estudiopor}>{licitacion?.estudiopor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='estudiopor' className='mb-2 text-3xl mr-20'>Estudio por</label>
                                <select id='estudiopor' name='estudiopor' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.estudiopor && (
                                        <option value={licitacion?.estudiopor}>{licitacion?.estudiopor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        )}

                        {!licitacion?.presupuestopor == '' || disabled ? (
                            <>
                                <label htmlFor='presupuestopor' className='mb-2 text-3xl mr-20'>Presupuesto por</label>
                                <select id='presupuestopor' name='presupuestopor' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.presupuestopor !== '' && (
                                        <option value={licitacion?.presupuestopor}>{licitacion?.presupuestopor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='presupuestopor' className='mb-2 text-3xl mr-20'>Presupuesto por</label>
                                <select id='presupuestopor' name='presupuestopor' className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.presupuestopor && (
                                        <option value={licitacion?.presupuestopor}>{licitacion?.presupuestopor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        )}

                        {!licitacion?.presentadapor == '' || disabled ? (
                            <>
                                <label htmlFor='presentadapor' className='mb-2 text-3xl mr-20'>Presentada por</label>
                                <select id='presentadapor' name='presentadapor' onChange={handlePresentadaporChange} className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.presentadapor !== '' && (
                                        <option value={licitacion?.presentadapor}>{licitacion?.presentadapor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='presentadapor' className='mb-2 text-3xl mr-20'>Presentada por</label>
                                <select id='presentadapor' name='presentadapor' onChange={handlePresentadaporChange} className="border p-2 rounded text-center text-xl my-1">
                                    {licitacion?.presentadapor && (
                                        <option value={licitacion?.presentadapor}>{licitacion?.presentadapor}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="PILAR MARÍN">Pilar Marín</option>
                                    <option value="SERGIO ORTEGA">Sergio Ortega</option>
                                    <option value="JOSÉ M QUERO">José M Quero</option>
                                    <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                    <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                    <option value="MIGUEL JURADO">Miguel Jurado</option>
                                    <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                    <option value="SARA REYES">Sara Reyes</option>
                                    <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                </select>
                            </>
                        )}

                        {disabled ? (
                            <>
                                <label htmlFor='estadoini' className='mb-2 text-3xl mr-20'>Estado inicial</label>
                                <select id='estadoini' name='estadoini' className="my-1 border p-2 rounded text-center text-xl" value={estadoini} onChange={handleEstadoIniChange && handleEstadoIniChange1}>
                                    {licitacion?.estadoini !== '' && (
                                        <option value={licitacion?.estadoini}>{licitacion?.estadoini}</option>
                                    )}
                                    <option value="EN ESTUDIO">En estudio</option>
                                    <option value="PRESENTADA">Presentada</option>
                                    <option value="ANULADA">Anulada</option>
                                    <option value="DESESTIMADA">Desestimada</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='estadoini' className='mb-2 text-3xl mr-20'>Estado inicial</label>
                                <select id='estadoini' name='estadoini' className="my-1 border p-2 rounded text-center text-xl" value={estadoini} onChange={handleEstadoIniChange && handleEstadoIniChange1}>
                                    {licitacion?.estadoini && (
                                        <option value={licitacion?.estadoini}>{licitacion?.estadoini}</option>
                                    )}
                                    <option value="EN ESTUDIO">En estudio</option>
                                    <option value="PRESENTADA">Presentada</option>
                                    <option value="ANULADA">Anulada</option>
                                    <option value="DESESTIMADA">Desestimada</option>
                                </select>
                            </>
                        )}

                        {disabled ? (
                            <>
                                <label htmlFor='estadofinal' className='mb-2 text-3xl mr-20'>Estado final</label>
                                <select id='estadofinal' name='estadofinal' onChange={handleEstadoFinalChange && handleEstadoFinalChange1} className="my-1 border p-2 rounded text-center text-xl" disabled={estadoini === 'DESESTIMADA' || disabled}>
                                    {licitacion?.estadofinal !== '' && (
                                        <option value={licitacion?.estadofinal}>{licitacion?.estadofinal}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="EN ESPERA RESOLUCIÓN">En espera resolución</option>
                                    <option value="ADJUDICADA">Adjudicada</option>
                                    <option value="ANULADA">Anulada</option>
                                    <option value="DESESTIMADA">Desestimada</option>
                                    <option value="DESIERTA">Desierta</option>
                                    <option value="NO ADJUDICADA">No adjudicada</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor='estadofinal' className='mb-2 text-3xl mr-20'>Estado final</label>
                                <select id='estadofinal' name='estadofinal' onChange={handleEstadoFinalChange && handleEstadoFinalChange1} className="my-1 border p-2 rounded text-center text-xl" value={estadoFinal} disabled={estadoini === 'DESESTIMADA' || disabled}>
                                    {licitacion?.estadofinal && (
                                        <option value={licitacion?.estadofinal}>{licitacion?.estadofinal}</option>
                                    )}
                                    <option value="">En blanco</option>
                                    <option value="EN ESPERA RESOLUCIÓN">En espera resolución</option>
                                    <option value="ADJUDICADA">Adjudicada</option>
                                    <option value="ANULADA">Anulada</option>
                                    <option value="DESESTIMADA">Desestimada</option>
                                    <option value="DESIERTA">Desierta</option>
                                    <option value="NO ADJUDICADA">No adjudicada</option>
                                </select>
                            </>
                        )}

                        <label htmlFor='duracioncontratoanyo' className='mb-2 text-3xl mr-20'>Duración de contrato</label>
                        <input type='text' id='duracioncontratoanyo' name='duracioncontratoanyo'
                            defaultValue={licitacion?.duracioncontratoanyo}
                            className="border p-2 rounded text-center text-xl my-1" />

                        <label htmlFor='rutacarpeta' className='mb-2 text-3xl mr-20'>Ruta de la carpeta</label>
                        <input type='text' id='rutacarpeta' name='rutacarpeta'
                            defaultValue={licitacion?.rutacarpeta} className="border p-2 rounded text-center text-xl my-1"/>

                        <label htmlFor='observaciones' className='mb-2 text-3xl mr-20'>Observaciones</label>
                        <textarea id='observaciones' name='observaciones'
                            rows="2"
                            cols="50"
                            defaultValue={licitacion?.observaciones}
                            className="border p-2 rounded text-center text-xl my-1" />
                        
                        {estadoFinal === 'ADJUDICADA' && (
                            <>
                            <label htmlFor='responsable' className='mb-2 text-3xl mr-20'>Resposable</label>
                            <select id='responsable' name='responsable' className="border p-2 rounded text-center text-xl my-1" required>
                                {licitacion?.responsable && (
                                    <option value={licitacion?.responsable}>{licitacion?.responsable}</option>
                                )}
                                <option value="SILVIA ALCAIDE">Silvia Alcaide</option>
                                <option value="JOSÉ M QUERO">José M Quero</option>
                                <option value="JUAN G. MARTÍNEZ">Juan G. Martínez</option>
                                <option value="MARÍA JOSÉ FERNÁNDEZ">María José Fernández</option>
                                <option value="MIGUEL JURADO">Miguel Jurado</option>
                                <option value="ELENA ALCAIDE">Elena Alcaide</option>
                                <option value="SARA REYES">Sara Reyes</option>
                            </select>
                            
                            <label htmlFor='importeanual' className='mb-2 text-3xl mr-20'>Importe Anual (sin símbolo de €)</label>
                            <input type='number' id='importeanual' name='importeanual' min='0' step={0.01}
                                defaultValue={Number(licitacion?.importeanual)}
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='/^\d*\.?\,?\d*$/' />

                            <label htmlFor='fechaformalizacion' className='mb-2 text-3xl mr-20'>Fecha de inicio de contrato</label>
                            <input type="datetime-local" id="fechaformalizacion" name="fechaformalizacion"
                                defaultValue={licitacion?.fechaformalizacion ? formatForInput(licitacion.fechaformalizacion) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />

                            <label htmlFor='fechafincontrato' className='mb-2 text-3xl mr-20'>Fecha de fin de contrato</label>
                            <input type="datetime-local" id="fechafincontrato" name="fechafincontrato"
                                defaultValue={licitacion?.fechafincontrato ? formatForInput(licitacion.fechafincontrato) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />

                            <label htmlFor='prorrogas' className='mb-2 text-3xl mr-20'>Prórrogas</label>
                            <input type='text' id='prorrogas' name='prorrogas'
                                defaultValue={licitacion?.prorrogas} className="border p-2 rounded text-center text-xl my-1"/>
                            
                            <label htmlFor='prorroga1' className='mb-2 text-3xl mr-20'>Prórroga 1</label>
                            <input type="datetime-local" id="prorroga1" name="prorroga1"
                                defaultValue={licitacion?.prorroga1 ? formatForInput(licitacion.prorroga1) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />
                           
                           <label htmlFor='prorroga2' className='mb-2 text-3xl mr-20'>Prórroga 2</label>
                            <input type="datetime-local" id="prorroga2" name="prorroga2"
                                defaultValue={licitacion?.prorroga2 ? formatForInput(licitacion.prorroga2) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />
                           
                           <label htmlFor='prorroga3' className='mb-2 text-3xl mr-20'>Prórroga 3</label>
                            <input type="datetime-local" id="prorroga3" name="prorroga3"
                                defaultValue={licitacion?.prorroga3 ? formatForInput(licitacion.prorroga3) : ''} // Se muestra el valor existente si existe
                                className="border p-2 rounded text-center text-xl my-1"
                                pattern='^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$' />
                           
                           <label htmlFor='fianza' className='mb-2 text-3xl mr-20'>Fianza (sin símbolo de €)</label>
                                <input type='number' id='fianza' name='fianza' min='0' step={0.01}
                                    defaultValue={Number(licitacion?.fianza)}
                                    className="border p-2 rounded text-center text-xl my-1"
                                    pattern='/^\d*\.?\,?\d*$/' />

                            <label htmlFor='garantia' className='mb-2 text-3xl mr-20'>Garantía</label>
                            <input type='text' id='garantia' name='garantia'
                                defaultValue={licitacion?.garantia} className="border p-2 rounded text-center text-xl my-1"/>
                           </>
                        )}
                    </div>
                </div>
            </fieldset>
            <Button title={title} onClick={onClick}/>
        </form>
    )
}

export default Form