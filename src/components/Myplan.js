import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanContext } from '../components/PlanContext';
import Navbar from './Navbar';
import Mygroup from './Mygroup';

const ReviewModal = ({ isOpen, onClose, onSubmit, placeName, message }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');

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
                <h2>{placeName} 리뷰 작성</h2>
                {message && (
                    <div style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: message.includes('실패') ? '#ffebee' : '#e8f5e9',
                        color: message.includes('실패') ? '#c62828' : '#2e7d32',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
                    <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        취소
                    </button>
                    <button onClick={() => onSubmit(rating, content)} style={{ padding: '8px 16px', backgroundColor: '#2df0b2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
    const [activeTab, setActiveTab] = useState('plans'); // 'plans' 또는 'groups'
    const [loading, setLoading] = useState(true);
    const [expandedPlaces, setExpandedPlaces] = useState({});
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [reviews, setReviews] = useState({});
    const [reviewMessage, setReviewMessage] = useState('');
    const [placeDetails, setPlaceDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8086/api/plans`, {
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
        // 삭제 확인을 위한 창 표시
        if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
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
                // 성공적으로 삭제되면 화면에서도 해당 일정 제거
                setPlans(plans.filter(plan => plan.id !== planId));
                alert('일정이 삭제되었습니다.');
            })
            .catch(error => {
                console.error('Error deleting plan:', error);
                alert('일정 삭제에 실패했습니다.');
            });
        }
    };

    const handlePlaceDetailClick = (planIndex, placeId, placeName) => {
        const expandedKey = `${planIndex}-${placeId}`;
        
        if (expandedPlaces[expandedKey]) {
            // 이미 열려있는 경우 닫기
            setExpandedPlaces(prev => {
                const newState = { ...prev };
                delete newState[expandedKey];
                return newState;
            });
            return;
        }

        // 새로운 장소 세부정보 열기
        setLoadingDetails(true);
        fetch(`http://localhost:8086/api/place/${encodeURIComponent(placeName)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch place details');
            }
            return response.json();
        })
        .then(data => {
            setPlaceDetails(prev => ({
                ...prev,
                [placeName]: data
            }));
            setExpandedPlaces(prev => ({
                ...prev,
                [expandedKey]: true
            }));
            setLoadingDetails(false);
        })
        .catch(error => {
            console.error('Error fetching place details:', error);
            setLoadingDetails(false);
        });
    };

    const handleReviewClick = (place) => {
        setSelectedPlace(place);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = (rating, content) => {
        const username = localStorage.getItem('username');
        
        fetch('http://localhost:8086/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                placeName: selectedPlace,
                username: username,
                rating: rating,
                content: content,
                createdAt: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save review');
            }
            return response.text();
        })
        .then(data => {
            setReviews(prev => ({
                ...prev,
                [selectedPlace]: {
                    rating,
                    content,
                    createdAt: new Date().toLocaleDateString('ko-KR')
                }
            }));
            setReviewMessage('작성되었습니다');
            setTimeout(() => {
                setIsReviewModalOpen(false);
                setReviewMessage('');
            }, 3000);
        })
        .catch(error => {
            console.error('Error saving review:', error);
            setReviewMessage('작성에 실패했습니다');
            setTimeout(() => {
                setReviewMessage('');
            }, 3000);
        });
    };

    const renderPlaceList = (items, category, planIndex) => {
        
        return items?.map((item, i) => {
            const expandedKey = `${planIndex}-${category}-${i}`;
            
            return (
                <li key={`${category}-${i}`} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name}</span>
                        <button
                            onClick={() => handlePlaceDetailClick(planIndex, `${category}-${i}`, item.name)}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            장소 세부정보
                        </button>
                    </div>
                    {expandedPlaces[expandedKey] && (
                        <div style={{ marginTop: '10px', marginLeft: '20px' }}>
                            {loadingDetails ? (
                                <p>세부정보를 불러오는 중...</p>
                            ) : placeDetails[item.name]?.reviews?.length > 0 ? (
                                <div>
                                    <h4>리뷰 목록</h4>
                                    {placeDetails[item.name].reviews.map((review, index) => (
                                        <div key={index} style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            borderRadius: '5px'
                                        }}>
                                            <p><strong>별점:</strong> {'★'.repeat(review.rating)}</p>
                                            <p><strong>내용:</strong> {review.content}</p>
                                            <p><strong>작성일:</strong> {new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>작성된 리뷰가 없습니다.</p>
                            )}
                            <button
                                onClick={() => handleReviewClick(item.name)}
                                style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                리뷰 작성
                            </button>
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>내 일정</h1>
                {reviewMessage && (
                    <div style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: reviewMessage.includes('실패') ? '#ffebee' : '#e8f5e9',
                        color: reviewMessage.includes('실패') ? '#c62828' : '#2e7d32',
                        borderRadius: '5px'
                    }}>
                        {reviewMessage}
                    </div>
                )}
                {loading ? (
                    <p>일정을 불러오는 중입니다...</p>
                ) : (
                    <div>
                        {plans.length === 0 ? (
                            <p>저장된 일정이 없습니다</p>
                        ) : (
                            plans.map((plan, index) => (
                                <div key={index} style={{
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
                                        <p style={{ fontWeight: 'bold', margin: 0 }}>일정 {index + 1}</p>
                                        <button onClick={() => handleDelete(plan.id)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                                            삭제
                                        </button>
                                    </div>
                                    <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                                        <li><strong>관광지</strong></li>
                                        {renderPlaceList(plan.attractions, 'attraction', index)}
                                        <li><strong>숙소</strong></li>
                                        {renderPlaceList(plan.hotels, 'hotel', index)}
                                        <li><strong>음식점</strong></li>
                                        {renderPlaceList(plan.restaurants, 'restaurant', index)}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <button onClick={() => navigate('/destination')} style={{ marginTop: '20px', backgroundColor: '#2df0b2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                    일정 만들러 가기
                </button>
            </div>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setReviewMessage('');
                }}
                onSubmit={handleReviewSubmit}
                placeName={selectedPlace}
                message={reviewMessage}
            />
        </div>
    );
};

export default MyPlan;