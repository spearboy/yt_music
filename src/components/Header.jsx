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
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

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

    const handlePlaylistChange = (e) => {
        const selected = e.target.value;
        setSelectedPlaylist(selected);

        if (predefinedPlaylists.find(playlist => playlist.value === selected)) {
            navigate(`/mymusic/${selected}`);
        } else {
            navigate(`/playlist/${selected}`);
        }
    };

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'><IoMusicalNotes />나의 뮤직 챠트</Link>
            </h1>
            <h2>chart</h2>
            <ul>
                <li><Link to='/chart/melon'><span className='icon'></span>멜론 챠트</Link></li>
                <li><Link to='/chart/bugs'><span className='icon'></span>벅스 챠트</Link></li>
                <li><Link to='/chart/apple'><span className='icon'></span>애플 챠트</Link></li>
                <li><Link to='/chart/genie'><span className='icon'></span>지니 챠트</Link></li>
                <li><Link to='/chart/billboard'><span className='icon'></span>빌보드 챠트</Link></li>
            </ul>
            <h2>playlist</h2>
            <ul>
                <li><Link to='/recent'><span className='icon2'><FcRating /></span>Recent</Link></li>
                <li><Link to='/like'><span className='icon2'><GrLike /></span>Like</Link></li>
                <li>
                    <span className='icon2'><FcApproval /></span>
                    <select value={selectedPlaylist} onChange={handlePlaylistChange}>
                        <option value="" disabled>Select a playlist</option>
                        {predefinedPlaylists.map((playlist, index) => (
                            <option key={index} value={playlist.value}>{playlist.name}</option>
                        ))}
                        {customPlaylists.map((playlist, index) => (
                            <option key={index + predefinedPlaylists.length} value={playlist.value}>{playlist.name}</option>
                        ))}
                    </select>
                </li>
                <li>
                    {showInput ? (
                        <div>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddItem}>Add</button>
                        </div>
                    ) : (
                        <a href="#" onClick={handleAddClick}><span className='icon2'><FcPlus /></span>Create</a>
                    )}
                </li>
            </ul>
        </header>
    );
}

export default Header;
