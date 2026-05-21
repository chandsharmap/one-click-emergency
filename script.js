// User Database (LocalStorage)
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let userProfiles = [
    {
        name: 'Rahul Sharma',
        aadhaar: 'XXXX XXXX 4587',
        blood: 'O+',
        disease: 'Asthma',
        status: 'Critical Breathing',
        phone: '98765-43210'
    },
    {
        name: 'Priya Singh',
        aadhaar: 'XXXX XXXX 9812',
        blood: 'B+',
        disease: 'BP',
        status: 'High Blood Pressure',
        phone: '98765-43211'
    },
    {
        name: 'Aman Verma',
        aadhaar: 'XXXX XXXX 7771',
        blood: 'A-',
        disease: 'Sugar',
        status: 'Low Sugar Attack',
        phone: '98765-43212'
    },
    {
        name: 'Kavya Joshi',
        aadhaar: 'XXXX XXXX 3390',
        blood: 'AB+',
        disease: 'Heart Disease',
        status: 'Emergency Heart Condition',
        phone: '98765-43213'
    }
];

// Initialize default demo account
function initDemo() {
    if (Object.keys(users).length === 0) {
        users['demo@emergency.com'] = {
            name: 'Demo User',
            email: 'demo@emergency.com',
            password: 'demo123',
            phone: '9876543210',
            family: [],
            medical: null,
            created: new Date().toLocaleString()
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Page Navigation
function openPage(id) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// Authentication - Login
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const btn = document.getElementById('loginBtn');

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    if (users[email] && users[email].password === password) {
        currentUser = { email, name: users[email].name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        btn.innerHTML = 'ACCESSING SYSTEM...';
        btn.style.background = 'linear-gradient(45deg, #00ffcc, #ff0000)';
        setTimeout(() => {
            openPage('dashboardPage');
            btn.innerHTML = 'LOGIN SYSTEM';
            btn.style.background = 'linear-gradient(45deg, #ff0000, #ff4d4d)';
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        }, 1500);
    } else {
        alert('Invalid email or password');
    }
}

// Authentication - Signup
function signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();

    if (!name || !email || !password || !phone) {
        alert('Please fill all fields');
        return;
    }

    if (users[email]) {
        alert('Email already registered');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    users[email] = {
        name,
        email,
        password,
        phone,
        family: [],
        medical: null,
        created: new Date().toLocaleString()
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully! Please login.');
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupPhone').value = '';
    openPage('loginPage');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        openPage('loginPage');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    }
}

// Family Management
function saveFamily() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const name = document.getElementById('fname').value.trim();
    const number = document.getElementById('fnumber').value.trim();
    const relation = document.getElementById('frelation').value.trim();

    if (!name || !number || !relation) {
        alert('Please fill all fields');
        return;
    }

    if (!/^\d{10}$/.test(number)) {
        alert('Please enter valid 10-digit mobile number');
        return;
    }

    users[currentUser.email].family.push({
        name,
        number,
        relation,
        savedAt: new Date().toLocaleString()
    });

    localStorage.setItem('users', JSON.stringify(users));
    alert('Family member added successfully');
    document.getElementById('fname').value = '';
    document.getElementById('fnumber').value = '';
    document.getElementById('frelation').value = '';
    displayFamily();
}

function displayFamily() {
    if (!currentUser) return;

    const family = users[currentUser.email].family;
    const list = document.getElementById('familyList');
    list.innerHTML = '';

    if (family.length === 0) {
        list.innerHTML = '<p class="opacity-70" style="text-align:center;">No family members added yet</p>';
        return;
    }

    family.forEach((member, index) => {
        list.innerHTML += `
            <div style="background:rgba(255,0,0,0.08); padding:15px; border-radius:12px; margin-bottom:10px;">
                <p><b>${member.name}</b> (${member.relation})</p>
                <p class="opacity-70">Phone: ${member.number}</p>
                <button class="btn" style="font-size:12px; padding:8px; margin-top:8px;" onclick="removeFamily(${index})">Remove</button>
            </div>
        `;
    });
}

function removeFamily(index) {
    if (confirm('Remove this family member?')) {
        users[currentUser.email].family.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayFamily();
    }
}

// Medical Status
function saveMedical() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const name = document.getElementById('patientName').value.trim();
    const blood = document.getElementById('bloodGroup').value;
    const condition = document.getElementById('medicalCondition').value;

    if (!name) {
        alert('Please enter patient name');
        return;
    }

    users[currentUser.email].medical = {
        name,
        blood,
        condition,
        savedAt: new Date().toLocaleString()
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('Medical status saved successfully');
    openPage('dashboardPage');
}

// Ambulance System
function findAmbulance() {
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = 'Searching...';

    setTimeout(() => {
        document.getElementById('ambulanceResult').classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = 'Search Ambulance';
    }, 3000);
}

function acceptAmbulance() {
    document.getElementById('ambulanceResult').classList.add('hidden');
    document.getElementById('ambulanceMove').classList.remove('hidden');
    
    if (currentUser && users[currentUser.email].family.length > 0) {
        const familyPhone = users[currentUser.email].family[0].number;
        console.log(`Notification sent to ${familyPhone}`);
    }
}

function viewMap() {
    alert('Opening Google Maps with nearby hospital locations...');
}

// Blood Bank
function showBloodAnimation() {
    const select = document.getElementById('bloodSelect');
    if (select.value !== 'Select Blood Group') {
        document.getElementById('bloodAnim').classList.remove('hidden');
        document.getElementById('selectedBlood').innerText = select.value;
    }
}

function requestBlood() {
    const blood = document.getElementById('bloodSelect').value;
    if (blood !== 'Select Blood Group') {
        alert(`Blood request for ${blood} has been submitted.\n\nNearby blood banks notified.\nETA: 15-20 minutes`);
        document.getElementById('bloodSelect').value = 'Select Blood Group';
        document.getElementById('bloodAnim').classList.add('hidden');
        openPage('dashboardPage');
    }
}

// Emergency SOS System
function activateSOS() {
    document.getElementById('sosActions').classList.remove('hidden');
    console.log('SOS ACTIVATED');
    
    if (currentUser && users[currentUser.email].family.length > 0) {
        users[currentUser.email].family.forEach(member => {
            console.log(`Emergency alert sent to ${member.name} (${member.number})`);
        });
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('lat').innerText = lat.toFixed(4);
            document.getElementById('lon').innerText = lon.toFixed(4);
        });
    }
}

function showCall() {
    document.getElementById('callUI').classList.remove('hidden');
    
    console.log('Connecting to Emergency Services (911/112)...');
    const random = userProfiles[Math.floor(Math.random() * userProfiles.length)];
    
    setTimeout(() => {
        alert(`Call connected to Emergency Service\nOperator: ${random.name}\nYour location has been shared`);
    }, 2000);
}

function showDetails() {
    const box = document.getElementById('profileBox');
    box.classList.remove('hidden');

    if (!currentUser || !users[currentUser.email].medical) {
        box.innerHTML = '<p class="opacity-70">No medical details saved. Please update from dashboard.</p>';
        return;
    }

    const medical = users[currentUser.email].medical;
    box.innerHTML = `
        <h2 class="text-2xl text-red-400 mb-4">Your Emergency Details</h2>
        <p class="mb-2"><b>Name:</b> ${medical.name}</p>
        <p class="mb-2"><b>Blood Group:</b> ${medical.blood}</p>
        <p class="mb-2"><b>Medical Condition:</b> ${medical.condition}</p>
        <p class="mb-2"><b>Status:</b> <span class="text-green-400">Ready</span></p>
        <hr style="opacity:0.2; margin:15px 0;">
        <h3 class="mb-2">Family Contacts:</h3>
        ${users[currentUser.email].family.length > 0 
            ? users[currentUser.email].family.map(f => `<p class="opacity-70">Phone: ${f.name}: ${f.number}</p>`).join('')
            : '<p class="opacity-70">No family contacts added</p>'
        }
    `;
}

function sendLocation() {
    const box = document.getElementById('locationBox');
    box.classList.remove('hidden');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('lat').innerText = lat.toFixed(4);
            document.getElementById('lon').innerText = lon.toFixed(4);
            
            console.log(`Location shared: ${lat}, ${lon}`);
            console.log('Shared with: Emergency Services, Family Members, Nearby Hospital');
        });
    }
}

function closeLocation() {
    document.getElementById('locationBox').classList.add('hidden');
}

function endCall() {
    document.getElementById('callUI').classList.add('hidden');
    alert('Emergency call ended');
}

// Initialize on page load
window.addEventListener('load', () => {
    initDemo();
    if (currentUser) {
        openPage('dashboardPage');
    } else {
        openPage('loginPage');
    }
});

// Auto-load family list when opening family page
document.addEventListener('click', (e) => {
    if (e.target.textContent.includes('Family Details')) {
        setTimeout(displayFamily, 100);
    }
});
