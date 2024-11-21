import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기

const MyPlan = () => {
    const navigate = useNavigate(); // navigate 함수 초기화
    const savedPlans = []; // 저장된 일정 배열 (예시로 비어있음)

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>내 일정</h1>
            <button onClick={() => navigate('/destination')}>내 일정 만들러 가기</button> {/* Destination.js로 이동 */}
            <div style={{ marginTop: '20px' }}>
                {savedPlans.length === 0 ? (
                    <p>저장된 일정이 없습니다</p>
                ) : (
                    savedPlans.map((plan) => (
                        <div key={plan.id}>
                            <p>{plan.title}</p> {/* 각 일정의 제목 표시 */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyPlan;
