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
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const handleSaveAllPlans = () => {
        // 전체 추천 항목을 백엔드에 저장하는 함수
        const allItems = {
            places: [
                ...recommendations['추천된 관광지'].map(item => ({
                    name: item.title,
                    type: "ATTRACTION"
                })),
                ...recommendations['추천된 숙박'].map(item => ({
                    name: item.title,
                    type: "HOTEL"
                })),
                ...recommendations['추천된 음식점'].map(item => ({
                    name: item.title,
                    type: "RESTAURANT"
                }))
            ]
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
                setShowSaveModal(false);
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

    // 내 그룹 목록 불러오기
    const fetchGroups = () => {
        fetch('http://localhost:8086/api/groups', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                const formattedGroups = data.map(group => ({
                    id: group.id,
                    name: group.name
                }));
                setGroups(formattedGroups);
            })
            .catch(error => {
                setError('그룹 목록을 불러오지 못했습니다.');
            });
    };

    // 그룹에 저장
    const handleSaveToGroup = (groupId) => {
        const allItems = {
            places: [
                ...recommendations['추천된 관광지'].map(item => ({
                    name: item.title,
                    type: "ATTRACTION"
                })),
                ...recommendations['추천된 숙박'].map(item => ({
                    name: item.title,
                    type: "HOTEL"
                })),
                ...recommendations['추천된 음식점'].map(item => ({
                    name: item.title,
                    type: "RESTAURANT"
                }))
            ]
        };
        // 1. 내 일정에 저장
        fetch('http://localhost:8086/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(allItems),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save plans');
                return response.json();
            })
            .then(plan => {
                console.log('그룹에 저장');
                // 2. 그룹에 저장
                return fetch(`http://localhost:8086/api/plans/groups/${groupId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ planId: plan.planId }),
                });
            })
            .then(response => {
                console.log('Saved to group:', response);
                if (!response.ok) throw new Error('Failed to save plan to group');
                setSuccessMessage('그룹에 저장되었습니다.');
                setShowGroupModal(false);
                setShowSaveModal(false);
            })
            .catch(error => {
                setError('그룹 저장에 실패했습니다.');
            });
    };

    // 모달 UI
    const SaveModal = () => (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', padding: 30, borderRadius: 10, minWidth: 250, textAlign: 'center'
            }}>
                <h3>저장 방식을 선택하세요</h3>
                <button
                    style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={handleSaveAllPlans}
                >
                    내 일정에 저장하기
                </button>
                <button
                    style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => {
                        fetchGroups();
                        setShowGroupModal(true);
                    }}
                >
                    내 그룹에 저장하기
                </button>
                <div>
                    <button
                        style={{ marginTop: 20, background: 'gray', color: 'white', border: 'none', borderRadius: 5, padding: '5px 15px', cursor: 'pointer' }}
                        onClick={() => setShowSaveModal(false)}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );

    const GroupModal = () => (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
            <div style={{
                background: 'white', padding: 30, borderRadius: 10, minWidth: 300, textAlign: 'center'
            }}>
                <h3>그룹 선택</h3>
                {groups.length === 0 ? (
                    <p>가입된 그룹이 없습니다.</p>
                ) : (
                    groups.map(group => (
                        <div key={group.id} style={{ margin: '10px 0' }}>
                            <button
                                style={{ padding: '10px 20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                onClick={() => handleSaveToGroup(group.id)}
                            >
                                {group.name}에 저장
                            </button>
                        </div>
                    ))
                )}
                <div>
                    <button
                        style={{ marginTop: 20, background: 'gray', color: 'white', border: 'none', borderRadius: 5, padding: '5px 15px', cursor: 'pointer' }}
                        onClick={() => setShowGroupModal(false)}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        fetchRecommendations(); // 컴포넌트가 마운트될 때 추천 데이터 가져오기
    }, []);

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>추천 여행지</h1>
                <h2>{selectedCity}에서의 추천</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 표시 */}
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
                        <button
                            onClick={() => { setShowSaveModal(true); setShowGroupModal(false); }}
                            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            모두 저장하기
                        </button>
                    </div>
                ) : (
                    <p>추천 데이터를 불러오는 중입니다...</p>
                )}
            </div>
            {showSaveModal && <SaveModal />}
            {showGroupModal && <GroupModal />}
        </div>
    );
};

export default Recommend;