'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Job } from '@/types';

export default function ApplicationsPage() {
    const { user, logout } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);

    const fetchJobs = async () => {
        try {
            // TODO: Implement job fetching logic
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <Navigation user={user!} onSignOut={logout} />

                {/* Applications Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                My Applications
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
