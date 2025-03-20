import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기
import { PlanContext } from '../components/PlanContext'; // PlanContext 가져오기

const Recommend = () => {
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedTransport, selectedStyle, selectedActivity } = location.state || {}; // 선택된 도시, 이동수단, 일정 스타일, 선택된 활동 정보 가져오기
    const { addPlan, addItemToPlan, plans } = useContext(PlanContext); // Context에서 addPlan, addItemToPlan, plans 가져오기

    const [recommendations, setRecommendations] = useState(null); // 추천 데이터 상태 추가
    const [error, setError] = useState(null); // 오류 상태 추가
    const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지 상태 추가

    const handleSaveAllPlans = () => {
        // 전체 추천 항목을 백엔드에 저장하는 함수
        const allItems = {
            username: localStorage.getItem("username"),
            추천된관광지: (recommendations['추천된 관광지'] || []).map(item => item.title),
            추천된숙박: (recommendations['추천된 숙박'] || []).map(item => item.title),
            추천된음식점: (recommendations['추천된 음식점'] || []).map(item => item.title),
        };

        // 백엔드에 저장 요청
        fetch('http://localhost:8086/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // 로그인된 사용자 토큰
            },
            body: JSON.stringify(allItems), // 저장할 데이터
        })
            .then(response => {
                console.log(localStorage.getItem('token'))
                console.log(JSON.stringify(allItems))
                if (!response.ok) {
                    throw new Error('Failed to save plans');
                }

                console.log('All plans saved:'); // 저장 성공 시 로그
                setSuccessMessage('저장되었습니다.'); // 성공 메시지 설정
                return response.json();
            })
            .catch(error => {
                console.error('Error saving plans:', error); // 오류 발생 시 로그
                 setError('저장에 실패했습니다.'); // 오류 메시지 설정
            });
    };

    const fetchRecommendations = () => {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        fetch('http://127.0.0.1:5000/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰이 올바르게 설정되어 있는지 확인
            },
            body: JSON.stringify({
                장소: selectedCity,
                이동수단: selectedTransport,
                일정: selectedStyle,
                카테고리: selectedActivity,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched recommendations:', data);
                setRecommendations(data); // 추천 데이터 설정
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                setError('추천 데이터를 불러오는 데 실패했습니다.'); // 오류 메시지 설정
            });
    };

    useEffect(() => {
        fetchRecommendations(); // 컴포넌트가 마운트될 때 추천 데이터 가져오기
    }, []);

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>추천 여행지</h1>
                <h2>{selectedCity}에서의 추천</h2>
                {error && <p>{error}</p>} {/* 오류 메시지 표시 */}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* 성공 메시지 표시 */}
                {recommendations ? (
                    <div>
                        <h3>추천된 관광지</h3>
                        {recommendations['추천된 관광지'] && recommendations['추천된 관광지'].length > 0 ? (
                            recommendations['추천된 관광지'].map((spot) => (
                                <div key={spot.title} style={{ marginBottom: '20px' }}>
                                    <h4>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${spot.mapy},${spot.mapx}`} target="_blank" rel="noopener noreferrer">
                                            {spot.title}
                                        </a>
                                    </h4>
                                    <p>{spot.address}</p>
                                </div>
                            ))
                        ) : (
                            <p>추천된 관광지가 없습니다.</p>
                        )}
                        <h3>추천된 숙박</h3>
                        {recommendations['추천된 숙박'] && recommendations['추천된 숙박'].length > 0 ? (
                            recommendations['추천된 숙박'].map((accommodation) => (
                                <div key={accommodation.title} style={{ marginBottom: '20px' }}>
                                    <h4>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${accommodation.mapy},${accommodation.mapx}`} target="_blank" rel="noopener noreferrer">
                                            {accommodation.title}
                                        </a>
                                    </h4>
                                    <p>{accommodation.address}</p>
                                </div>
                            ))
                        ) : (
                            <p>추천된 숙박이 없습니다.</p>
                        )}
                        <h3>추천된 음식점</h3>
                        {recommendations['추천된 음식점'] && recommendations['추천된 음식점'].length > 0 ? (
                            recommendations['추천된 음식점'].map((restaurant) => (
                                <div key={restaurant.title} style={{ marginBottom: '20px' }}>
                                    <h4>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.mapy},${restaurant.mapx}`} target="_blank" rel="noopener noreferrer">
                                            {restaurant.title}
                                        </a>
                                    </h4>
                                    <p>{restaurant.address}</p>
                                </div>
                            ))
                        ) : (
                            <p>추천된 음식점이 없습니다.</p>
                        )}
                        <button onClick={handleSaveAllPlans} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            모두 저장하기
                        </button>
                    </div>
                ) : (
                    <p>추천 데이터를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default Recommend;