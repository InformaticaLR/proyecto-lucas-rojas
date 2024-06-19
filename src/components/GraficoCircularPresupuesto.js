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
  const [selectedUser, setSelectedUser] = useState('');
  const chartRef = useRef(null);

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
      const date = new Date(item[1]);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const user = item[9] || 'Sin usuario';
      return (
        (selectedMonth === 0 || month === parseInt(selectedMonth)) &&
        (selectedYear === 0 || year === parseInt(selectedYear)) &&
        (startMonth === 0 || (year > parseInt(startYear) || (year === parseInt(startYear) && month >= parseInt(startMonth)))) &&
        (endMonth === 0 || (year < parseInt(endYear) || (year === parseInt(endYear) && month <= parseInt(endMonth)))) &&
        (selectedUser === '' || user === selectedUser)
      );
    });

    const values = filteredData
      .map(item => item[12])
      .filter(value => value && value !== "Valor no disponible");

    const valueCounts = values.reduce((counts, value) => {
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});

    const labels = Object.keys(valueCounts);
    const dataCounts = Object.values(valueCounts);

    renderChart(labels, dataCounts);
  }, [data, selectedMonth, selectedYear, startMonth, endMonth, startYear, endYear, selectedUser]);

  const renderChart = (labels, dataCounts) => {
    const ctx = document.getElementById('grafico5').getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: dataCounts,
            backgroundColor: [
              'rgba(0, 255, 0, 0.5)', // Green              
              'rgba(0, 0, 255, 0.5)', // Blue              
              'rgba(255, 0, 0, 0.5)', // Red      
              'rgba(255, 255, 0, 0.5)', // Yellow         
              'rgba(128, 0, 128, 0.5)', // Purple             
              'rgba(0, 255, 255, 0.5)', // Cyan             
            ],
            borderColor: [
              'rgba(0, 255, 0, 0.5)', // Green              
              'rgba(0, 0, 255, 0.5)', // Blue              
              'rgba(255, 0, 0, 0.5)', // Red                   
              'rgba(255, 255, 0, 0.5)', // Yellow   
              'rgba(128, 0, 128, 0.5)', // Purple              
              'rgba(0, 255, 255, 0.5)', // Cyan       
            ],
            borderWidth: 1,
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  };

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

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
    setStartMonth(0);
    setEndMonth(0);
    setStartYear(0);
    setEndYear(0);
    setSelectedUser('');
  };

  const staticYears = Array.from({ length: 8 }, (_, index) => 2023 + index);

  return (
    <div>
      <p>Presupuestos</p>
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
  <div className="col-span-2 flex flex-col items-center text-center">
    <label htmlFor="presupuestadorSelect">Presupuestador:</label>
    <select
      id="userSelect"
      onChange={handleUserChange}
      value={selectedUser}
      className="w-full p-2 border border-gray-300 rounded-md text-center"
    >
          <option value="">Todos los usuarios</option>
          {data
            .map(item => item[10])
            .filter((value, index, self) => value && self.indexOf(value) === index)
            .map((user, index) => (
              <option key={index} value={user}>{user}</option>
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
    <canvas id="grafico5" width="600" height="600"></canvas>
  </div>
</div>
</div>
  );
};

export default Graficos;