'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Job } from '@/types';
import { jobAPI } from '@/lib/api';

type SortField = 'company' | 'title' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function ApplicationsPage() {
    const { user, logout } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [sortField, setSortField] =
        useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] =
        useState<SortDirection>('desc');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            //console.log('Fetching jobs...');
            const { jobs, message } = await jobAPI.getAll();
            //console.log('Jobs fetched successfully:', jobs);
            setJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError(
                `Failed to load jobs: ${
                    error instanceof Error
                        ? error.message
                        : 'Unknown error'
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    // Sort jobs based on current sort field and direction
    const sortedJobs = [...jobs].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
            case 'company':
                aValue = a.company.toLowerCase();
                bValue = b.company.toLowerCase();
                break;
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            case 'createdAt':
                aValue = new Date(a.createdAt || 0);
                bValue = new Date(b.createdAt || 0);
                break;
            default:
                return 0;
        }

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(
                sortDirection === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    useEffect(() => {
        fetchJobs();
    }, []);

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
                        {loading && (
                            <div className="text-center py-4">
                                <p className="text-gray-500">
                                    Loading jobs...
                                </p>
                            </div>
                        )}
                        {error && (
                            <div className="text-center py-4">
                                <p className="text-red-500">
                                    {error}
                                </p>
                            </div>
                        )}
                        {!loading && !error && jobs.length > 0 && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort(
                                                            'company'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            Company
                                                        </span>
                                                        {sortField ===
                                                            'company' && (
                                                            <span className="text-gray-400">
                                                                {sortDirection ===
                                                                'asc'
                                                                    ? '↑'
                                                                    : '↓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort(
                                                            'title'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            Title
                                                        </span>
                                                        {sortField ===
                                                            'title' && (
                                                            <span className="text-gray-400">
                                                                {sortDirection ===
                                                                'asc'
                                                                    ? '↑'
                                                                    : '↓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort(
                                                            'createdAt'
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            Date
                                                        </span>
                                                        {sortField ===
                                                            'createdAt' && (
                                                            <span className="text-gray-400">
                                                                {sortDirection ===
                                                                'asc'
                                                                    ? '↑'
                                                                    : '↓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sortedJobs.map(
                                                (job, index) => (
                                                    <tr
                                                        key={job._id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index +
                                                                1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                job.company
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <Link
                                                                href={`/jobs/${job._id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                {
                                                                    job.title
                                                                }
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(
                                                                job.createdAt
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {!loading && !error && jobs.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-gray-500">
                                    No jobs found. Create your first
                                    job application!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
