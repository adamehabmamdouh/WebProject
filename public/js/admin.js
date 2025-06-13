// Function to delete a user
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
            // Remove the user row from the table
            const row = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.remove();
            }
            alert('User deleted successfully');
            // Refresh the page to update the user list
            location.reload();
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
    }
}

// Handle new user creation
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
            e.target.reset(); // Clear the form
            location.reload(); // Refresh to show new user
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert(error.message || 'Failed to create user. Please try again.');
    }
});

// Show/hide user list
document.getElementById('usersButton').addEventListener('click', function() {
    const userList = document.getElementById('userList');
    userList.style.display = userList.style.display === 'none' ? 'block' : 'none';
});

// Handle back button for admin pages
document.addEventListener('DOMContentLoaded', function() {
    // Add a history entry when the page loads
    history.pushState(null, null, location.href);

    // Handle back button
    window.addEventListener('popstate', function(event) {
        // Redirect to login page
        window.location.href = '/login';
    });
}); 