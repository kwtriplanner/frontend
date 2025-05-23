import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8086';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
    const [groupName, setGroupName] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!groupName.trim()) {
            setMessage('그룹 이름을 입력해주세요');
            return;
        }
        onSubmit(groupName);
    };

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
                <h2>그룹 만들기</h2>
                {message && (
                    <div style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <label>그룹 이름:</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        placeholder="그룹 이름을 입력하세요"
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'gray', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#2df0b2', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        생성
                    </button>
                </div>
            </div>
        </div>
    );
};

const InviteModal = ({ isOpen, onClose, onSubmit, groupId }) => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!username.trim()) {
            setMessage('사용자 아이디를 입력해주세요');
            return;
        }
        onSubmit(username, groupId);
    };

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
                <h2>그룹 초대</h2>
                {message && (
                    <div style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <label>초대할 사용자 아이디:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        placeholder="사용자 아이디를 입력하세요"
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'gray', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#2df0b2', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        초대
                    </button>
                </div>
            </div>
        </div>
    );
};

const InviteListModal = ({ isOpen, onClose, invites, onAccept, onReject }) => {
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
                maxWidth: '500px',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <h2>초대 목록</h2>
                {invites.length === 0 ? (
                    <p>받은 초대가 없습니다</p>
                ) : (
                    console.log('Received invites:', invites) || // ✅ 콘솔 로그 추가   
                    invites.map((invite, index) => ( // ✅ 객체로 구조 분해
                        <div key={index} style={{
                            border: '1px solid #ddd',
                            margin: '10px 0',
                            padding: '15px',
                            borderRadius: '8px'
                        }}>
                            <h3 style={{ margin: 0 }}>{invite.groupName}    </h3>
                            <p>초대자: {invite.inviterUsername}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button 
                                    onClick={() => onAccept(invite.inviteId)}
                                    style={{ 
                                        backgroundColor: '#2df0b2', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '5px 10px', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    수락
                                </button>
                                <button 
                                    onClick={() => onReject(invite.inviteId)}
                                    style={{ 
                                        backgroundColor: '#ff4444', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '5px 10px', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    거절
                                </button>
                            </div>
                        </div>
                    ))
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'gray', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

const GroupPlansModal = ({ isOpen, onClose, groupId, groupName }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const renderPlaceList = (items, category, planIndex) => {
        return items?.map((item, i) => (
            <li key={`${category}-${i}`} style={{ marginBottom: '10px' }}>
                <span>{item.name}</span>
            </li>
        ));
    };

    //특정 그룹의 일정 목록 호출
    useEffect(() => {
        if (isOpen && groupId) {
            fetch(`${BACKEND_URL}/api/plans/groups/${groupId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch group plans');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                setPlans(Array.isArray(data) ? data : [data]);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching group plans:', error);
                setLoading(false);
            });
        }
    }, [isOpen, groupId]);

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
                maxWidth: '800px',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <h2>{groupName} 그룹 일정</h2>
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
                                    margin: '10px 0',
                                    padding: '15px',
                                    borderRadius: '8px'
                                }}>
                                    <h3>일정 {index + 1}</h3>
                                    <ul style={{ textAlign: 'left' }}>
                                        <li><strong>관광지</strong></li>
                                        {renderPlaceList(plan.places?.filter(p => p.type === 'ATTRACTION'), 'attraction', index)}

                                        <li><strong>숙소</strong></li>
                                        {renderPlaceList(plan.places?.filter(p => p.type === 'HOTEL'), 'hotel', index)}

                                        <li><strong>음식점</strong></li>
                                        {renderPlaceList(plan.places?.filter(p => p.type === 'RESTAURANT'), 'restaurant', index)}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'gray', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

const Mygroup = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isInviteListModalOpen, setIsInviteListModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [message, setMessage] = useState('');
    const [invites, setInvites] = useState([]);
    const [isGroupPlansModalOpen, setIsGroupPlansModalOpen] = useState(false);
    const [selectedGroupName, setSelectedGroupName] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = () => {
        fetch(`${BACKEND_URL}/api/groups`, {
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
                const formattedGroups = data.map(group => ({
                    id: group.id,
                    name: group.name
                }));
                setGroups(formattedGroups);
                setLoading(false);
            })
            
            .catch(error => {
                console.error('Error fetching groups:', error);
                setLoading(false);
            });
    };

    //그룹 생성
    const handleCreateGroup = (groupName) => {
        fetch(`${BACKEND_URL}/api/groups/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                groupName: groupName
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create group');
            }
            return response.json();
        })
        .then(data => {
            setGroups([...groups, data]);
            setIsCreateModalOpen(false);
            setMessage('그룹이 생성되었습니다');
            setTimeout(() => setMessage(''), 3000);
        })
        .catch(error => {
            console.error('Error creating group:', error);
            setMessage('그룹 생성에 실패했습니다');
            setTimeout(() => setMessage(''), 3000);
        });
    };

    const handleDeleteGroup = (groupId) => {
        if (window.confirm('정말로 이 그룹을 삭제하시겠습니까?')) {
            fetch(`${BACKEND_URL}/api/groups/${groupId}`, {
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
                setMessage('그룹이 삭제되었습니다');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(error => {
                console.error('Error deleting group:', error);
                setMessage('그룹 삭제에 실패했습니다');
                setTimeout(() => setMessage(''), 3000);
            });
        }
    };

    const handleInvite = (username, groupId) => {
        fetch(`${BACKEND_URL}/api/groups/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                requestUsername: username,
                groupId: groupId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send invitation');
            }
            setIsInviteModalOpen(false);
            setMessage('초대가 전송되었습니다');
            setTimeout(() => setMessage(''), 3000);
        })
        .catch(error => {
            console.error('Error sending invitation:', error);
            setMessage('초대 전송에 실패했습니다');
            setTimeout(() => setMessage(''), 3000);
        });
    };

    const fetchInvites = () => {
        fetch(`${BACKEND_URL}/api/invite`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch invites');
            }
            return response.json();
        })
        .then(data => {
            setInvites(data);
            setIsInviteListModalOpen(true);
        })
        .catch(error => {
            console.error('Error fetching invites:', error);
            setMessage('초대 목록을 불러오는데 실패했습니다');
            setTimeout(() => setMessage(''), 3000);
        });
    };

    const handleInviteResponse = (inviteId, status) => {
        console.log('Responding to invite:', inviteId, status);
        fetch(`${BACKEND_URL}/api/invite/${inviteId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ status: status }) // ✅ inviteId는 URL 경로로 전달
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to respond to invitation');
            return response.json(); // ✅ JSON 파싱
        })
        .then(data => {
            // ✅ 객체 배열 필터링 방식 변경
            setInvites(prevInvites => 
                prevInvites.filter(invite => invite.inviteId !== inviteId)
            );
            setMessage(status === 'accept' 
                ? '초대를 수락했습니다' 
                : '초대를 거절했습니다'
            );
            setTimeout(() => setMessage(''), 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            setMessage('초대 응답에 실패했습니다');
            setTimeout(() => setMessage(''), 3000);
        });
    };
    

    return (
        <div>
            <h1>내 그룹</h1>
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
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => {
                                                setSelectedGroupId(group.id);
                                                setIsInviteModalOpen(true);
                                            }}
                                            style={{ 
                                                backgroundColor: '#2196F3', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '5px', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            초대
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedGroupId(group.id);
                                                setSelectedGroupName(group.name);
                                                setIsGroupPlansModalOpen(true);
                                            }}
                                            style={{ 
                                                backgroundColor: '#4CAF50', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '5px', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            일정 보기
                                        </button>
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
                                </div>
                                <p>그룹 이름: {group.name}</p>
                                <p>그룹 ID: {group.id}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button 
                    onClick={() => setIsCreateModalOpen(true)} 
                    style={{ 
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
                <button 
                    onClick={fetchInvites} 
                    style={{ 
                        backgroundColor: '#2196F3', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    초대 목록 확인
                </button>
            </div>
            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateGroup}
            />
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSubmit={handleInvite}
                groupId={selectedGroupId}
            />
            <InviteListModal
                isOpen={isInviteListModalOpen}
                onClose={() => setIsInviteListModalOpen(false)}
                invites={invites}
                onAccept={(inviteId) => handleInviteResponse(inviteId, 'accept')}
                onReject={(inviteId) => handleInviteResponse(inviteId, 'reject')}
            />
            <GroupPlansModal
                isOpen={isGroupPlansModalOpen}
                onClose={() => setIsGroupPlansModalOpen(false)}
                groupId={selectedGroupId}
                groupName={selectedGroupName}
            />
        </div>
    );
};

export default Mygroup;