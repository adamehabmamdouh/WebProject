const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Sam Brown', email: 'sam.brown@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
    { id: 5, name: 'Michael Lee', email: 'michael.lee@example.com' }
];

function renderUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear existing users

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button onclick="deleteUser(${user.id})">Delete</button></td>
        `;
        userTableBody.appendChild(row);
    });
}

function deleteUser(userId) {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        renderUsers(); 
    }
}


document.getElementById('usersButton').addEventListener('click', function() {
    document.getElementById('userList').style.display = 'block';
    renderUsers(); // Render users when the user list is shown
});


function hideUserList() {
    document.getElementById('userList').style.display = 'none';
}