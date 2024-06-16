import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/scss/_home.scss'; // 스타일을 위한 SCSS 파일

const Home = () => {
  const [news, setNews] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // 음악 뉴스 불러오기
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: '음악',
            apiKey: '75c1b139ce23402d9b0623f75ba0fa6c', // 여기에 본인의 News API 키를 입력하세요
            language: 'ko',
            sortBy: 'publishedAt',
            pageSize: 5,
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error('뉴스를 불러오는데 실패했습니다.', error);
      }
    };

    // 최근 재생 목록 불러오기
    const fetchRecentTracks = () => {
      const storedRecentTracks = JSON.parse(localStorage.getItem('recentTracks')) || [];
      setRecentTracks(storedRecentTracks);
    };

    // 추천 플레이리스트 불러오기
    const fetchRecommendations = async () => {
      try {
        const charts = ['melon', 'genie', 'bugs', 'billboard'];
        const allRecommendations = [];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        for (const chart of charts) {
          const response = await axios.get(`https://raw.githubusercontent.com/webs9919/music-best/main/${chart}/${chart}100_${formatDate(yesterday)}.json`);
          const tracks = response.data;
          allRecommendations.push(...getRandomTracks(tracks, 5));
        }

        setRecommendations(allRecommendations);
      } catch (error) {
        console.error('추천 플레이리스트를 불러오는데 실패했습니다.', error);
      }
    };

    fetchNews();
    fetchRecentTracks();
    fetchRecommendations();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const getRandomTracks = (tracks, num) => {
    const shuffled = [...tracks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  return (
    <div className="home">
      <div className="background"></div>
      <div className="content">
        <h1>Welcome to My Music Chart</h1>
        <section className="recommendations">
          <h2>추천 플레이리스트</h2>
          <ul>
            {recommendations.length > 0 ? recommendations.map((track, index) => (
              <li key={index}>
                <span className="title">{track.title}</span>
                <span className="artist">{track.artist}</span>
              </li>
            )) : <li>추천 트랙을 불러오는데 실패했습니다.</li>}
          </ul>
        </section>
        <section className="recent-tracks">
          <h2>최근 재생 목록</h2>
          <ul>
            {recentTracks.length > 0 ? recentTracks.map((track, index) => (
              <li key={index}>
                <span className="title">{track.title}</span>
                <span className="artist">{track.artist}</span>
              </li>
            )) : <li>최근 재생한 트랙이 없습니다.</li>}
          </ul>
        </section>
        <section className="music-news">
          <h2>음악 뉴스</h2>
          <ul>
            {news.length > 0 ? news.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img src={article.urlToImage} alt={article.title} />
                  {article.title}
                </a>
              </li>
            )) : <li>뉴스를 불러오는데 실패했습니다.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
