import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            alert('로그인 성공!');
            onLoginSuccess(); // 로그인 성공 시 호출
        } else {
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

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