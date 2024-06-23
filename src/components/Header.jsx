import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcRating, FcPlus, FcApproval } from "react-icons/fc";
import { GrLike } from "react-icons/gr";
import { IoMusicalNotes } from "react-icons/io5";

const Header = ({ customPlaylists, setCustomPlaylists }) => {
    const navigate = useNavigate();
    const [showInput, setShowInput] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [playlistCount, setPlaylistCount] = useState(0);
    const [contextMenu, setContextMenu] = useState(null);

    const predefinedPlaylists = [
        { name: "Mymusic", value: "bhlist" },
        { name: "Daewon", value: "Daewon" },
        { name: "Hyeji List", value: "hyeji_list" },
        { name: "Hyunmin", value: "hyunmin" },
        { name: "Jungmin", value: "jungmin" },
        { name: "Seoyeon", value: "seoyeon" },
        { name: "Sohyun", value: "sohyun" },
        { name: "Sungmin", value: "sungmin" },
        { name: "Sunhwa", value: "sunhwa" },
        { name: "Yih", value: "yih" },
        { name: "Yoon List", value: "yoon_list" },
    ];

    useEffect(() => {
        const count = localStorage.getItem('playlistCount') || 0;
        setPlaylistCount(Number(count));
    }, [customPlaylists]);

    const handleAddClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e) => {
        setNewItem(e.target.value);
    };

    const handleAddItem = () => {
        if (newItem.trim() !== '') {
            const newCount = playlistCount + 1;
            const playlistKey = `playlist${newCount}`;
            const newPlaylist = {
                id: playlistKey,
                name: newItem,
                items: []
            };

            localStorage.setItem(playlistKey, JSON.stringify(newPlaylist));
            localStorage.setItem('playlistCount', newCount.toString());
            setPlaylistCount(newCount);
            setNewItem('');
            setShowInput(false);

            setCustomPlaylists([...customPlaylists, { name: newItem, value: playlistKey }]);
        }
    };

    const handleCancelAdd = () => {
        setNewItem('');
        setShowInput(false);
    };

    const handlePlaylistClick = (value) => {
        if (predefinedPlaylists.find(playlist => playlist.value === value)) {
            navigate(`/mymusic/${value}`);
        } else {
            navigate(`/playlist/${value}`);
        }
    };

    const handleContextMenu = (e, playlist) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX - 2,
            mouseY: e.clientY - 4,
            playlist
        });
    };

    const handleMenuClose = () => {
        setContextMenu(null);
    };

    const handleDeletePlaylist = () => {
        const updatedPlaylists = customPlaylists.filter(pl => pl.value !== contextMenu.playlist.value);
        setCustomPlaylists(updatedPlaylists);
        localStorage.removeItem(contextMenu.playlist.value);
        handleMenuClose();
    };

    const handleRenamePlaylist = () => {
        const newName = prompt('Enter new name:', contextMenu.playlist.name);
        if (newName) {
            const updatedPlaylists = customPlaylists.map(pl => 
                pl.value === contextMenu.playlist.value ? { ...pl, name: newName } : pl
            );
            setCustomPlaylists(updatedPlaylists);
            const playlist = JSON.parse(localStorage.getItem(contextMenu.playlist.value));
            playlist.name = newName;
            localStorage.setItem(contextMenu.playlist.value, JSON.stringify(playlist));
            handleMenuClose();
        }
    };

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'>Musicflix</Link>
            </h1>
            <h2>TOP 100 차트</h2>
            <ul>
                <li><Link to='/chart/melon'><span className='icon'></span>멜론 차트</Link></li>
                <li><Link to='/chart/bugs'><span className='icon'></span>벅스 차트</Link></li>
                <li><Link to='/chart/apple'><span className='icon'></span>애플 차트</Link></li>
                <li><Link to='/chart/genie'><span className='icon'></span>지니 차트</Link></li>
                <li><Link to='/chart/billboard'><span className='icon'></span>빌보드 차트</Link></li>
            </ul>
            <h2>기타 리스트</h2>
            <ul className='list_ul'>
                <li><Link to='/recent'><span className='icon2'><FcRating /></span>Recent</Link></li>
                <li><Link to='/like'><span className='icon2'><GrLike /></span>Like</Link></li>
                {predefinedPlaylists.map((playlist, index) => (
                    <li key={index} onClick={() => handlePlaylistClick(playlist.value)} onContextMenu={(e) => handleContextMenu(e, playlist)}>
                        <span className='icon2'><FcApproval /></span>{playlist.name}
                    </li>
                ))}
                {customPlaylists.map((playlist, index) => (
                    <li key={index + predefinedPlaylists.length} onClick={() => handlePlaylistClick(playlist.value)} onContextMenu={(e) => handleContextMenu(e, playlist)}>
                        <span className='icon2'><FcApproval /></span>{playlist.name}
                    </li>
                ))}
                <li>
                    {showInput ? (
                        <div>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddItem}>Add</button>
                            <button onClick={handleCancelAdd}>Cancel</button>
                        </div>
                    ) : (
                        <a href="#" onClick={handleAddClick}><span className='icon2'><FcPlus /></span>Create</a>
                    )}
                </li>
            </ul>
            {contextMenu && (
                <ul className='head_contextmenu'
                    style={{
                        position: 'absolute',
                        top: contextMenu.mouseY,
                        left: '10px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        zIndex: 1000
                    }}
                >
                    <li onClick={handleRenamePlaylist}>이름 바꾸기</li>
                    <li onClick={handleDeletePlaylist}>리스트 삭제</li>
                    <li onClick={handleMenuClose}>취소</li>
                </ul>
            )}
        </header>
    );
}

export default Header;
