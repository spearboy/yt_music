import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from '../components/Chart';

const PlayList = ({ handleDeletePlaylist }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState({ name: '', items: [] });

    useEffect(() => {
        const storedPlaylist = JSON.parse(localStorage.getItem(id)) || { name: '', items: [] };
        setPlaylist(storedPlaylist);
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("정말 이 플레이리스트를 삭제하시겠습니까?")) {
            localStorage.removeItem(id);

            let playlistCount = Number(localStorage.getItem('playlistCount')) || 0;
            const updatedPlaylists = [];

            for (let i = 1; i <= playlistCount; i++) {
                const playlistKey = `playlist${i}`;
                if (playlistKey === id) {
                    localStorage.removeItem(playlistKey);
                } else {
                    const playlist = JSON.parse(localStorage.getItem(playlistKey));
                    if (playlist) {
                        updatedPlaylists.push(playlist);
                    }
                }
            }

            playlistCount = updatedPlaylists.length;
            localStorage.setItem('playlistCount', playlistCount.toString());

            updatedPlaylists.forEach((playlist, index) => {
                const playlistKey = `playlist${index + 1}`;
                localStorage.setItem(playlistKey, JSON.stringify(playlist));
            });

            handleDeletePlaylist(id);
            navigate('/');
        }
    };

    return (
        <section id="playlist">
            <div className="title">
                <h2>{playlist.name} 리스트</h2>
                <button onClick={handleDelete}>플레이리스트 삭제</button>
            </div>
            {playlist.items.length > 0 ? (
                <Chart
                    title={`${playlist.name} 리스트`}
                    data={playlist.items}
                    showCalendar={false}
                />
            ) : (
                <section className='music-chart'>
                    <div className="title">
                        <h2>😜 {playlist.name || '플레이리스트'}</h2>
                    </div>
                    <div className="list">
                        <ul>
                            <li>!!아직 리스트가 없습니다. 노래를 추가해주세요!</li>
                        </ul>
                    </div>
                </section>
            )}
        </section>
    );
}

export default PlayList;
