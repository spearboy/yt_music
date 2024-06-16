import { useState, useEffect } from 'react';

const useFetchPlaylist = (file) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(file);
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
    }, [file]);

    return { data, loading, error };
};

export default useFetchPlaylist;
