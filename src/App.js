import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Main from "./components/Main";
import Aside from "./components/Aside";
import Search from "./components/Search";

import Home from "./pages/Home";
import Mymusic from "./pages/Mymusic";
import ChartList from "./pages/ChartList";
import PlayList from "./pages/PlayList";
import Like from "./pages/Like";
import Recent from "./pages/Recent";
import MusicPlayerProvider from "./context/MusicPlayerProvider";

const App = () => {
    const [customPlaylists, setCustomPlaylists] = useState([]);

    useEffect(() => {
        const count = localStorage.getItem('playlistCount') || 0;
        const customPlaylists = [];
        for (let i = 1; i <= count; i++) {
            const playlistKey = `playlist${i}`;
            const playlist = JSON.parse(localStorage.getItem(playlistKey));
            if (playlist && playlist.name) {
                customPlaylists.push({ name: playlist.name, value: playlistKey });
            }
        }
        setCustomPlaylists(customPlaylists);
    }, []);

    const handleDeletePlaylist = (id) => {
        const updatedPlaylists = customPlaylists.filter(playlist => playlist.value !== id);
        setCustomPlaylists(updatedPlaylists);
    };

    return (
        <MusicPlayerProvider>
            <BrowserRouter>
                <Header customPlaylists={customPlaylists} setCustomPlaylists={setCustomPlaylists} />
                <Main>
                    <Search />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mymusic/:filename" element={<Mymusic />} />
                        <Route path="/like" element={<Like />} />
                        <Route path="/recent" element={<Recent />} />
                        <Route path="/playlist/:id" element={<PlayList handleDeletePlaylist={handleDeletePlaylist} />} />
                        <Route path="/chart/:id" element={<ChartList />} />
                    </Routes>
                </Main>
                <Aside />
            </BrowserRouter>
        </MusicPlayerProvider>
    );
};

export default App;
