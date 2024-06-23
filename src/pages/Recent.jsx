import React, { useEffect, useState } from 'react';
import Chart from '../components/Chart';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Recent = () => {
    const [recentTracks, setRecentTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const storedRecentTracks = JSON.parse(localStorage.getItem('recentTracks')) || [];
            setRecentTracks(storedRecentTracks);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <Loading loading={loading} />;
    if (error) return <Error message={error.message} />;

    return (
        <section id='recent'>
            <Chart
                title="최근 들은 노래"
                data={recentTracks}
                showCalendar={false}
            />
        </section>
    );
}

export default Recent;
