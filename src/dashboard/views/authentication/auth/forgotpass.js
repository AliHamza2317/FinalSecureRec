import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Alert
} from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import { Link } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthForgotPass = ({ title, subtitle, subtext }) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('https://secure-rec-backend.vercel.app/users/forgot', { email });
            // Assuming response.data.message contains the success message returned from the backend
            console.log('Password reset email sent successfully:', response.data.message);
            setShowSuccessPopup(true); // Show success popup
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage('User not found');
                } else {
                    setErrorMessage('Failed to send password reset email');
                }
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px">Email</Typography>
                    <CustomTextField
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleForgotPassword} // Call handleForgotPassword function when Continue button is clicked
                    sx={{
                        marginTop: '2rem', // Adjust the value as needed
                    }}
                >
                    Continue
                </Button>
                {errorMessage && (
                    <Alert severity="error" mt={2}>
                        {errorMessage}
                    </Alert>
                )}
                {showSuccessPopup && (
                    <Alert severity="success" mt={2}>
                        Password reset email sent successfully.
                    </Alert>
                )}
                <Typography
                    component={Link}
                    to="/login" // Link to the Sign In page
                    fontWeight="500"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        display: 'block',
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}
                >
                    Back to Sign In
                </Typography>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthForgotPass;
