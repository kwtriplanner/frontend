import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanContext } from '../components/PlanContext';
import Navbar from './Navbar';

const ReviewModal = ({ isOpen, onClose, onSubmit, itemName }) => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '80%',
                maxWidth: '500px'
            }}>
                <h2>{itemName} 리뷰 작성</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label>별점: </label>
                    <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        style={{ padding: '5px', marginLeft: '10px' }}
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{'★'.repeat(num)}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>후기:</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        style={{
                            width: '100%',
                            height: '100px',
                            marginTop: '5px',
                            padding: '8px'
                        }}
                        placeholder="여행 후기를 작성해주세요..."
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#gray',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onSubmit(rating, review)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#2df0b2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyPlan = () => {
    const navigate = useNavigate();
    const { plans, setPlans } = useContext(PlanContext);
    const [loading, setLoading] = useState(true);
    const [expandedPlanId, setExpandedPlanId] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reviews, setReviews] = useState({});

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
                // 서버에서 받아온 데이터의 각 아이템에 고유 ID 부여
                const plansWithItemIds = data.map(plan => ({
                    ...plan,
                    items: plan.items.map((item, index) => ({
                        ...item,
                        id: `${plan.id}_${index}`  // 고유한 ID 생성
                    }))
                }));
                setPlans(plansWithItemIds);
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

    const handleReviewClick = (item) => {
        setSelectedItem(item);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = (rating, reviewText) => {
        const username = localStorage.getItem('username');
        const newReview = {
            username,
            rating,
            review: reviewText,
            date: new Date().toLocaleDateString('ko-KR')
        };

        // 서버에 리뷰 저장 요청
        fetch(`http://localhost:8086/api/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                itemId: selectedItem.id,
                username: username,
                rating: rating,
                content: reviewText,
                createdAt: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save review');
            }
            setReviews(prev => ({
                ...prev,
                [selectedItem.id]: newReview
            }));
        })
        .catch(error => {
            console.error('Error saving review:', error);
        });

        setIsReviewModalOpen(false);
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
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {plan.items.map((item) => (
                                            <li key={item.id || item.title || item} style={{
                                                border: '1px solid #eee',
                                                margin: '10px 0',
                                                padding: '10px',
                                                borderRadius: '5px'
                                            }}>
                                                {item.title ? (
                                                    <div>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '5px'
                                                        }}>
                                                            <a href={`https://www.google.com/maps/search/?api=1&query=${item.mapy},${item.mapx}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ textDecoration: 'none', color: '#0066cc' }}>
                                                                {item.title}
                                                            </a>
                                                            <button
                                                                onClick={() => handleReviewClick(item)}
                                                                style={{
                                                                    backgroundColor: '#4CAF50',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    padding: '5px 10px',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                리뷰작성
                                                            </button>
                                                        </div>
                                                        <p style={{ margin: '5px 0', color: '#666' }}>{item.address}</p>
                                                        {reviews[item.id] && (
                                                            <div style={{
                                                                backgroundColor: '#f5f5f5',
                                                                padding: '10px',
                                                                borderRadius: '5px',
                                                                marginTop: '10px'
                                                            }}>
                                                                <p style={{ margin: '5px 0' }}>
                                                                    <strong>작성자:</strong> {reviews[item.id].username}
                                                                </p>
                                                                <p style={{ margin: '5px 0' }}>
                                                                    <strong>별점:</strong> {'★'.repeat(reviews[item.id].rating)}
                                                                </p>
                                                                <p style={{ margin: '5px 0' }}>
                                                                    <strong>후기:</strong> {reviews[item.id].review}
                                                                </p>
                                                                <p style={{ margin: '5px 0', color: '#666' }}>
                                                                    <strong>작성일:</strong> {reviews[item.id].date}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    item
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
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
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                itemName={selectedItem?.title}
            />
        </div>
    );
};

export default MyPlan
