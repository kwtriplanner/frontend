import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8086';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 백엔드 API 호출 (주석 처리)

        fetch(`${BACKEND_URL}/api/auth/login`, {
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
                alert('로그인 성공!');
                localStorage.setItem('username', data.username);
                localStorage.setItem('token', data.token);

                console.log(JSON.stringify(data));
                // const ud = JSON.parse(localStorage.getItem('user'));
                // console.log(ud?.username);
                // console.log(ud?.token);
                onLoginSuccess(); // 성공 후 호출
            })
            .catch(error => {
                console.error('Error:', error);
                alert('로그인 중 오류가 발생했습니다.');
            });


        // 기존 로컬 스토리지 로그인 로직(여기부터 삭제)
        // const storedUser = JSON.parse(localStorage.getItem('user'));
        // if (storedUser && storedUser.username === username && storedUser.password === password) {
        //     alert('로그인 성공!');
        //     onLoginSuccess(); // 로그인 성공 시 호출
        // } else {
        //     alert('아이디 또는 비밀번호가 잘못되었습니다.');
        // }
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