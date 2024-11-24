import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/destination', { state: {} });
    };
    
    const handleMyPlanClick = () => {
        navigate('/myplan');
    };

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    const handleLogout = () => {
        // 로그아웃 로직 (예: localStorage에서 사용자 정보 삭제)
        localStorage.removeItem('user'); // 사용자 정보 삭제
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <nav className="navbar">
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <h2>Triplanner</h2>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
                <button onClick={handleHomeClick} style={{ marginRight: '10px' }}>홈</button>
                <button onClick={handleMyPlanClick} style={{ marginRight: '10px' }}>내 일정</button>
                <button onClick={handleSettingsClick} style={{ marginRight: '10px' }}>설정</button>
                <button onClick={handleLogout}>로그아웃</button>
            </div>
        </nav>
    );
};

export default Navbar; 