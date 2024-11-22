import React from 'react';
import { useNavigate } from 'react-router-dom';

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

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f8f8' }}>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <h2 style={{ margin: 0 }}>Triplanner</h2>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
                <button onClick={handleHomeClick} style={{ marginRight: '10px' }}>홈</button>
                <button onClick={handleMyPlanClick} style={{ marginRight: '10px' }}>내 일정</button>
                <button onClick={handleSettingsClick}>설정</button>
            </div>
        </nav>
    );
};

export default Navbar; 