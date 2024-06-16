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
  const { setMusicData } = useContext(MusicPlayerContext);

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
  };

  if (loading) return <Loading loading={loading} />;
  if (error) return <Error message={error.message} />;

  return (
    <section id='myMusic'>
      <Chart
        title={`🎵 ${filename} 리스트`}
        data={data}
        showCalendar={false}
      />
      <button onClick={handleUpdatePlaylist}>변경</button>
    </section>
  );
}

export default Mymusic;
