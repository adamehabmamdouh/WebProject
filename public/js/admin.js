async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const row = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.remove();
            }
            alert('User deleted successfully');
            location.reload();
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
    }
}

document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const isAdmin = formData.get('isAdmin') === 'on';

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.get('username'),
                email: formData.get('email'),
                password: password,
                isAdmin: isAdmin
            })
        });

        if (response.ok) {
            alert('User created successfully!');
            e.target.reset();
            location.reload();
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert(error.message || 'Failed to create user. Please try again.');
    }
});

document.getElementById('usersButton').addEventListener('click', function() {
    const userList = document.getElementById('userList');
    userList.style.display = userList.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    history.pushState(null, null, location.href);

    window.addEventListener('popstate', function(event) {
        window.location.href = '/login';
    });
});