let isLoggedIn = false;
let users = {};

// 선택된 도시와 인원수를 저장할 변수
let selectedCity = '';
let selectedPersonnel = 0;

// 선택된 동행인을 저장할 변수
let selectedCompanion = '';

// 선택된 일정 스타일을 저장할 변수
let selectedSchedule = '';

// 선택된 활동들을 배열로 저장
let selectedActivities = [];

// 선택된 이동수단을 저장할 변수
let selectedTransport = '';

// 페이지 로드 시 실행되는 초기화 코드
document.addEventListener('DOMContentLoaded', function() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }

    // 로그인 상태 체크 및 네비게이션 바 업데이트
    checkLoginStatusForNav();

    // mypath.html 페이지 체크
    if (window.location.pathname.includes('mypath.html')) {
        const loginStatus = localStorage.getItem('isLoggedIn');
        if (loginStatus !== 'true') {
            showLoginRequired();
            return;
        }
        filterPlans('all');  // 로그인 된 경우에만 일정 표시
    }

    // 기존의 index.html 리다이렉트 처리
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true' && window.location.pathname.includes('index.html')) {
        window.location.href = 'mypath.html';
    }

    // destination.html 페이지 초기화
    if (window.location.pathname.includes('destination.html')) {
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            const cityBox = document.querySelector(`.city-box[onclick*="${savedCity}"]`);
            if (cityBox) {
                cityBox.classList.add('selected');
                selectedCity = savedCity;
            }
        }
    }

    // personnel.html 페이지 초기화
    if (window.location.pathname.includes('personnel.html')) {
        const savedPersonnel = localStorage.getItem('selectedPersonnel');
        if (savedPersonnel) {
            const personnelBox = document.querySelector(`.personnel-box[onclick*="${savedPersonnel}"]`);
            if (personnelBox) {
                personnelBox.classList.add('selected');
                selectedPersonnel = parseInt(savedPersonnel);
            }
        }
    }

    // companion.html 페이지 초기화
    if (window.location.pathname.includes('companion.html')) {
        const savedCompanion = localStorage.getItem('selectedCompanion');
        if (savedCompanion) {
            const companionBox = document.querySelector(`.companion-box[onclick*="${savedCompanion}"]`);
            if (companionBox) {
                companionBox.classList.add('selected');
                selectedCompanion = savedCompanion;
            }
        }
    }

    // schedule.html 페이지 초기화
    if (window.location.pathname.includes('schedule.html')) {
        const savedSchedule = localStorage.getItem('selectedSchedule');
        if (savedSchedule) {
            const scheduleBox = document.querySelector(`.schedule-box[onclick*="${savedSchedule}"]`);
            if (scheduleBox) {
                scheduleBox.classList.add('selected');
                selectedSchedule = savedSchedule;
            }
        }
    }

    // activity.html 페이지 초기화
    if (window.location.pathname.includes('activity.html')) {
        const savedActivities = JSON.parse(localStorage.getItem('selectedActivities') || '[]');
        selectedActivities = savedActivities;
        
        savedActivities.forEach(activity => {
            const box = document.querySelector(`.activity-box[onclick*="${activity}"]`);
            if (box) box.classList.add('selected');
        });
    }
});

// 네비게이션 바의 로그인 상태 체크 및 로그아웃 버튼 표시/숨김
function checkLoginStatusForNav() {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginStatus === 'true') {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
}

// 로그인 폼 표시 함수
function showLoginForm() {
    document.getElementById('authOptions').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

// 회원가입 폼 표시 함수
function goToSignup() {
    document.getElementById('authOptions').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

// 로그인 처리 함수
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //백엔드로
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username] && users[username].password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        alert('로그인 성공!');
        setTimeout(() => {
            window.location.href = 'mypath.html';
        }, 100);
    } else {
        document.getElementById('loginMessage').textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
    }
}

