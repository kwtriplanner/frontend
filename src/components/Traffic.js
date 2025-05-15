import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const MODEL_URL = process.env.REACT_APP_MODEL_URL || 'http://127.0.0.1:5000';

const Traffic = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity } = location.state || {}; // 선택된 도시, 인원수, 동행인, 일정 스타일, 선택된 활동 정보 가져오기
    const [selectedTransport, setSelectedTransport] = React.useState(null); // 선택된 이동수단 상태 추가

    const handleNext = () => {
        // 선택된 데이터 로그
        console.log('Selected Transport:', selectedTransport);
        
        // 백엔드로 데이터 전송
        fetch(`${MODEL_URL}/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                장소: selectedCity, // 선택된 도시
                이동수단: selectedTransport, // 선택된 이동수단
                일정: selectedStyle, // 일정 스타일
                카테고리: selectedActivity, // 선택된 활동
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // 다음 페이지로 이동
            navigate('/recommend', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity, selectedTransport } });
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // 선택된 이동수단이 있을 경우에만 다음으로 이동
        if (!selectedTransport) {
            alert('이동수단을 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
        }
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>어떤 이동수단을 선호하시나요?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>선호하는 이동수단을 선택해주세요</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '20px' }}>
                    {['차량', '대중교통', '도보'].map((transport) => (
                        <button
                            key={transport}
                            onClick={() => setSelectedTransport(transport)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: selectedTransport === transport ? '#d3d3d3' : 'white',
                                width: '100%', // 버튼의 너비를 100%로 설정
                            }}
                        >
                            {transport}
                        </button>
                    ))}
                </div>
                {/* 이전 버튼과 다음 버튼 추가 */}
                <button onClick={() => navigate('/activity', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity } })} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    이전
                </button>
                <button 
                    onClick={() => {
                        console.log('Selected Transport:', selectedTransport); // 선택된 이동수단 로그
                        if (selectedTransport) {
                            navigate('/recommend', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity, selectedTransport } }); // 선택된 이동수단과 함께 다음으로 이동
                        } else {
                            alert('이동수단을 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
                        }
                    }} 
                    style={{ padding: '10px 20px' }}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Traffic;        