import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Mygroup = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 그룹 데이터를 가져오는 API 호출
        fetch(`http://localhost:8086/api/groups`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                return response.json();
            })
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                setLoading(false);
            });
    }, []);

    const handleDeleteGroup = (groupId) => {
        if (window.confirm('정말로 이 그룹을 삭제하시겠습니까?')) {
            fetch(`http://localhost:8086/api/groups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete group');
                }
                setGroups(groups.filter(group => group.id !== groupId));
                alert('그룹이 삭제되었습니다.');
            })
            .catch(error => {
                console.error('Error deleting group:', error);
                alert('그룹 삭제에 실패했습니다.');
            });
        }
    };

    return (
        <div>
            <h1>내 그룹</h1>
            {loading ? (
                <p>그룹을 불러오는 중입니다...</p>
            ) : (
                <div>
                    {groups.length === 0 ? (
                        <p>가입된 그룹이 없습니다</p>
                    ) : (
                        groups.map((group, index) => (
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
                                    <h3 style={{ margin: 0 }}>{group.name}</h3>
                                    <button 
                                        onClick={() => handleDeleteGroup(group.id)} 
                                        style={{ 
                                            backgroundColor: '#ff4444', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '5px 10px', 
                                            borderRadius: '5px', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        그룹 나가기
                                    </button>
                                </div>
                                <p>멤버 수: {group.memberCount}명</p>
                                <p>생성일: {new Date(group.createdAt).toLocaleDateString('ko-KR')}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
            <button 
                onClick={() => navigate('/create-group')} 
                style={{ 
                    marginTop: '20px', 
                    backgroundColor: '#2df0b2', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                }}
            >
                그룹 만들기
            </button>
        </div>
    );
};

export default Mygroup;
