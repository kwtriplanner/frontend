import React, { useState } from 'react';

function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = () => {
        if (isSubmitting) return;
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const userData = {
            name: name,
            username: username,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
        };

        // 백엔드 API 호출 (주석 처리)
        setIsSubmitting(true);
        fetch('http://localhost:8086/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 409) {
                        alert('이미 사용 중인 아이디입니다.');
                    } else {
                        alert('회원가입 실패');
                    }
                    throw new Error('회원가입 실패');
                }
                alert('회원가입이 완료되었습니다.');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });


        // 기존 로컬 스토리지 회원가입 로직
        // localStorage.setItem('user', JSON.stringify(userData));
        // alert('회원가입이 완료되었습니다.');
    };

    return (
        <div>
            <h2>회원가입</h2>
            <label htmlFor="signupName">이름</label>
            <input
                id="signupName"
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupUsername">아이디</label>
            <input
                id="signupUsername"
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupPassword">비밀번호</label>
            <input
                id="signupPassword"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupConfirmPassword">비밀번호 확인</label>
            <input
                id="signupConfirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupEmail">이메일</label>
            <input
                id="signupEmail"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <label htmlFor="signupPhone">핸드폰 번호</label>
            <input
                id="signupPhone"
                type="text"
                placeholder="핸드폰 번호"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ display: 'block', margin: '10px auto' }}
            />
            <button onClick={handleSignup} style={{ margin: '10px auto' }}>가입하기</button>
        </div>
    );
}

export default Signup; 