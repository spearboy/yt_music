import React, { useEffect, useState } from 'react';

const Like = () => {
    const [likedTracks, setLikedTracks] = useState([]);

    useEffect(() => {
        const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
        setLikedTracks(storedLikedTracks);
    }, []);

    return (
        <section id='like'>
            <h2>좋아요 목록</h2>
            <ul>
                {likedTracks.map((track, index) => (
                    <li key={index}>
                        <span className='img' style={{ backgroundImage: `url(${track.imageURL})` }}></span>
                        <span className='title'>{track.title}</span>
                        <span className='artist'>{track.artist}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Like;
