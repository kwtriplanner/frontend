import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import { PlanContext } from '../components/PlanContext'; // PlanContext 가져오기
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const MyPlan = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const { plans, setPlans } = useContext(PlanContext); // Context에서 plans 가져오기
    const [editingPlanIndex, setEditingPlanIndex] = useState(null); // 수정 중인 일정 인덱스 상태
    const [editedItems, setEditedItems] = useState([]); // 수정된 항목 상태

    // 컴포넌트가 마운트될 때 localStorage에서 저장된 일정을 불러오기
    useEffect(() => {
        const savedPlans = JSON.parse(localStorage.getItem('plans')) || [];
        setPlans(savedPlans);
    }, [setPlans]);

    // plans가 변경될 때마다 localStorage에 저장하기
    useEffect(() => {
        localStorage.setItem('plans', JSON.stringify(plans));
    }, [plans]);

    const handleEdit = (index) => {
        setEditingPlanIndex(index); // 수정할 일정 인덱스 설정
        setEditedItems(plans[index].items); // 해당 일정의 항목 복사
    };

    const handleDeleteItem = (itemIndex) => {
        const newItems = editedItems.filter((_, i) => i !== itemIndex); // 삭제할 항목 제외
        setEditedItems(newItems); // 수정된 항목 상태 업데이트
    };

    const handleCompleteEdit = (index) => {
        // 수정 완료 후, 해당 일정의 항목 업데이트
        const updatedPlan = { ...plans[index], items: editedItems.length > 0 ? editedItems : [] }; // 수정된 항목으로 업데이트
        const newPlans = [...plans]; // 기존 계획 복사
        newPlans[index] = updatedPlan; // 수정된 계획으로 업데이트

        setPlans(newPlans); // Context를 통해 수정된 항목 저장
        setEditingPlanIndex(null); // 수정 모드 종료
    };

    const handleDeletePlan = (index) => {
        const newPlans = plans.filter((_, i) => i !== index); // 삭제할 일정 제외
        setPlans(newPlans); // Context를 통해 수정된 계획 저장
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>내 일정</h1>
                <button 
                    onClick={() => navigate('/destination')} 
                    style={{ marginTop: '20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    일정 만들러 가기
                </button> {/* Destination.js로 이동 */}
                <div style={{ marginTop: '20px' }}>
                    {plans.length === 0 ? (
                        <p>저장된 일정이 없습니다</p>
                    ) : (
                        plans.map((plan, index) => (
                            <div key={index}>
                                <p>{plan.name}</p> {/* 각 일정의 제목 표시 */}
                                {editingPlanIndex === index ? (
                                    <div>
                                        <ul>
                                            {editedItems.map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    {item} 
                                                    <button onClick={() => handleDeleteItem(itemIndex)}>삭제</button> {/* 삭제 버튼 */}
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => handleCompleteEdit(index)}>완료</button> {/* 완료 버튼 */}
                                        <button onClick={() => handleDeletePlan(index)} style={{ marginLeft: '10px', color: 'red' }}>일정 삭제</button> {/* 일정 삭제 버튼 */}
                                    </div>
                                ) : (
                                    <div>
                                        <ul>
                                            {plan.items.map((item, itemIndex) => (
                                                <li key={itemIndex}>{item}</li> // 추가된 항목 표시
                                            ))}
                                        </ul>
                                        <button onClick={() => handleEdit(index)}>수정</button> {/* 수정 버튼 */}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPlan;