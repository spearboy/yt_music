import React, { forwardRef, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FcCalendar } from 'react-icons/fc';
import { MdFormatListBulletedAdd, MdOutlinePlayCircleFilled, MdClose, MdHive, MdThumbUp, MdHistory } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import Modal from './Modal';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data }) => {
    const { addTrackToList, addTrackToEnd, playTrack } = useContext(MusicPlayerContext);

    const [youtubeResults, setYoutubeResults] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

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

    const handleItemClick = (title) => {
        setSelectedTitle(title);
        searchYoutube(title);
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

    const handleAddToRecent = (result) => {
        const recentTracks = JSON.parse(localStorage.getItem('recentTracks')) || [];
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        recentTracks.unshift(newTrack);
        if (recentTracks.length > 50) recentTracks.pop(); // 최근 목록 50개로 제한
        localStorage.setItem('recentTracks', JSON.stringify(recentTracks));
    };

    return (
        <>
            <section className='music-chart'>
                <div className="title">
                    <h2>{title}</h2>
                    {showCalendar && (
                        <div className='date'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={onDateChange}
                                dateFormat="yyyy-MM-dd"
                                minDate={minDate}
                                maxDate={maxDate}
                                customInput={<CustomInput />}
                            />
                        </div>
                    )}
                </div>
                <div className="list">
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} onClick={() => handleItemClick(item.title)}>
                                <span className='rank'>#{item.rank}</span>
                                <span className='img' style={{ backgroundImage: `url(${item.imageURL})` }}></span>
                                <span className='title'>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {youtubeResults.length > 0 && (
                <section className='youtube-result'>
                    <h3>🧑🏻‍💻 👉 "{selectedTitle}"에 대한 유튜브 검색 결과입니다.</h3>
                    <ul>
                        {youtubeResults.map((result, index) => (
                            <li key={index}>
                                <span className='img' style={{ backgroundImage: `url(${result.snippet.thumbnails.default.url})` }}></span>
                                <span className='title'>{result.snippet.title}</span>
                                <span className='playNow' onClick={() => { handlePlayNow(result); handleAddToRecent(result); }}>
                                    <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                </span>
                                <span className='listAdd' onClick={() => handleAddToList(result)}>
                                    <MdFormatListBulletedAdd /><span className='ir'>리스트 추가하기</span>
                                </span>
                                <span className='chartAdd' onClick={() => handleAddToPlaylistClick(result)}>
                                    <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                </span>
                                <span className='likeAdd' onClick={() => handleAddToLike(result)}>
                                    <MdThumbUp /><span className='ir'>좋아요 추가하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <span className='close' onClick={() => setYoutubeResults([])}><MdClose /></span>
                </section>
            )}
            <ToastContainer />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </>
    )
}

export default Chart;
