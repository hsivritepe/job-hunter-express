'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <Navigation user={user!} onSignOut={logout} />

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Welcome to your Dashboard
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    This is where you'll manage your
                                    job applications and profile.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="text-blue-600 mb-4">
                                            <svg
                                                className="w-8 h-8 mx-auto"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Search Jobs
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Browse and search for job
                                            opportunities
                                        </p>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                        >
                                            Browse Jobs
                                        </Button>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="text-blue-600 mb-4">
                                            <svg
                                                className="w-8 h-8 mx-auto"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            My Applications
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Track your job
                                            applications
                                        </p>
                                        <Link href="/applications">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                            >
                                                View Applications
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="text-blue-600 mb-4">
                                            <svg
                                                className="w-8 h-8 mx-auto"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Profile
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Manage your profile and
                                            settings
                                        </p>
                                        <Link href="/profile">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-8 text-sm text-gray-500">
                                    <p>
                                        More features coming soon!
                                        This is just the beginning of
                                        your job hunting journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
