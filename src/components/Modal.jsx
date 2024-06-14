import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, onAddToPlaylist }) => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const count = Number(localStorage.getItem('playlistCount')) || 0;
            const loadedPlaylists = [];
            for (let i = 1; i <= count; i++) {
                const playlistKey = `playlist${i}`;
                const playlist = JSON.parse(localStorage.getItem(playlistKey));
                if (playlist) {
                    loadedPlaylists.push(playlist);
                }
            }
            setPlaylists(loadedPlaylists);
        }
    }, [isOpen]);

    const handleAddClick = (playlistId) => {
        onAddToPlaylist(playlistId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>플레이리스트 선택</h2>
                <ul>
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            {playlist.name}
                            <button onClick={() => handleAddClick(playlist.id)}>추가</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Modal;