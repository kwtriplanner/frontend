import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanContext } from '../components/PlanContext';
import Navbar from './Navbar';

const MyPlan = () => {
    const navigate = useNavigate();
    const { plans, setPlans } = useContext(PlanContext);
    const [loading, setLoading] = useState(true);
    const [expandedPlanId, setExpandedPlanId] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        fetch(`http://localhost:8086/api/plans?username=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch plans');
                }
                return response.json();
            })
            .then(data => {
                setPlans(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching plans:', error);
                setLoading(false);
            });
    }, [setPlans]);

    const handleDelete = (planId) => {
        fetch(`http://localhost:8086/api/plans/${planId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete plan');
                }
                setPlans(plans.filter(plan => plan.id !== planId));
            })
            .catch(error => {
                console.error('Error deleting plan:', error);
            });
    };

    const toggleDetails = (planId) => {
        setExpandedPlanId(expandedPlanId === planId ? null : planId);
    };

    return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>내 일정</h1>
                {loading ? (
                    <p>일정을 불러오는 중입니다...</p>
                ) : (
                    plans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ddd',
                                margin: '20px auto',
                                padding: '20px',
                                borderRadius: '8px',
                                width: '80%',
                                textAlign: 'left',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '24px',
                                    }}
                                >
                                    동해 1박 2일 추천 경로
                                </h2>
                                <div>
                                    <button
                                        onClick={() => toggleDetails(plan.id)}
                                        style={{
                                            backgroundColor: '#007BFF',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '10px',
                                        }}
                                    >
                                        {expandedPlanId === plan.id ? '상세 정보 닫기' : '상세 정보'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        style={{
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            {expandedPlanId === plan.id && (
                                <div
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        backgroundColor: '#f9f9f9',
                                        width: '100%',
                                    }}
                                >
                                    <h3>추천 관광지</h3>
                                    <ul>
                                        {plan.attractions.map((attraction, i) => (
                                            <li key={i}>{attraction}</li>
                                        ))}
                                    </ul>
                                    <h3>추천 숙박</h3>
                                    <ul>
                                        {plan.hotels.map((hotel, i) => (
                                            <li key={i}>{hotel}</li>
                                        ))}
                                    </ul>
                                    <h3>추천 음식점</h3>
                                    <ul>
                                        {plan.restaurants.map((restaurant, i) => (
                                            <li key={i}>{restaurant}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <button
                    onClick={() => navigate('/destination')}
                    style={{
                        marginTop: '20px',
                        backgroundColor: '#2df0b2',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    일정 만들러 가기
                </button>
            </div>
        </div>
    );
};

export default MyPlan
