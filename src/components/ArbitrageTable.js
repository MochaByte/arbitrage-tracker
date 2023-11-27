// src/ArbitrageTable.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './ArbitrageTable.css'; // Import the CSS file

const socket = io('http://localhost:3001');

const ArbitrageTable = () => {
  const [arbitrageData, setArbitrageData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mocked data for now
        const fakeData = [
          { currencyPair: 'BTC/USD', buyPrice: 48000, sellPrice: 49000 },
          { currencyPair: 'ETH/USD', buyPrice: 3000, sellPrice: 3200 },
          
        ];

        setArbitrageData(fakeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    socket.on('updateData', (updatedData) => {
      setArbitrageData(updatedData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="lyra-title">
        <img className="lyra-icon" src="./icons/lyra-icon.png" alt="Lyra Icon" />
        Lyra Arbitrage
      </div>
      <div className="table-container">
        <table className="table">
          <thead className="table-head">
            <tr>
              <th>Currency Pair</th>
              <th>Buy Price</th>
              <th>Sell Price</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {arbitrageData.map((entry) => (
              <tr key={entry.currencyPair} className="table-row">
                <td className="table-cell">
                  <img
                    className="coin-icon"
                    src={`/icons/${entry.currencyPair.split('/')[0].toLowerCase()}-icon.png`}
                    alt={entry.currencyPair}
                  />
                  {entry.currencyPair}
                </td>
                <td className="table-cell">{entry.buyPrice}</td>
                <td className="table-cell">{entry.sellPrice}</td>
                <td className="table-cell">{entry.sellPrice - entry.buyPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArbitrageTable;
