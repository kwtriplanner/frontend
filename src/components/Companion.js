import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Companion = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity, selectedCount, selectedCompanion } = location.state || {}; // 선택된 도시와 인원수 정보 가져오기
    const [selectedCompanionState, setSelectedCompanion] = React.useState(selectedCompanion || null); // 선택된 동행인 상태 추가

    return (
        <div>   
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>누구와 함께 가시나요?</h1>
                <h2 style={{ fontSize: '18px', margin: '10px 0' }}>함께 여행할 동행인을 선택해주세요</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px' }}>
                    {['혼자', '가족', '친구', '연인', '부부', '모임(예: 동호회)'].map((companion) => {
                        // 1을 선택했을 때 혼자만 선택 가능
                        const isDisabled = selectedCount !== 1 && companion === '혼자'; // 1이 아닌 경우 혼자 비활성화

                        return (
                            <button
                                key={companion}
                                onClick={() => !isDisabled && setSelectedCompanion(companion)} // 비활성화 상태가 아닐 때만 선택
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '20px',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer', // 비활성화 상태일 때 커서 변경
                                    textAlign: 'center',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                    backgroundColor: selectedCompanionState === companion ? '#d3d3d3' : 'white', // 선택된 동행인 색상 변경
                                    opacity: isDisabled ? 0.5 : 1, // 비활성화 상태일 때 투명도 조정
                                }}
                                disabled={isDisabled} // 비활성화 상태일 때 버튼 비활성화
                            >
                                {companion}
                            </button>
                        );
                    })}
                </div>
                {/* 이전 버튼과 다음 버튼 추가 */}
                <button onClick={() => navigate('/persons', { state: { selectedCity, selectedCount, selectedCompanion: selectedCompanionState } })} style={{ marginRight: '10px', padding: '10px 20px' }}>
                    이전
                </button>
                <button 
                    onClick={() => {
                        if (selectedCompanionState) {
                            navigate('/density', { state: { selectedCity, selectedCount, selectedCompanion: selectedCompanionState } }); // 동행인을 선택한 경우에만 다음으로 이동
                        } else {
                            alert('동행인을 선택해주세요.'); // 선택하지 않았을 때 경고 메시지
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

export default Companion;
