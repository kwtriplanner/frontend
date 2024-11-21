import React, { useState } from 'react';

function Signup() {
    const [signupName, setSignupName] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');

    const handleSignup = () => {
        if (signupPassword !== signupConfirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const userData = {
            name: signupName,
            username: signupUsername,
            password: signupPassword,
            email: signupEmail,
            phone: signupPhone,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        alert('회원가입이 완료되었습니다.');
    };

    return (
        <div>
            <h2>회원가입</h2>
            <label htmlFor="signupName">이름</label>
            <input
                id="signupName"
                type="text"
                placeholder="이름"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupUsername">아이디</label>
            <input
                id="signupUsername"
                type="text"
                placeholder="아이디"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupPassword">비밀번호</label>
            <input
                id="signupPassword"
                type="password"
                placeholder="비밀번호"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupConfirmPassword">비밀번호 확인</label>
            <input
                id="signupConfirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupEmail">이메일</label>
            <input
                id="signupEmail"
                type="email"
                placeholder="이메일"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupPhone">핸드폰 번호</label>
            <input
                id="signupPhone"
                type="text"
                placeholder="핸드폰 번호"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <button onClick={handleSignup} style={{ margin: '10px auto' }}>가입하기</button>
        </div>
    );
}

export default Signup; 