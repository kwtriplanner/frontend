import React, { useState } from 'react';
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

const Settings = () => {
    const [newUsername, setNewUsername] = useState(''); // 새 아이디 상태
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 상태
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
    const [message, setMessage] = useState(''); // 메시지 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태

    const handleUsernameChange = () => {
        // 아이디 변경 로직
        if (newUsername) {
            // 여기에 아이디 변경 API 호출 로직 추가
            setMessage('아이디가 변경되었습니다.');
            setShowModal(true);
            setNewUsername(''); // 입력란 초기화
        } else {
            setMessage('새 아이디를 입력해주세요.');
            setShowModal(true);
        }
    };

    const handlePasswordChange = () => {
        // 비밀번호 변경 로직
        if (newPassword && newPassword === confirmPassword) {
            // 여기에 비밀번호 변경 API 호출 로직 추가
            setMessage('비밀번호가 변경되었습니다.');
            setShowModal(true);
            setNewPassword(''); // 입력란 초기화
            setConfirmPassword(''); // 입력란 초기화
        } else {
            setMessage('비밀번호가 일치하지 않거나 비밀번호를 입력해주세요.');
            setShowModal(true);
        }
    };

    const handleAccountDeletion = () => {
        // 계정 삭제 로직
        // 여기에 계정 삭제 API 호출 로직 추가
        setMessage('계정이 삭제되었습니다.');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false); // 모달 닫기
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>설정</h1>
                <p>여기에서 설정을 조정할 수 있습니다.</p>

                {/* 아이디 변경 */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>아이디 변경</h3>
                    <input 
                        type="text" 
                        value={newUsername} 
                        onChange={(e) => setNewUsername(e.target.value)} 
                        placeholder="새 아이디" 
                    />
                    <button onClick={handleUsernameChange}>변경</button>
                </div>

                {/* 비밀번호 변경 */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>비밀번호 변경</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="새 비밀번호" 
                            style={{ marginBottom: '10px' }} // 아래 여백 추가
                        />
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="비밀번호 확인" 
                        />
                    </div>
                    <button onClick={handlePasswordChange}>변경</button>
                </div>

                {/* 계정 삭제 */}
                <div>
                    <h3 style={{ color: 'red' }}>계정 삭제</h3>
                    <button onClick={handleAccountDeletion} style={{ color: 'red' }}>계정 삭제</button>
                </div>

                {/* 모달 메시지 */}
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
            </div>
        </div>
    );
};

export default Settings;
