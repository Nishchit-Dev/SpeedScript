import axios from 'axios';

export async function sendWelcomeEmail(email: string, username: string): Promise<void> {
    const apiUrl = process.env.Loop_Api; // Ensure API_URL is set in your environment variables
    const bearerToken = process.env.Loop_Bearer_Token; // Ensure BEARER_TOKEN is set in your environment variables

    if (!apiUrl || !bearerToken) {
        throw new Error('API_URL or BEARER_TOKEN is not defined in environment variables');
    }

    const requestBody = {
        email: email,
        eventName: "signup",
        firstName: username
    };

    try {
        const response = await axios.post(`${apiUrl}`, requestBody, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}