import React, { useState, useContext, useRef, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import axios from 'axios';
import { MdOutlinePlayCircleFilled, MdFormatListBulletedAdd, MdHive, MdThumbUp } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import Modal from './Modal';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [youtubeResults, setYoutubeResults] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addTrackToList, playTrack, addTrackToEnd } = useContext(MusicPlayerContext);

    const searchRef = useRef(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            searchYoutube(e.target.value);
        } else {
            setYoutubeResults([]);
        }
    };

    const searchYoutube = async (query) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 5,
                    key: 'AIzaSyBJa-2g-ehO_MGpUtr37dLCJQ8Nu4wRmxc',
                },
            });
            setYoutubeResults(response.data.items);
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error);
        }
    };

    const handlePlayNow = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToList(newTrack);
        playTrack(0);
    };

    const handleAddToList = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToEnd(newTrack);
        toast.success('리스트에 추가했습니다.');
    };

    const handleAddToPlaylistClick = (result) => {
        setSelectedTrack({
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        });
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack);
            localStorage.setItem(playlistId, JSON.stringify(playlist));
        }
    };

    const handleAddToLike = (result) => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        likedTracks.push(newTrack);
        localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
        toast.success('좋아요 목록에 추가했습니다.');
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setYoutubeResults([]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <article className="search" ref={searchRef}>
            <label htmlFor="searchInput">
                <LuSearch />
            </label>
            <input
                type="text"
                placeholder="Search"
                id="searchInput"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {youtubeResults.length > 0 && (
                <div className="search-results">
                    <ul>
                        {youtubeResults.map((result, index) => (
                            <li key={index}>
                                <span className="img" style={{ backgroundImage: `url(${result.snippet.thumbnails.default.url})` }}></span>
                                <span className="title">{result.snippet.title}</span>
                                <span className="playNow" onClick={() => handlePlayNow(result)}>
                                    <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                </span>
                                <span className="listAdd" onClick={() => handleAddToList(result)}>
                                    <MdFormatListBulletedAdd /><span className='ir'>리스트 추가하기</span>
                                </span>
                                <span className="chartAdd" onClick={() => handleAddToPlaylistClick(result)}>
                                    <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                </span>
                                <span className="likeAdd" onClick={() => handleAddToLike(result)}>
                                    <MdThumbUp /><span className='ir'>좋아요 추가하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <ToastContainer />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </article>
    );
};

export default Search;
