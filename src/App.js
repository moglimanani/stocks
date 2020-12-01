import './App.css';
import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Table from './table'


const client = new W3CWebSocket('ws://stocks.mnet.website');
function getTime() {
  return new Date().getTime();
}


function App() {
  const [stock, setStock] = useState([])
  useEffect(() => {
    const bgColors = ['#fff', '#0f0', '#f00'];
    client.onmessage = (message) => {
      const datum = JSON.parse(message.data);
      const original = [...stock]
      if (datum.length > 0) {
        datum.forEach(element => {
          const found = original.findIndex((item) => item.name === element[0]);
          if (found >= 0) {
            if (original[found].price > element[1])
              original[found].color = bgColors[2];
            else if (original[found].price < element[1])
              original[found].color = bgColors[1];
            original[found].price = element[1];
            original[found].time = getTime();

          }
          else {
            const obj = { 'name': element[0], 'color': bgColors[0], 'price': element[1], 'time': getTime() }
            original.push(obj);
          }
        });
          setStock(original);
        }
    };

    }, [stock])

  const columns = [{
    Header: 'Ticker',
    accessor: 'name'
  },
  {
    Header: 'Price',
    accessor: 'price',
    Cell: row => {
      const bg = { backgroundColor: row.row.original.color };
      return <div style={bg}>{row.value}</div>
    },
    getProps: (state, rowInfo, column) => {
      return {
        style: {
          background: rowInfo && rowInfo.row.color,
        },
      };
    },
  },
  {
    Header: 'Last Update',
    accessor: 'time'
  }
  ]

  return (
    <div className="App">
      <header className="App-header">
        <h3>Stock Market</h3>

      </header>
     
      <Table
        data={stock}
        columns={columns}
      />
     
    </div>
  );
}

export default App;
