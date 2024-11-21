import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Destination = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity } = location.state || {}; // 선택된 도시 정보 가져오기
    const [city, setCity] = React.useState(selectedCity || null); // 선택된 도시 상태 추가

    const handleSelect = (city) => {
        setCity(city); // 선택된 도시 상태 업데이트
        console.log(`${city} 선택됨`); // 선택된 도시 처리 로직
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>떠나고 싶은 도시는?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>당신의 여행지를 선택해주세요</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px' }}>
                    {['강릉', '동해', '속초', '원주', '춘천', '평창'].map((cityName) => (
                        <button
                            key={cityName}
                            onClick={() => handleSelect(cityName)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                cursor: 'pointer', // 항상 클릭 가능
                                textAlign: 'center',
                                borderRadius: '5px',
                                transition: 'background-color 0.3s',
                                backgroundColor: city === cityName ? '#d3d3d3' : 'white', // 선택된 도시 색상 변경
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = city === cityName ? '#d3d3d3' : 'white')}
                            onKeyDown={(e) => e.key === 'Enter' && handleSelect(cityName)}
                        >
                            {cityName}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => {
                        if (city) {
                            navigate('/persons', { state: { selectedCity: city } }); // 도시를 선택한 경우에만 다음으로 이동
                        } else {
                            alert('도시를 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
                        }
                    }} 
                    style={{ marginTop: '20px', padding: '10px 20px' }}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Destination;
