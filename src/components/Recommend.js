import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기
import { PlanContext } from '../components/PlanContext'; // PlanContext 가져오기

const Recommend = () => {
    const location = useLocation(); // 현재 위치 정보 가져오기
    const { selectedCity } = location.state || {}; // 이전 단계에서 전달된 정보 가져오기
    const { addPlan, addItemToPlan, plans } = useContext(PlanContext); // Context에서 addPlan, addItemToPlan, plans 가져오기

    // 더미 데이터 생성
    const dummyData = {
        attractions: [
            {
                name: "설악산 국립공원",
                description: "한국의 대표적인 명산으로, 사계절 내내 아름다운 경관을 자랑합니다.",
                activities: "등산, 케이블카 타기, 자연 관찰"
            },
            {
                name: "속초 해수욕장",
                description: "깨끗한 백사장과 맑은 바다로 유명한 해변입니다.",
                activities: "해수욕, 서핑, 해변 산책"
            },
            {
                name: "영랑호",
                description: "속초 시내와 가까운 자연 호수로, 산책하기 좋은 장소입니다.",
                activities: "자전거 타기, 보트 타기, 피크닉"
            }
        ],
        accommodations: [
            {
                name: "속초 라마다 호텔",
                description: "속초 내에 위치한 4성급 호텔로, 편리한 위치와 좋은 시설을 갖추고 있습니다.",
                features: "피트니스 센터, 수영장, 레스토랑"
            },
            {
                name: "롯데 리조트 속초",
                description: "바다 전망과 다양한 편의시설을 제공하는 고급 리조트입니다.",
                features: "워터파크, 스파, 다양한 레스토랑"
            }
        ],
        restaurants: [
            {
                name: "88생선구이",
                description: "속초에서 유명한 생선구이 전문점입니다.",
                recommendedMenu: "고등어 구이, 임연수어 구이"
            },
            {
                name: "봉포머구리집",
                description: "해산물 요리 전문점으로, 특히 물회가 맛있습니다.",
                recommendedMenu: "물회, 해산물 모둠"
            }
        ]
    };

    const [newPlanName, setNewPlanName] = useState(''); // 새 일정 이름 상태 추가
    const [menuVisible, setMenuVisible] = useState({}); // 메뉴 표시 상태 추가
    const [selectedPlan, setSelectedPlan] = useState(''); // 선택된 기존 일정 상태 추가
    const [message, setMessage] = useState(''); // 저장 메시지 상태 추가
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 추가

    const handleAddToPlan = (item) => {
        if (newPlanName) {
            // 새 일정 만들기
            addPlan(newPlanName, [item]); // 새 일정에 항목 추가
            setNewPlanName(''); // 입력란 초기화
            setMessage('저장되었습니다'); // 메시지 설정
            setShowModal(true); // 모달 표시
        } else if (selectedPlan) {
            // 기존 일정에 항목 추가
            addItemToPlan(selectedPlan, item); // 선택된 기존 일정에 항목 추가
            setMessage('저장되었습니다'); // 메시지 설정
            setShowModal(true); // 모달 표시
        }
    };

    const handleCreateNewPlan = () => {
        if (newPlanName) {
            // 새 일정을 추가할 때, 현재 선택된 항목도 함께 추가
            const itemsToAdd = Object.keys(menuVisible).filter(key => menuVisible[key]);
            addPlan(newPlanName, itemsToAdd); // Context를 통해 새 일정 추가
            setNewPlanName(''); // 입력란 초기화
            setMenuVisible({}); // 메뉴 상태 초기화
            setMessage('저장되었습니다'); // 메시지 설정
            setShowModal(true); // 모달 표시
        }
    };

    const toggleMenu = (name) => {
        setMenuVisible((prev) => ({
            ...prev,
            [name]: !prev[name] // 항목 이름을 키로 사용하여 메뉴 표시 상태 토글
        }));
    };

    const closeModal = () => {
        setShowModal(false); // 모달 닫기
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>추천 여행지</h1>
                <h2>{selectedCity}에서의 추천</h2>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '20px',
                        zIndex: 1000
                    }}>
                        <p>{message}</p>
                        <button onClick={closeModal}>닫기</button>
                    </div>
                )}
                <div style={{ marginTop: '20px', display: 'inline-block', textAlign: 'left' }}>
                    <h3>관광지</h3>
                    {dummyData.attractions.map((attraction) => (
                        <div key={attraction.name} style={{ marginBottom: '20px' }}>
                            <h4>
                                {attraction.name} 
                                <button onClick={() => toggleMenu(attraction.name)}>⋮</button>
                                {menuVisible[attraction.name] && (
                                    <div style={{ display: 'inline-block', marginLeft: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>
                                                <h5>새 일정 만들기</h5>
                                                <input 
                                                    type="text" 
                                                    value={newPlanName} 
                                                    onChange={(e) => setNewPlanName(e.target.value)} 
                                                    placeholder="새 일정 이름" 
                                                    style={{ marginRight: '5px' }} 
                                                />
                                                <button onClick={() => handleAddToPlan(attraction.name)}>저장</button>
                                            </div>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                                <h5>기존 일정에 추가</h5>
                                                <select onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
                                                    <option value="">기존 일정 선택</option>
                                                    {plans.map(plan => (
                                                        <option key={plan.name} value={plan.name}>{plan.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleAddToPlan(attraction.name)}>저장</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </h4>
                            <p>{attraction.description}</p>
                            <p><strong>활동:</strong> {attraction.activities}</p>
                        </div>
                    ))}
                    <h3>숙소</h3>
                    {dummyData.accommodations.map((accommodation) => (
                        <div key={accommodation.name} style={{ marginBottom: '20px' }}>
                            <h4>
                                {accommodation.name} 
                                <button onClick={() => toggleMenu(accommodation.name)}>⋮</button>
                                {menuVisible[accommodation.name] && (
                                    <div style={{ display: 'inline-block', marginLeft: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>
                                                <h5>새 일정 만들기</h5>
                                                <input 
                                                    type="text" 
                                                    value={newPlanName} 
                                                    onChange={(e) => setNewPlanName(e.target.value)} 
                                                    placeholder="새 일정 이름" 
                                                    style={{ marginRight: '5px' }} 
                                                />
                                                <button onClick={() => handleAddToPlan(accommodation.name)}>저장</button>
                                            </div>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                                <h5>기존 일정에 추가</h5>
                                                <select onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
                                                    <option value="">기존 일정 선택</option>
                                                    {plans.map(plan => (
                                                        <option key={plan.name} value={plan.name}>{plan.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleAddToPlan(accommodation.name)}>저장</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </h4>
                            <p>{accommodation.description}</p>
                            <p><strong>특징:</strong> {accommodation.features}</p>
                        </div>
                    ))}
                    <h3>음식점</h3>
                    {dummyData.restaurants.map((restaurant) => (
                        <div key={restaurant.name} style={{ marginBottom: '20px' }}>
                            <h4>
                                {restaurant.name} 
                                <button onClick={() => toggleMenu(restaurant.name)}>⋮</button>
                                {menuVisible[restaurant.name] && (
                                    <div style={{ display: 'inline-block', marginLeft: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>
                                                <h5>새 일정 만들기</h5>
                                                <input 
                                                    type="text" 
                                                    value={newPlanName} 
                                                    onChange={(e) => setNewPlanName(e.target.value)} 
                                                    placeholder="새 일정 이름" 
                                                    style={{ marginRight: '5px' }} 
                                                />
                                                <button onClick={() => handleAddToPlan(restaurant.name)}>저장</button>
                                            </div>
                                            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                                <h5>기존 일정에 추가</h5>
                                                <select onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
                                                    <option value="">기존 일정 선택</option>
                                                    {plans.map(plan => (
                                                        <option key={plan.name} value={plan.name}>{plan.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleAddToPlan(restaurant.name)}>저장</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </h4>
                            <p>{restaurant.description}</p>
                            <p><strong>추천 메뉴:</strong> {restaurant.recommendedMenu}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommend;