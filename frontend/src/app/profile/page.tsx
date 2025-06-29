'use client';

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Button from '@/components/Button';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Job Hunter
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Welcome, {user?.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                >
                                    Sign out
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Profile Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Profile Settings
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Account Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            Manage Files
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
