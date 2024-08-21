import React, { useState } from 'react';
import axios from 'axios';

const AccountSettings = () => {
    const [message, setMessage] = useState('');

    const handleDeactivateAccount = async () => {
        try {
            const response = await axios.put(
                'http://localhost:8000/api/v1/users/account-deactivate/',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            setMessage('Account deactivated successfully!');
        } catch (error) {
            setMessage('Failed to deactivate account.');
        }
    };

    const handleReactivateAccount = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/users/account-reactivate/',
                { email: 'user@example.com' }, // Replace with actual user email
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            setMessage('Reactivation email sent!');
        } catch (error) {
            setMessage('Failed to send reactivation email.');
        }
    };


    const handleDeleteAccount = async () => {
    try {
        const response = await axios.delete(
            'http://localhost:8000/api/v1/users/delete-account/',
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        setMessage('Account deleted successfully!');
        // Optionally redirect the user after account deletion
    } catch (error) {
        setMessage('Failed to delete account.');
    }
};

    return (
        <div className="account-settings">
            <h3>Account Settings</h3>
            {message && <p>{message}</p>}
            <button onClick={handleDeactivateAccount}>Deactivate Account</button>
            <button onClick={handleReactivateAccount}>Reactivate Account</button>
            <button onClick={handleDeleteAccount} className="delete-account-button">
    Delete Account
</button>
        </div>
    );
};

export default AccountSettings;
