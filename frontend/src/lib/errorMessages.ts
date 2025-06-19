// Map backend error messages to user-friendly frontend messages
export const getErrorMessage = (error: string): string => {
    const errorMap: Record<string, string> = {
        'Email already registered':
            'This email address is already registered. Please try logging in instead.',
        'Invalid credentials':
            'Invalid email or password. Please check your credentials and try again.',
        'User not found': 'No account found with this email address.',
        'Current password is incorrect':
            'Your current password is incorrect. Please try again.',
        'Invalid or expired reset token':
            'The password reset link is invalid or has expired. Please request a new one.',
        'Error creating user':
            'There was a problem creating your account. Please try again.',
        'Error logging in':
            'There was a problem logging you in. Please try again.',
        'Error generating reset token':
            'There was a problem sending the reset email. Please try again.',
        'Error resetting password':
            'There was a problem resetting your password. Please try again.',
        'Error changing password':
            'There was a problem changing your password. Please try again.',
        'Error updating user':
            'There was a problem updating your profile. Please try again.',
        'User not authenticated': 'Please log in to continue.',
    };

    return errorMap[error] || error;
};