// 회원가입 처리 함수
function signup() {
    const name = document.getElementById('newName').value;
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('newEmail').value;
    const phone = document.getElementById('newPhone').value;
    
    if (password !== confirmPassword) {
        document.getElementById('signupMessage').textContent = '비밀번호가 일치하지 않습니다.';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('signupMessage').textContent = '올바른 이메일 형식이 아닙니다.';
        return;
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('signupMessage').textContent = '올바른 전화번호 형식이 아닙니다. (01012345678)';
        return;
    }

    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    if (users[username]) {
        document.getElementById('signupMessage').textContent = '이미 존재하는 아이디입니다.';
        return;
    }

    users[username] = {
        name: name,
        password: password,
        email: email,
        phone: phone
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('회원가입이 완료되었습니다!');
    showLoginForm();
}

// 로그인 필요 메시지를 보여주는 함수
function showLoginRequired() {
    alert('로그인 후 이용하실 수 있습니다.');
    window.location.href = 'index.html';
}

// 로그인 상태 확인 함수 수정 (홈 버튼용)
function checkLoginStatus() {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
        // 로그인되지 않은 경우
        window.location.href = './index.html';
        return false;
    }
    
    // 모든 선택 상태 초기화
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('selectedPersonnel');
    localStorage.removeItem('selectedCompanion');
    localStorage.removeItem('selectedSchedule');
    localStorage.removeItem('selectedActivities');
    
    // 전역 변수 초기화
    selectedCity = '';
    selectedPersonnel = 0;
    selectedCompanion = '';
    selectedSchedule = '';
    selectedActivities = [];
    
    // destination 페이지로 이동
    window.location.href = './destination.html';
    return true;
}

// 내 경로 페이지로 이동하는 함수 추가
function goToMyPath() {
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus !== 'true') {
        showLoginRequired();
        return;
    }
    
    // 로그인된 상태면 내 경로 페이지로 이동
    window.location.href = 'mypath.html';
}

// 설정 페이지 접근 체크 함수
function checkSettingsAccess() {
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus !== 'true') {
        showLoginRequired();
        return false;
    }
    return true;
}

// 로그아웃 함수
async function logout() {
    // 세션스토리지 토큰 제거
    sessionStorage.removeItem('token');
    
    // 로컬스토리지 데이터 초기화
    localStorage.clear();
    
    // 홈페이지로 리다이렉트
    window.location.href = './index.html';
}

// 여행지 선택 페이지로 이동
function goToDestination() {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
        window.location.href = 'destination.html';
    } else {
        window.location.href = 'index.html';
    }
}

// 프로필 이미지 업로드 처리
function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const currentUser = localStorage.getItem('currentUser');
            localStorage.setItem('profileImage_' + currentUser, e.target.result);
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 사용자 정보 수정
function updateUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    if (!user) {
        alert('사용자 정보를 찾을 수 없습니다.');
        return;
    }

    // 새로운 정보 가져오기
    const newName = document.getElementById('nameInput').value;
    const newEmail = document.getElementById('emailInput').value;
    const newPhone = document.getElementById('phoneInput').value;

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
    }

    // 전화번호 형식 검사
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(newPhone)) {
        alert('올바른 전화번호 형식이 아닙니다. (01012345678)');
        return;
    }

    // 사용자 정보 업데이트
    users[currentUser] = {
        ...user,
        name: newName,
        email: newEmail,
        phone: newPhone
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('프로필이 성공적으로 업데이트되었습다.');
}

// 비밀번호 변경
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    if (!user) {
        alert('사용자 정보를 찾을 수 없습니.');
        return;
    }

    // 현재 비밀번호 확인
    if (user.password !== currentPassword) {
        alert('현재 비밀번호가 일치하지 않습니다.');
        return;
    }

    // 새 비밀번호 확인
    if (newPassword !== confirmNewPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }

    // 비밀번호 업데이트
    users[currentUser].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    alert('비밀번호가 성공적으로 변경되었습니다.');

    // 입력 필드 초기화
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// 계정 삭제
function deleteAccount() {
    if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        const currentUser = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};

        // 사용자 정보 삭제
        delete users[currentUser];
        localStorage.setItem('users', JSON.stringify(users));

        // 프필 이미지 삭제
        localStorage.removeItem('profileImage_' + currentUser);

        // 로그인 상태 초기화
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');

        alert('계정이 성공적으로 삭제되었습니다.');
        window.location.href = 'index.html';
    }
}

