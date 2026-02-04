/**
 * API Testing Script
 * Run this after starting the server to test all endpoints
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let adminToken = '';
let hrToken = '';
let userToken = '';

// Test data
const testAdmin = {
    firstName: 'Test',
    lastName: 'Admin',
    username: 'testadmin',
    email: 'testadmin@company.com',
    password: 'admin123',
    role: 'IT_ADMIN',
    department: 'IT Operations'
};

const testHR = {
    firstName: 'Test',
    lastName: 'HR',
    username: 'testhr',
    email: 'testhr@company.com',
    password: 'hr123',
    role: 'HR_MANAGER',
    department: 'Human Resources'
};

const testUser = {
    firstName: 'Test',
    lastName: 'Employee',
    username: 'testemployee',
    email: 'testemployee@company.com',
    password: 'user123',
    role: 'EMPLOYEE',
    department: 'Engineering'
};

async function testRegistration() {
    console.log('\n🔹 Testing User Registration...');
    try {
        // Register Admin
        await axios.post(`${API_BASE}/auth/register`, testAdmin);
        console.log('✅ Admin registered successfully');

        // Register HR
        await axios.post(`${API_BASE}/auth/register`, testHR);
        console.log('✅ HR Manager registered successfully');

        // Register Employee
        await axios.post(`${API_BASE}/auth/register`, testUser);
        console.log('✅ Employee registered successfully');
    } catch (error) {
        if (error.response?.status === 409) {
            console.log('ℹ️  Users already exist, continuing...');
        } else {
            console.error('❌ Registration failed:', error.response?.data || error.message);
        }
    }
}

async function testLogin() {
    console.log('\n🔹 Testing User Login...');
    try {
        // Login Admin
        const adminRes = await axios.post(`${API_BASE}/auth/login`, {
            email: testAdmin.email,
            password: testAdmin.password
        });
        adminToken = adminRes.data.token;
        console.log('✅ Admin logged in successfully');

        // Login HR
        const hrRes = await axios.post(`${API_BASE}/auth/login`, {
            email: testHR.email,
            password: testHR.password
        });
        hrToken = hrRes.data.token;
        console.log('✅ HR Manager logged in successfully');

        // Login Employee
        const userRes = await axios.post(`${API_BASE}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        userToken = userRes.data.token;
        console.log('✅ Employee logged in successfully');
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function testAdminEndpoints() {
    console.log('\n🔹 Testing Admin Endpoints...');
    try {
        const config = { headers: { Authorization: `Bearer ${adminToken}` } };

        // Get Admin Dashboard
        const dashboard = await axios.get(`${API_BASE}/admin/dashboard`, config);
        console.log('✅ Admin Dashboard:', {
            totalUsers: dashboard.data.statistics.totalUsers,
            activeSessions: dashboard.data.statistics.activeSessions,
            recentActivities: dashboard.data.recentActivities.length
        });

        // Get All Users
        const users = await axios.get(`${API_BASE}/admin/users`, config);
        console.log('✅ All Users:', users.data.count, 'users found');

        // Get Audit Logs
        const logs = await axios.get(`${API_BASE}/admin/audit-logs`, config);
        console.log('✅ Audit Logs:', logs.data.count, 'logs found');

        // Get System Stats
        const stats = await axios.get(`${API_BASE}/admin/stats`, config);
        console.log('✅ System Stats:', {
            totalUsers: stats.data.statistics.totalUsers,
            activeUsers: stats.data.statistics.activeUsers
        });
    } catch (error) {
        console.error('❌ Admin endpoint failed:', error.response?.data || error.message);
    }
}

async function testHREndpoints() {
    console.log('\n🔹 Testing HR Endpoints...');
    try {
        const config = { headers: { Authorization: `Bearer ${hrToken}` } };

        // Get HR Dashboard
        const dashboard = await axios.get(`${API_BASE}/hr/dashboard`, config);
        console.log('✅ HR Dashboard:', {
            totalEmployees: dashboard.data.statistics.totalEmployees,
            recentHires: dashboard.data.statistics.recentHires,
            departments: dashboard.data.statistics.employeesByDepartment.length
        });

        // Get All Employees
        const employees = await axios.get(`${API_BASE}/hr/employees`, config);
        console.log('✅ All Employees:', employees.data.count, 'employees found');

        // Post Announcement
        const announcement = await axios.post(`${API_BASE}/hr/announcements`, {
            title: 'Test Announcement',
            content: 'This is a test announcement from the API test script',
            priority: 'HIGH'
        }, config);
        console.log('✅ Announcement Posted:', announcement.data.announcement.title);
    } catch (error) {
        console.error('❌ HR endpoint failed:', error.response?.data || error.message);
    }
}

async function testUserEndpoints() {
    console.log('\n🔹 Testing User Endpoints...');
    try {
        const config = { headers: { Authorization: `Bearer ${userToken}` } };

        // Get Profile
        const profile = await axios.get(`${API_BASE}/profile`, config);
        console.log('✅ User Profile:', profile.data.user.email);

        // Get Announcements
        const announcements = await axios.get(`${API_BASE}/announcements`, config);
        console.log('✅ Announcements:', announcements.data.count, 'announcements found');

        // Get User Activity
        const activity = await axios.get(`${API_BASE}/my-activity`, config);
        console.log('✅ User Activity:', activity.data.count, 'activities found');
    } catch (error) {
        console.error('❌ User endpoint failed:', error.response?.data || error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...');
    console.log('📍 API Base URL:', API_BASE);
    
    await testRegistration();
    await testLogin();
    await testAdminEndpoints();
    await testHREndpoints();
    await testUserEndpoints();
    
    console.log('\n✨ All tests completed!');
    console.log('\n📊 Summary:');
    console.log('- Admin Token:', adminToken ? '✅ Generated' : '❌ Failed');
    console.log('- HR Token:', hrToken ? '✅ Generated' : '❌ Failed');
    console.log('- User Token:', userToken ? '✅ Generated' : '❌ Failed');
}

// Run tests
runTests().catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
});
