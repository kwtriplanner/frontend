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

    return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>내 일정</h1>
                {loading ? (
                    <p>일정을 불러오는 중입니다...</p>
                ) : (
                    <div>
                        {plans.length === 0 ? (
                            <p>저장된 일정이 없습니다</p>
                        ) : (
                            plans.map((plan) => (
                                <div key={plan.id || plan.name} style={{
                                    border: '1px solid #ddd',
                                    margin: '10px',
                                    padding: '15px',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <p style={{ fontWeight: 'bold', margin: 0 }}>{plan.name}</p>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            style={{
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                    <ul>
                                        {plan.items.map((item) => (
                                            <li key={item.id || item.title || item}>
                                                {item.title ? (
                                                    <>
                                                        <a href={`https://www.google.com/maps/search/?api=1&query=${item.mapy},${item.mapx}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                            {item.title}
                                                        </a>
                                                        <p>{item.address}</p>
                                                    </>
                                                ) : (
                                                    item
                                                )}
                                            </li>
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