// 페이지 로드 시 사용자 정보 표시
document.addEventListener('DOMContentLoaded', function() {
    // 기존의 DOMContentLoaded 이벤트 핸들러 내용 유지
    
    // settings.html 페이지인 경우에만 실행
    if (window.location.pathname.includes('settings.html')) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            const user = users[currentUser];
            
            if (user) {
                // 프로필 정보 표시
                document.getElementById('nameInput').value = user.name || '';
                document.getElementById('emailInput').value = user.email || '';
                document.getElementById('phoneInput').value = user.phone || '';
                
                // 프로필 이미지 표시
                const profileImage = localStorage.getItem('profileImage_' + currentUser);
                if (profileImage) {
                    document.getElementById('profileImage').src = profileImage;
                }
            }
        }

        // 프로필 이미지 업로드 이벤트 리스너 추가
        document.getElementById('imageUpload').addEventListener('change', handleProfileImageUpload);
    }
});

// 여행 일정 필터링
function filterPlans(type) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const plansList = document.getElementById('plansList');
    const noPlans = document.getElementById('noPlans');
    const currentUser = localStorage.getItem('currentUser');
    const plans = JSON.parse(localStorage.getItem('plans_' + currentUser)) || [];

    if (plans.length === 0) {
        plansList.style.display = 'none';
        noPlans.style.display = 'block';
        return;
    }

    plansList.style.display = 'grid';
    noPlans.style.display = 'none';
    plansList.innerHTML = '';

    const today = new Date();
    const filteredPlans = plans.filter(plan => {
        const planDate = new Date(plan.date);
        if (type === 'upcoming') {
            return planDate >= today;
        } else if (type === 'past') {
            return planDate < today;
        }
        return true;
    });

    filteredPlans.forEach(plan => {
        const planCard = createPlanCard(plan);
        plansList.appendChild(planCard);
    });
}

// 여행 일정 카드 생성
function createPlanCard(plan) {
    const div = document.createElement('div');
    div.className = 'plan-card';
    div.innerHTML = `
        <h3>${plan.title}</h3>
        <div class="date">${new Date(plan.date).toLocaleDateString()}</div>
        <div class="destination">${plan.destination}</div>
        <p>${plan.description}</p>
        <div class="plan-actions">
            <button class="edit-btn" onclick="editPlan('${plan.id}')">수정</button>
            <button class="delete-btn" onclick="deletePlan('${plan.id}')">삭제</button>
        </div>
    `;
    return div;
}

// 여행 일정 삭제
function deletePlan(planId) {
    if (confirm('이 여행 일정을 삭제하시겠습니까?')) {
        const currentUser = localStorage.getItem('currentUser');
        const plans = JSON.parse(localStorage.getItem('plans_' + currentUser)) || [];
        const updatedPlans = plans.filter(plan => plan.id !== planId);
        localStorage.setItem('plans_' + currentUser, JSON.stringify(updatedPlans));
        filterPlans('all'); // 목록 새로고침
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('mypath.html')) {
        filterPlans('all');
    }
});

function loadPaths() {
    const pathList = document.getElementById('pathList');
    const noPaths = document.getElementById('noPaths');
    const currentUser = localStorage.getItem('currentUser');
    const paths = JSON.parse(localStorage.getItem('paths_' + currentUser)) || [];

    if (paths.length === 0) {
        pathList.style.display = 'none';
        noPaths.style.display = 'block';
        return;
    }

    pathList.style.display = 'flex';
    noPaths.style.display = 'none';
    pathList.innerHTML = '';

    paths.forEach((path, index) => {
        const pathCard = createPathCard(path, index + 1);
        pathList.appendChild(pathCard);
    });
}

function createPathCard(path, index) {
    const div = document.createElement('div');
    div.className = 'path-card';
    div.innerHTML = `
        <div class="path-title">
            <span>경로 ${index}</span>
            <span class="path-date">${new Date(path.date).toLocaleDateString()}</span>
        </div>
        <div class="path-destinations">${path.destinations.join(' → ')}</div>
        <div class="path-actions">
            <button class="edit-btn" onclick="editPath('${path.id}')">수정</button>
            <button class="delete-btn" onclick="deletePath('${path.id}')">삭제</button>
        </div>
    `;
    return div;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('mypath.html')) {
        const loginStatus = localStorage.getItem('isLoggedIn');
        if (loginStatus !== 'true') {
            showLoginRequired();
            return;
        }
        loadPaths();
    }
});

