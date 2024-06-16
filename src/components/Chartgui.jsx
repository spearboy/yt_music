import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Chartgui = ({ chartData, itemTitle }) => {
  const data = chartData.find(d => d.title === itemTitle)?.ranks || [];
  
  return (
    <div className='chart'>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="date"/>
        <YAxis reversed={true}/>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="rank" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default Chartgui;
