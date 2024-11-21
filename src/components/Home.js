import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import Login from './Login'; // 기본 내보내기
import Signup from './Signup'; // 기본 내보내기
import Navbar from './Navbar'; // Navbar 컴포넌트 가져오기

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const navigate = useNavigate(); // navigate 함수 초기화

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowSignup(false); // 회원가입 숨기기
    };

    const handleSignupClick = () => {
        setShowSignup(true);
        setShowLogin(false); // 로그인 숨기기
    };

    const handleLoginSuccess = () => {
        console.log('로그인 성공!'); // 로그인 성공 시 처리할 로직
        navigate('/myplan'); // MyPlan 페이지로 이동
    };

    return (
        <div>
            <Navbar /> {/* 네비게이션 바 추가 */}
            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <h1>Triplanner</h1>
                <p>AI 여행일정 추천</p>
                <div>
                    <button onClick={handleLoginClick}>로그인</button>
                    <button onClick={handleSignupClick}>회원가입</button>
                </div>
                {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
                {showSignup && <Signup />}
            </div>
        </div>
    );
}

export default Home;