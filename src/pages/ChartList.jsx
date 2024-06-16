import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hook/useFetchData';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';

const ChartList = () => {
    const { id } = useParams();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [selectedDate, setSelectedDate] = useState(yesterday);

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const url = `https://raw.githubusercontent.com/webs9919/music-best/main/${id}/${id}100_${formattedDate}.json`;
    const { data, loading, error } = useFetchData(url);

    if (loading) return <Loading loading={loading} />;
    if (error) return <Error message={error.message} />;

    return (
        <Chart
            title={`😜 ${id} 차트 Top100`} 
            chartType={id} 
            data={data} 
            showCalendar={true}
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            minDate={new Date('2024-05-01')} 
            maxDate={yesterday} 
        />
    );
};

export default ChartList;
