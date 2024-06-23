import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const Mymusic = () => {
  const { filename } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setMusicData, playTrack } = useContext(MusicPlayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/list_data/${filename}.json`);
        if (!response.ok) {
          throw new Error('네트워크 상태가 좋지 않네요!! 관리자에게 문의 주세요!');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filename]);

  const handleUpdatePlaylist = () => {
    setMusicData(data);
    playTrack(0); // 첫 번째 트랙을 재생
  };

  if (loading) return <Loading loading={loading} />;
  if (error) return <Error message={error.message} />;

  return (
    <section id='myMusic'>
      <button className='change_list_btn' onClick={handleUpdatePlaylist}>{filename}의 플레이 리스트로 변경하기</button>
      <Chart
        title={`${filename} 리스트`}
        data={data}
        showCalendar={false}
      />
    </section>
  );
}

export default Mymusic;
