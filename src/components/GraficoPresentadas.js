"use client"
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graficos = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(0);
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [selectedPresupuestador, setSelectedPresupuestador] = useState('');
  const [presupuestadores, setPresupuestadores] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw/values/Sheet1!A:AA?key=AIzaSyA34zl85JixrX_k4FJop30ME4BEc7jPLJ8');
        const jsonData = await response.json();
        const sheetData = jsonData.values || [];
        setData(sheetData.slice(1));
        updatePresupuestadores(sheetData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updatePresupuestadores = (sheetData) => {
    const presupuestadoresSet = new Set();
    for (let i = 1; i < sheetData.length; i++) {
      const item = sheetData[i];
      const presupuestador = item[10] || 'Sin presupuestador';
      if (presupuestador !== 'Sin presupuestador') {
        presupuestadoresSet.add(presupuestador);
      }
    }
    setPresupuestadores(Array.from(presupuestadoresSet));
  };

  useEffect(() => {
    if (data.length === 0) return;

    const filteredData = data.filter(item => {
      const date = new Date(item[1]);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const presupuestador = item[10] || 'Sin presupuestador';
      return (
        (selectedMonth === 0 || month === parseInt(selectedMonth)) &&
        (selectedYear === 0 || year === parseInt(selectedYear)) &&
        (startMonth === 0 || (year > parseInt(startYear) || (year === parseInt(startYear) && month >= parseInt(startMonth)))) &&
        (endMonth === 0 || (year < parseInt(endYear) || (year === parseInt(endYear) && month <= parseInt(endMonth)))) &&
        (selectedPresupuestador === '' || presupuestador === selectedPresupuestador)
      );
    });

    const filteredDataWithoutSinPresupuestador = filteredData.filter(item => {
      const presupuestador = item[10] || 'Sin presupuestador';
      return presupuestador !== 'Sin presupuestador';
    });

    const stateCountsByPresupuestador = filteredDataWithoutSinPresupuestador.reduce((countsByPresupuestador, item) => {
      const presupuestador = item[10] || 'Sin presupuestador';
      const state = item[12];
      if (!state || state.trim() === '') return countsByPresupuestador;
      countsByPresupuestador[presupuestador] = countsByPresupuestador[presupuestador] || {};
      countsByPresupuestador[presupuestador][state] = (countsByPresupuestador[presupuestador][state] || 0) + 1;
      return countsByPresupuestador;
    }, {});

    const allStates = new Set(data.map(item => item[12]).filter(state => state && state.trim() !== ''));

    const labels = Object.keys(stateCountsByPresupuestador);
    const datasets = Array.from(allStates).map((state, index) => {
      const values = labels.map(presupuestador => stateCountsByPresupuestador[presupuestador][state] || 0);
      return {
        label: state,
        data: values,
        backgroundColor: getBackgroundColor(state),
        borderColor: getBorderColor(state),
        borderWidth: 1,
      };
    });

    const ctx = document.getElementById('grafico2');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            stacked: false,
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, selectedMonth, selectedYear, startMonth, endMonth, startYear, endYear, selectedPresupuestador]);

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

  const handlePresupuestadorChange = (event) => {
    setSelectedPresupuestador(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
    setStartMonth(0);
    setEndMonth(0);
    setStartYear(0);
    setEndYear(0);
    setSelectedPresupuestador('');
  };

  const staticYears = Array.from({ length: 8 }, (_, index) => 2023 + index);

  const getBackgroundColor = (state) => {
    switch (state) {
      case 'ADJUDICADA':
        return 'rgba(0, 255, 0, 0.5)'; // Green
      case 'EN ESPERA RESOLUCIÓN':
        return 'rgba(0, 0, 255, 0.5)'; // Blue
      case 'NO ADJUDICADA':
        return 'rgba(255, 0, 0, 0.5)'; // Red
      case 'DESESTIMADA':
        return 'rgba(128, 0, 128, 0.5)'; // Purple
      case 'DESIERTA':
        return 'rgba(255, 255, 0, 0.5)'; // Yellow
      case 'ANULADA':
        return 'rgba(0, 255, 255, 0.5)'; // Yellow     
      default:
        return 'rgba(0, 0, 0, 0.5)';
    }
  };

  const getBorderColor = (state) => {
    switch (state) {
      case 'ADJUDICADA':
        return 'rgba(0, 255, 0, 0.5)'; // Green
      case 'EN ESPERA RESOLUCIÓN':
        return 'rgba(0, 0, 255, 0.5)'; // Blue
      case 'NO ADJUDICADA':
        return 'rgba(255, 0, 0, 0.5)'; // Red
      case 'DESESTIMADA':
        return 'rgba(128, 0, 128, 0.5)'; // Purple
      case 'DESIERTA':
        return 'rgba(255, 255, 0, 0.5)'; // Yellow
      case 'ANULADA':
        return 'rgba(0, 255, 255, 0.5)'; // Yellow  
      default:
        return 'rgba(0, 0, 0, 1)';
    }
  };

  return (
    <>
    <div>
      <p>Presentadas</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startMonthSelect">Inicio Mes:</label>
          <select
            id="startMonthSelect"
            onChange={handleStartMonthChange}
            value={startMonth}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
          >
            <option value="0">Todos los meses</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endMonthSelect">Fin Mes:</label>
          <select
            id="endMonthSelect"
            onChange={handleEndMonthChange}
            value={endMonth}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
          >
            <option value="0">Todos los meses</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startYearSelect">Inicio Año:</label>
          <select
            id="startYearSelect"
            onChange={handleStartYearChange}
            value={startYear}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
          >
            <option value="0">Todos los años</option>
            {staticYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endYearSelect">Fin Año:</label>
          <select
            id="endYearSelect"
            onChange={handleEndYearChange}
            value={endYear}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
          >
            <option value="0">Todos los años</option>
            {staticYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <label htmlFor="presupuestadorSelect">Presentador:</label>
          <select
            id="presupuestadorSelect"
            onChange={handlePresupuestadorChange}
            value={selectedPresupuestador}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
          >
            <option value="">Todos los usuarios</option>
            {presupuestadores.map((presupuestador, index) => (
              <option key={index} value={presupuestador}>
                {presupuestador}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <button
            onClick={handleResetFilters}
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Resetear Filtros
          </button>
        </div>
        <div className="col-span-2">
          <canvas id="grafico2" width="600" height="600"></canvas>
        </div>
      </div>
    </div>
    </>
  );
};

export default Graficos;
