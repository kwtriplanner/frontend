import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Density = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedCount, selectedCompanion, selectedActivity, selectedStyle } = location.state || {}; // 선택된 도시, 인원수, 동행인, 선택된 활동, 선택된 스타일 정보 가져오기
    const [currentStyle, setCurrentStyle] = React.useState(selectedStyle || null); // 선택된 일정 스타일 상태 추가

    React.useEffect(() => {
        if (selectedStyle) {
            setCurrentStyle(selectedStyle); // 이전 선택된 스타일이 있을 경우 상태 설정
        }
    }, [selectedStyle]);

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>어떤 일정을 선호하시나요?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>선호하는 일정 스타일을 선택해주세요</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <button
                            onClick={() => setCurrentStyle('빽빽한-최대한 많은 곳을 방문하고 싶어요')}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: currentStyle === '빽빽한-최대한 많은 곳을 방문하고 싶어요' ? '#d3d3d3' : 'white',
                                width: '100%', // 버튼의 너비를 100%로 설정
                            }}
                        >
                            빽빽한<br />
                            <span style={{ fontSize: '12px' }}>최대한 많은 곳을 방문하고 싶어요</span>
                        </button>
                    </div>
                    <div style={{ flex: 1 }}>
                        <button
                            onClick={() => setCurrentStyle('널널한-여유롭게 즐기고 싶어요')}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: currentStyle === '널널한-여유롭게 즐기고 싶어요' ? '#d3d3d3' : 'white',
                                width: '100%', // 버튼의 너비를 100%로 설정
                            }}
                        >
                            널널한<br />
                            <span style={{ fontSize: '12px' }}>여유롭게 즐기고 싶어요</span>
                        </button>
                    </div>
                </div>
                {/* 이전 버튼과 다음 버튼 추가 */}
                <button onClick={() => navigate('/companion', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle: currentStyle } })} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    이전
                </button>
                <button 
                    onClick={() => {
                        if (currentStyle) {
                            navigate('/activity', { state: { selectedCity, selectedCount, selectedCompanion, selectedStyle: currentStyle } }); // 선택된 스타일과 함께 다음으로 이동
                        } else {
                            alert('일정 스타일을 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
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

export default Density;
