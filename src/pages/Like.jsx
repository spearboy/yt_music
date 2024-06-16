import React, { useEffect, useState } from 'react';
import Chart from '../components/Chart'; // Corrected the import path

const Like = () => {
    const [likedTracks, setLikedTracks] = useState([]);

    useEffect(() => {
        const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
        setLikedTracks(storedLikedTracks);
    }, []);

    return (
        <section id='like'>
            <h2>좋아요 목록</h2>
            <Chart 
                title="좋아요 목록" 
                data={likedTracks} 
                showCalendar={false} 
                isPlaylist={true} 
            />
        </section>
    );
}

export default Like;
