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
        // 기존의 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // 루트 경로('/')로 이동
        navigate('/');
    };

    const handleLogin = () => {
        // 로그인 페이지로 이동
        navigate('/login');
    };

    // localStorage에서 토큰 여부 확인
    const isLoggedIn = !!localStorage.getItem('token');

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
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ marginRight: '10px' }}>로그아웃</button>
                ) : (
                    <button onClick={handleLogin} style={{ marginRight: '10px' }}>로그인</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
