import { toast } from 'react-toastify';

export const handleError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);

    let message = defaultMessage;

    if (error.response) {
        // Backend returned a response with an error status
        const data = error.response.data;
        if (data) {
            if (data.detail) {
                // Pydantic or FastAPI detail
                if (Array.isArray(data.detail)) {
                    // Pydantic validation error array
                    message = data.detail.map(err => err.msg).join(', ');
                } else {
                    message = data.detail;
                }
            } else if (data.message) {
                message = data.message;
            }
        }
    } else if (error.request) {
        // Request was made but no response received
        message = 'No response from server. Please check your connection.';
    } else {
        // Something happened in setting up the request
        message = error.message;
    }

    toast.error(message);
    return message;
};

export default { handleError };
