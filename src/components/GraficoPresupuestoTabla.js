"use client"
import React, { useState, useEffect } from 'react';

const Graficos = ({ valor }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(0);
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [isSelectOpen1, setIsSelectOpen1] = useState(false);
  const [isSelectOpen2, setIsSelectOpen2] = useState(false);
  const [isSelectOpen3, setIsSelectOpen3] = useState(false);
  const [isSelectOpen4, setIsSelectOpen4] = useState(false);

  const handleSelectFocus1 = () => {
    setIsSelectOpen1(true);
  };

  const handleSelectBlur1 = () => {
    setIsSelectOpen1(false);
  };
  
  const handleSelectFocus2 = () => {
    setIsSelectOpen2(true);
  };

  const handleSelectBlur2 = () => {
    setIsSelectOpen2(false);
  };

  const handleSelectFocus3 = () => {
    setIsSelectOpen3(true);
  };

  const handleSelectBlur3 = () => {
    setIsSelectOpen3(false);
  };
  
  const handleSelectFocus4 = () => {
    setIsSelectOpen4(true);
  };

  const handleSelectBlur4 = () => {
    setIsSelectOpen4(false);
  };
  
  let texto;

  if (valor === 9) {
    texto = 'Presupuestos';
  } else if (valor === 10) {
    texto = 'Presentadas';
  } else {
    texto = 'Valor no reconocido';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw/values/Sheet1!A:AA?key=AIzaSyA34zl85JixrX_k4FJop30ME4BEc7jPLJ8');
        const jsonData = await response.json();
        const sheetData = jsonData.values || [];
        setData(sheetData.slice(1));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const filteredData = data.filter(item => {
      const date = new Date(item[1]); // Corregir el índice a 10 para la columna K
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return (
        (selectedMonth === 0 || month === parseInt(selectedMonth)) &&
        (selectedYear === 0 || year === parseInt(selectedYear)) &&
        (startMonth === 0 || (year > parseInt(startYear) || (year === parseInt(startYear) && month >= parseInt(startMonth)))) &&
        (endMonth === 0 || (year < parseInt(endYear) || (year === parseInt(endYear) && month <= parseInt(endMonth))))
      );
    });

    setFilteredData(filteredData);
  }, [data, selectedMonth, selectedYear, startMonth, endMonth, startYear, endYear]);

  const handleStartMonthChange = (event) => {
    setStartMonth(event.target.value);
  };

  const handleEndMonthChange = (event) => {
    setEndMonth(event.target.value);
  };

  const handleStartYearChange = (event) => {
    setStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setEndYear(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
    setStartMonth(0);
    setEndMonth(0);
    setStartYear(0);
    setEndYear(0);
  };

  const countOccurrences = () => {
    const occurrences = {};
    let totalSum = 0;
    let totalImporte = 0;
    let noAdjudicadaImporte = 0;
    filteredData.forEach(item => {
      const columnKData = item[valor];
      const valueM = item[12];
      const importe = parseFloat(item[7]) || 0;
      if (columnKData && valueM) {
        if (!occurrences[columnKData]) {
          occurrences[columnKData] = { total: 0, importe: 0, noAdjudicadaImporte: 0 };
        }
        occurrences[columnKData][valueM] = (occurrences[columnKData][valueM] || 0) + 1;
        occurrences[columnKData].total++;
        if (valueM === "NO ADJUDICADA") {
          occurrences[columnKData].noAdjudicadaImporte += importe;
          noAdjudicadaImporte += importe;
        } else {
          occurrences[columnKData].importe += importe;
          totalImporte += importe;
        }
        totalSum++;
      }
    });
    return { occurrences, totalSum, totalImporte, noAdjudicadaImporte };
  };

  const renderTableHeaders = (occurrences) => {
    const valuesM = new Set();
    Object.values(occurrences).forEach(columnKOccurrences => {
      Object.keys(columnKOccurrences).forEach(valueM => {
        if (valueM !== 'total' && valueM !== 'importe' && valueM !== 'noAdjudicadaImporte') {
          valuesM.add(valueM);
        }
      });
    });
    return (
      <tr>
        <th className="py-2 px-4">Presupuesto por</th>
        <th className="py-2 px-4">Total</th>
        {[...valuesM].map(valueM => (
          <th key={valueM} className="py-2 px-4">{valueM}</th>
        ))}
        <th className="py-2 px-4">Importe</th>
        <th className="py-2 px-4">Importe NO ADJUDICADA</th>
      </tr>
    );
  };

  const renderTableRows = (filteredData) => {
    const { occurrences, totalSum, totalImporte, noAdjudicadaImporte } = countOccurrences(filteredData);
    const columnKData = Object.keys(occurrences);
    const allValuesM = new Set();
    columnKData.forEach(columnK => {
      Object.keys(occurrences[columnK]).forEach(valueM => {
        if (valueM !== 'total' && valueM !== 'importe' && valueM !== 'noAdjudicadaImporte') {
          allValuesM.add(valueM);
        }
      });
    });

    const totals = { total: 0, importe: 0, noAdjudicadaImporte: 0 };

    const rows = columnKData.map(columnK => {
      const total = occurrences[columnK].total;
      const percentage = totalSum !== 0 ? (total / totalSum * 100).toFixed(2) : 0;
      const importe = occurrences[columnK].importe.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      const importePercentage = totalImporte !== 0 ? (occurrences[columnK].importe / totalImporte * 100).toFixed(2) : 0;
      const noAdjudicadaImporteFormatted = occurrences[columnK].noAdjudicadaImporte.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      const noAdjudicadaImportePercentage = noAdjudicadaImporte !== 0 ? (occurrences[columnK].noAdjudicadaImporte / noAdjudicadaImporte * 100).toFixed(2) : 0;

      [...allValuesM].forEach(valueM => {
        totals[valueM] = (totals[valueM] || 0) + (occurrences[columnK][valueM] || 0);
      });
      totals.total += total;
      totals.importe += parseFloat(importe.replace(/\s/g, '').replace(',', '.')); // Elimina los espacios en blanco antes de la conversión a número
      totals.noAdjudicadaImporte += parseFloat(noAdjudicadaImporteFormatted.replace(/\s/g, '').replace(',', '.'));

      return (
        <tr key={columnK}>
          <td className="py-2 px-4">{columnK}</td>
          <td className="py-2 px-4">{total} - {percentage}%</td>
          {[...allValuesM].map(valueM => (
            <td key={valueM} className="py-2 px-4">{occurrences[columnK][valueM] || 0}</td>
          ))}
          <td className="py-2 px-4">{importe} € - {importePercentage}%</td>
          <td className="py-2 px-4">{noAdjudicadaImporteFormatted} € - {noAdjudicadaImportePercentage}%</td>
        </tr>
      );
    });

    const totalPercentage = totalSum !== 0 ? (totals.total / totalSum * 100).toFixed(2) : 0;
    const formattedTotalImporte = totals.importe.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const totalImportePercentage = totalImporte !== 0 ? (totals.importe / totalImporte * 100).toFixed(2) : 0;
    const formattedTotalNoAdjudicadaImporte = totals.noAdjudicadaImporte.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const totalNoAdjudicadaImportePercentage = noAdjudicadaImporte !== 0 ? (totals.noAdjudicadaImporte / noAdjudicadaImporte * 100).toFixed(2) : 0;

    const totalRow = (
      <tr key="totals">
        <td className="py-2 px-4 font-bold">Total</td>
        <td className="py-2 px-4 font-bold">{totals.total} - {totalPercentage}%</td>
        {[...allValuesM].map(valueM => (
          <td key={valueM} className="py-2 px-4 font-bold">{totals[valueM]}</td>
        ))}
        <td className="py-2 px-4 font-bold">{formattedTotalImporte} € - {totalImportePercentage}%</td>
        <td className="py-2 px-4 font-bold">{formattedTotalNoAdjudicadaImporte} € - {totalNoAdjudicadaImportePercentage}%</td>
      </tr>
    );

    return [...rows, totalRow];
  };

  const { occurrences } = countOccurrences();

  return (
    <>
      <div className='justify-center'>
        <p className='text-center font-bold text-2xl'>{texto}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
          <div>
            <label htmlFor="startMonthSelect" className='text-center block'>Inicio Mes</label>
            <select
              id="startMonthSelect"
              onChange={handleStartMonthChange}
              value={startMonth}
              onFocus={handleSelectFocus1}
              onBlur={handleSelectBlur1}
              className={`w-full p-2 border border-gray-300 rounded-md text-center ${!isSelectOpen1 && startMonth !== 0 ? 'bg-blue-100' : ''}`}
            >
              <option value="0">Todos los meses</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + new Date(2000, month - 1).toLocaleString('default', { month: 'long' }).slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endMonthSelect" className='text-center block'>Fin Mes</label>
            <select
              id="endMonthSelect"
              onChange={handleEndMonthChange}
              value={endMonth}
              onFocus={handleSelectFocus2}
              onBlur={handleSelectBlur2}
              className={`w-full p-2 border border-gray-300 rounded-md text-center ${!isSelectOpen2 && endMonth !== 0 ? 'bg-blue-100' : ''}`}
            >
              <option value="0">Todos los meses</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + new Date(2000, month - 1).toLocaleString('default', { month: 'long' }).slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startYearSelect" className='text-center block'>Inicio Año</label>
            <select
              id="startYearSelect"
              onChange={handleStartYearChange}
              value={startYear}              
              onFocus={handleSelectFocus3}
              onBlur={handleSelectBlur3}
              className={`w-full p-2 border border-gray-300 rounded-md text-center ${!isSelectOpen3 && startYear !== 0 ? 'bg-blue-100' : ''}`}
            >
              <option value="0">Todos los años</option>
              {Array.from({ length: 8 }, (_, index) => 2023 + index).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endYearSelect" className='text-center block'>Fin Año</label>
            <select
              id="endYearSelect"
              onChange={handleEndYearChange}
              value={endYear}
              onFocus={handleSelectFocus4}
              onBlur={handleSelectBlur4}
              className={`w-full p-2 border border-gray-300 rounded-md text-center ${!isSelectOpen4 && endYear !== 0 ? 'bg-blue-100' : ''}`}
            >
              <option value="0">Todos los años</option>
              {Array.from({ length: 8 }, (_, index) => 2023 + index).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 mx-auto">
            <button
              onClick={handleResetFilters}
              className="w-[100%] p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Resetear Filtros
            </button>
          </div>
          <div className="col-span-2 mx-auto">
            <table className="w-full max-w-full border border-black">
              <thead>
                {renderTableHeaders(occurrences)}
              </thead>
              <tbody>
                {renderTableRows(filteredData)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>
        {`
          table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid black;
            text-align: center;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        `}
      </style>
    </>
  );
};

export default Graficos;