// 임시 경로 데이터 생성 및 저장
function createSamplePath() {
    const currentUser = localStorage.getItem('currentUser');
    const samplePath = {
        id: 'path1',
        date: new Date().toISOString(),
        destinations: ['강릉', '속초', '춘천'],
        details: {
            릉: {
                places: ['경포대', '정동진', '안목해변'],
                memo: '강릉 커피거리 방문 필수'
            },
            속초: {
                places: ['속초해변', '아바이마을', '설악산'],
                memo: '속초 중앙장에서 회 먹기'
            },
            춘천: {
                places: ['남이섬', '김유정문학마을', '춘천명동'],
                memo: '춘천 닭갈비 맛집 가기'
            }
        }
    };

    // 로컬 스토리지에 저장
    localStorage.setItem('paths_' + currentUser, JSON.stringify([samplePath]));
}

// 경로 수정 함수
function editPath(pathId) {
    const currentUser = localStorage.getItem('currentUser');
    const paths = JSON.parse(localStorage.getItem('paths_' + currentUser)) || [];
    const path = paths.find(p => p.id === pathId);
    
    if (!path) return;

    // 수정 폼 표시
    document.getElementById('editPathForm').style.display = 'block';
    document.getElementById('pathList').style.display = 'none';
    
    // 폼에 현재 데이터 채우기
    let formHTML = `
        <h3>경로 수정</h3>
        <div class="edit-form">
            <div class="destinations-list">
                ${path.destinations.map((dest, index) => `
                    <div class="destination-item">
                        <h4>목적지 ${index + 1}: ${dest}</h4>
                        <div class="places">
                            <label>관광지:</label>
                            <input type="text" id="places_${index}" value="${path.details[dest].places.join(', ')}">
                        </div>
                        <div class="memo">
                            <label>메모:</label>
                            <textarea id="memo_${index}">${path.details[dest].memo}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="form-buttons">
                <button onclick="savePath('${pathId}')">저장</button>
                <button onclick="cancelEdit()">취소</button>
            </div>
        </div>
    `;
    
    document.getElementById('editPathForm').innerHTML = formHTML;
}

// 경로 저장 함수
function savePath(pathId) {
    const currentUser = localStorage.getItem('currentUser');
    const paths = JSON.parse(localStorage.getItem('paths_' + currentUser)) || [];
    const pathIndex = paths.findIndex(p => p.id === pathId);
    
    if (pathIndex === -1) return;

    const path = paths[pathIndex];
    
    // 폼에서 데이터 가져오기
    path.destinations.forEach((dest, index) => {
        const places = document.getElementById(`places_${index}`).value.split(',').map(p => p.trim());
        const memo = document.getElementById(`memo_${index}`).value;
        
        path.details[dest] = {
            places: places,
            memo: memo
        };
    });

    // 저장
    paths[pathIndex] = path;
    localStorage.setItem('paths_' + currentUser, JSON.stringify(paths));
    
    // 목록으로 돌아가기
    loadPaths();
    document.getElementById('editPathForm').style.display = 'none';
    document.getElementById('pathList').style.display = 'flex';
}

// 수정 취소
function cancelEdit() {
    document.getElementById('editPathForm').style.display = 'none';
    document.getElementById('pathList').style.display = 'flex';
}

// 경로 ��드 생성 함수 수정
function createPathCard(path, index) {
    const div = document.createElement('div');
    div.className = 'path-card';
    div.innerHTML = `
        <div class="path-title">
            <span>로 ${index}</span>
            <span class="path-date">${new Date(path.date).toLocaleDateString()}</span>
        </div>
        <div class="path-destinations">
            ${path.destinations.map(dest => `
                <div class="destination-info">
                    <h4>${dest}</h4>
                    <p>관광지: ${path.details[dest].places.join(', ')}</p>
                    <p>메모: ${path.details[dest].memo}</p>
                </div>
            `).join(' → ')}
        </div>
        <div class="path-actions">
            <button class="edit-btn" onclick="editPath('${path.id}')">수정</button>
            <button class="delete-btn" onclick="deletePath('${path.id}')">삭제</button>
        </div>
    `;
    return div;
}

// 페이지 로드 시 실행되는 코드 수정
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('mypath.html')) {
        const loginStatus = localStorage.getItem('isLoggedIn');
        if (loginStatus !== 'true') {
            showLoginRequired();
            return;
        }
        
        // 저장된 경로가 없으면 샘플 데이터 생성
        const currentUser = localStorage.getItem('currentUser');
        const paths = JSON.parse(localStorage.getItem('paths_' + currentUser)) || [];
        if (paths.length === 0) {
            createSamplePath();
        }
        
        loadPaths();
    }
});

// destination.html에서 다음 페이지로 이동
function goToPersonnel() {
    if (!selectedCity) {
        alert('도시를 선택주세요.');
        return;
    }
    
    localStorage.setItem('selectedCity', selectedCity);
    window.location.href = 'personnel.html';
}

// 인원수 선택 함수
function selectPersonnel(number) {
    selectedPersonnel = number;
    document.querySelectorAll('.personnel-box').forEach(box => {
        box.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    localStorage.setItem('selectedPersonnel', number);
}

// 이전 페이지로 이동
function goBack() {
    window.location.href = 'destination.html';
}

// 다음 페이지로 이동
function goToNext() {
    if (!selectedPersonnel) {
        alert('인원를 선택해주세요.');
        return;
    }
    
    // 선택된 인원수 저장
    localStorage.setItem('selectedPersonnel', selectedPersonnel);
    
    // companion.html 페이지로 이동
    window.location.href = 'companion.html';
}

// 도시 선택 함수
function goToCity(cityName) {
    selectedCity = cityName;
    document.querySelectorAll('.city-box').forEach(box => {
        box.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    localStorage.setItem('selectedCity', cityName);
}

// 동행인 선택 함수
function selectCompanion(type) {
    selectedCompanion = type;
    document.querySelectorAll('.companion-box').forEach(box => {
        box.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    localStorage.setItem('selectedCompanion', type);
}

// companion.html의 이전 버튼
function goBack() {
    window.location.href = 'personnel.html';
}

// companion.html의 다음 튼
function goToNext() {
    if (!selectedCompanion) {
        alert('동행인을 선택해주세요.');
        return;
    }
    localStorage.setItem('selectedCompanion', selectedCompanion);
    window.location.href = 'schedule.html';
}

// 인원수 선택 페이지(personnel.html)의 다음 버튼 함수
function goToCompanion() {
    if (!selectedPersonnel) {
        alert('인원수를 선택해주세요.');
        return;
    }
    localStorage.setItem('selectedPersonnel', selectedPersonnel);
    window.location.href = 'companion.html';
}

// 동행인 선택 페이지(companion.html)의 다음 버튼 함수
function goToNextFromCompanion() {
    if (!selectedCompanion) {
        alert('동행인을 선택해주세요.');
        return;
    }
    localStorage.setItem('selectedCompanion', selectedCompanion);
    window.location.href = 'schedule.html';
}

// 인원수 선택 페이지의 이전 버튼 함수
function goBackToDestination() {
    window.location.href = 'destination.html';
}

// 일정 스타일 선택 함수
function selectSchedule(type) {
    selectedSchedule = type;
    document.querySelectorAll('.schedule-box').forEach(box => {
        box.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    localStorage.setItem('selectedSchedule', type);
}

// schedule.html의 이전 버튼
function goBackToCompanion() {
    window.location.href = 'companion.html';
}

// schedule.html의 다음 버튼
function goToNextFromSchedule() {
    if (!selectedSchedule) {
        alert('일정 스타일을 선택해주세요.');
        return;
    }
    localStorage.setItem('selectedSchedule', selectedSchedule);
    window.location.href = 'activity.html';
}

// 활동 선택 함수 수정
function selectActivity(type) {
    const clickedBox = event.currentTarget;
    
    // 이미 선택된 활동이면 선택 해제
    if (selectedActivities.includes(type)) {
        selectedActivities = selectedActivities.filter(item => item !== type);
        clickedBox.classList.remove('selected');
    } 
    // 새로운 활동 선택
    else {
        selectedActivities.push(type);
        clickedBox.classList.add('selected');
    }
    
    // 선택된 활동들 저장
    travelPlan = JSON.parse(localStorage.getItem('travelPlan') || '{}');
    travelPlan.activities = selectedActivities;
    localStorage.setItem('travelPlan', JSON.stringify(travelPlan));
}

// activity.html의 이전 버튼
function goBackToSchedule() {
    window.location.href = 'schedule.html';
}

// activity.html 다음 버튼 함수 수정
function goToNextFromActivity() {
    if (selectedActivities.length === 0) {
        alert('하나 이상의 활동을 선택해주세요.');
        return;
    }
    localStorage.setItem('selectedActivities', JSON.stringify(selectedActivities));
    window.location.href = 'transport.html';
}

// 페이지 로드 시 이전 선택 상태 복원
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('activity.html')) {
        const savedActivities = JSON.parse(localStorage.getItem('selectedActivities') || '[]');
        selectedActivities = savedActivities;
        
        // 저장된 선택 상태 표시
        savedActivities.forEach(activity => {
            const box = document.querySelector(`.activity-box[onclick*="${activity}"]`);
            if (box) box.classList.add('selected');
        });
    }
});

// companion.html 페이지 로드 시 실행될 코드
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('companion.html')) {
        const selectedPersonnel = parseInt(localStorage.getItem('selectedPersonnel'));
        
        // '혼자' 옵션에 해당하는 박스
        const aloneBox = document.querySelector('.companion-box[onclick*="alone"]');
        
        if (selectedPersonnel === 1) {
            // 1명 선택 시: '혼자' 옵션만 활성화
            document.querySelectorAll('.companion-box').forEach(box => {
                if (!box.getAttribute('onclick').includes('alone')) {
                    disableCompanionBox(box);
                }
            });
        } else {
            // 2명 이상 선택 시: '혼자' 옵션 비활성화
            if (aloneBox) {
                disableCompanionBox(aloneBox);
            }
        }
    }
});

// 동행인 박스 비활성화 함수
function disableCompanionBox(box) {
    box.style.backgroundColor = '#e0e0e0';
    box.style.color = '#999';
    box.style.cursor = 'not-allowed';
    box.onclick = null; // 클릭 이벤트 제거
    box.classList.add('disabled');
}

// 동행인 선택 함수 수정
function selectCompanion(type) {
    const clickedBox = event.currentTarget;
    
    // 비활성화된 박스는 선택 불가
    if (clickedBox.classList.contains('disabled')) {
        return;
    }

    selectedCompanion = type;
    document.querySelectorAll('.companion-box').forEach(box => {
        if (!box.classList.contains('disabled')) {
            box.classList.remove('selected');
        }
    });
    clickedBox.classList.add('selected');
    localStorage.setItem('selectedCompanion', type);
}

// 이동수단 선택 함수
function selectTransport(type) {
    selectedTransport = type;
    // 이전 선택 제거
    document.querySelectorAll('.transport-box').forEach(box => {
        box.classList.remove('selected');
    });
    // 새로운 선택 표시
    event.currentTarget.classList.add('selected');
    
    // 선택된 이동수단 저장
    localStorage.setItem('selectedTransport', type);
}

// transport.html의 이전 버튼
function goBackToActivity() {
    window.location.href = 'activity.html';
}

// transport.html의 다음 버튼 함수 수정
function goToNextFromTransport() {
    if (!selectedTransport) {
        alert('이동수단을 선택해주세요.');
        return;
    }

    // 모든 선택 데이터 수집
    const travelData = {
        city: localStorage.getItem('selectedCity'),
        personnel: parseInt(localStorage.getItem('selectedPersonnel')),
        companion: localStorage.getItem('selectedCompanion'),
        schedule: localStorage.getItem('selectedSchedule'),
        activities: JSON.parse(localStorage.getItem('selectedActivities')),
        transport: localStorage.getItem('selectedTransport')
    };

    // 모든 필수 데이터가 있지 확인
    if (!validateTravelData(travelData)) {
        alert('필요한 모든 정보가 선택되지 않았습니다.');
        return;
    }

    // 백엔드로 데이터 전송
    sendTravelDataToBackend(travelData);
}

// 데이터 유효성 검사 함수
function validateTravelData(data) {
    return (
        data.city &&
        data.personnel > 0 &&
        data.companion &&
        data.schedule &&
        data.activities.length > 0 &&
        data.transport
    );
}

// 백엔드로 데이터 전송하는 함수
async function sendTravelDataToBackend(data) {
    try {
        const response = await fetch('YOUR_BACKEND_API_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 필요한 경우 인증 토큰 추가
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const result = await response.json();
        
        // 성공적으로 전송됐을 때
        if (result.success) {
            // 모든 선택 데이터 초기화
            clearAllSelections();
            
            // 다음 페이지로 이동 또는 결과 표시
            // window.location.href = 'result.html';
            console.log('데이터 전송 성공:', result);
        } else {
            alert('데이터 전송에 실패했습니다. 다시 시도해주세요.');
        }

    } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 모든 택 데이터 초기화 함수
function clearAllSelections() {
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('selectedPersonnel');
    localStorage.removeItem('selectedCompanion');
    localStorage.removeItem('selectedSchedule');
    localStorage.removeItem('selectedActivities');
    localStorage.removeItem('selectedTransport');
    
    // 전역 변수도 초기화
    selectedCity = '';
    selectedPersonnel = 0;
    selectedCompanion = '';
    selectedSchedule = '';
    selectedActivities = [];
    selectedTransport = '';
}

// 전송될 데이터 형식 예시:
/*
{
    "city": "Gangneung",
    "personnel": 2,
    "companion": "couple",
    "schedule": "relaxed",
    "activities": ["nature", "culture", "shopping"],
    "transport": "car"
}
*/

// 페이지 로드 시 초기화
window.onload = function() {
    if (window.location.pathname.includes('transport.html')) {
        // 이전 선택 초기화
        document.querySelectorAll('.transport-box').forEach(box => {
            box.classList.remove('selected');
        });
        localStorage.removeItem('selectedTransport');
        selectedTransport = '';
    }
}

// 로그인 처리
document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // 로그인 성공
            document.getElementById('loginMessage').textContent = '로그인 성공!';
            sessionStorage.setItem('token', data.accessToken);
            sessionStorage.setItem('username', data.username);
            // destination.html 페이지로 리다이렉트
            window.location.href = '/destination.html';
        } else {
            // 로그인 실패
            document.getElementById('loginMessage').textContent = data.message || '로그인 실패';
        }
    } catch (error) {
        document.getElementById('loginMessage').textContent = '서버 오류가 발생했습니다.';
    }
});

// 회원가입 처리
document.getElementById('signupFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: ["user"]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // 회원가입 성공
            document.getElementById('signupMessage').textContent = '회원가입 성공!';
            setTimeout(() => {
                showLoginForm(); // 로그인 폼으로 전환
            }, 1500);
        } else {
            // 회원가입 실패
            document.getElementById('signupMessage').textContent = data.message || '회원가입 실패';
        }
    } catch (error) {
        document.getElementById('signupMessage').textContent = '서버 오류가 발생했습니다.';
    }
});

// 로그아웃 처리
async function logout() {
    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // 로그아웃 성공
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            window.location.href = '/index.html';
        } else {
            alert('로그아웃 실패');
        }
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = './index.html';
    }
    return token;
}

// 홈 버튼 클릭 처리 함수
function handleHomeClick(event) {
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    
    // 모든 선택 데이터 초기화
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('selectedPersonnel');
    localStorage.removeItem('selectedCompanion');
    localStorage.removeItem('selectedSchedule');
    localStorage.removeItem('selectedActivities');
    
    // 전역 변수도 초기화
    if (typeof selectedCity !== 'undefined') selectedCity = '';
    if (typeof selectedPersonnel !== 'undefined') selectedPersonnel = 0;
    if (typeof selectedCompanion !== 'undefined') selectedCompanion = '';
    if (typeof selectedSchedule !== 'undefined') selectedSchedule = '';
    if (typeof selectedActivities !== 'undefined') selectedActivities = [];
    
    if (token) {
        window.location.href = './destination.html';
    } else {
        window.location.href = './index.html';
    }
}