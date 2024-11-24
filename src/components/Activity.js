import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Activity = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity } = location.state || {}; // 선택된 도시, 인원수, 동행인, 일정 스타일, 선택된 활동 정보 가져오기
    const [selectedActivities, setSelectedActivities] = React.useState(selectedActivity || []); // 선택된 활동 상태 추가

    const handleActivityClick = (activity) => {
        setSelectedActivities((prev) => {
            if (prev.includes(activity)) {
                return prev.filter((item) => item !== activity); // 선택 취소
            } else {
                return [...prev, activity]; // 선택 추가
            }
        });
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>어떤 종류의 활동을 선호하시나요?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>선호하는 활동을 선택해주세요(중복가능)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '20px' }}>
                    {['자연', '역사', '체험', '문화', '축제', '쇼핑'].map((activity) => (
                        <button
                            key={activity}
                            onClick={() => handleActivityClick(activity)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: selectedActivities.includes(activity) ? '#d3d3d3' : 'white',
                                width: '100%', // 버튼의 너비를 100%로 설정
                            }}
                        >
                            {activity}
                        </button>
                    ))}
                </div>
                {/* 이전 버튼과 다음 버튼 추가 */}
                <button onClick={() => navigate('/density', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity: selectedActivities } })} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    이전
                </button>
                <button 
                    onClick={() => {
                        if (selectedActivities.length > 0) {
                            navigate('/traffic', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle, selectedActivity: selectedActivities } }); // 선택된 활동과 함께 다음으로 이동
                        } else {
                            alert('활동을 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
                        }
                    }} 
                    className="next-button" // CSS 클래스 추가
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Activity;
