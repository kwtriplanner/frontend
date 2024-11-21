import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Persons = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedCount } = location.state || {}; // 선택된 도시와 인원수 정보 가져오기
    const [selectedCountState, setSelectedCount] = React.useState(selectedCount || null); // 선택된 인원수 상태 추가

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>함께 여행할 인원수는?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>인원수를 선택해주세요</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px' }}>
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                        <button
                            key={count}
                            onClick={() => setSelectedCount(count)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer', // 항상 클릭 가능
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: selectedCountState === count ? '#d3d3d3' : 'white', // 선택된 인원수 색상 변경
                            }}
                        >
                            {count}
                        </button>
                    ))}
                </div>
                {/* 이전 버튼과 다음 버튼 추가 */}
                <button onClick={() => navigate('/destination', { state: { selectedCity, selectedCount: selectedCountState } })} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    이전
                </button>
                <button 
                    onClick={() => {
                        if (selectedCountState) {
                            navigate('/companion', { state: { selectedCity, selectedCount: selectedCountState } });
                        } else {
                            alert('인원수를 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
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

export default Persons;