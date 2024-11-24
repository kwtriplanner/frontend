import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 백엔드 API 호출 (주석 처리)
        /*
        fetch('http://localhost:8086/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('로그인 실패');
            }
            return response.json();
        })
        .then(data => {
            // 로그인 성공 시 처리
            if (data.success) {
                alert('로그인 성공!');
                localStorage.setItem('user', JSON.stringify(data.user)); // 사용자 정보를 localStorage에 저장
                onLoginSuccess(); // 로그인 성공 시 호출
            } else {
                alert('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        });
        */

        // 기존 로컬 스토리지 로그인 로직(여기부터 삭제)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            alert('로그인 성공!');
            onLoginSuccess(); // 로그인 성공 시 호출
        } else {
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    }; // 여기까지 삭제

    return (
        <div>
            <label htmlFor="username">아이디</label>
            <input
                id="username"
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="password">비밀번호</label>
            <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
};

export default Login; 