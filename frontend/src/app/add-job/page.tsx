'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { jobAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AddJobPage = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date().toISOString().split('T')[0];

    const [showNotification, setShowNotification] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        appliedDate: today,
        resumeLink: '',
        jobPostingLink: '',
        description: '',
        requirements: '',
        salary: '',
        notes: '',
        type: 'full-time' as const,
        status: 'open' as const,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement job creation logic
        console.log('Form submitted:', formData);
        const response = await jobAPI.create({
            ...formData,
            appliedDate: new Date(formData.appliedDate),
            requirements: formData.requirements
                ? formData.requirements
                      .split('\n')
                      .filter((r) => r.trim())
                : [],
        });
        console.log('Job created:', response);

        // Show notification and start countdown
        setShowNotification(true);
        let count = 5;
        const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                router.push('/applications');
            }
        }, 1000);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Success Notification */}
                {showNotification && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
                        <div className="flex items-center space-x-3">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <div>
                                <p className="font-medium">
                                    Job created successfully!
                                </p>
                                <p className="text-sm">
                                    Redirecting to applications in{' '}
                                    {countdown} seconds...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Navigation */}
                <Navigation user={user!} onSignOut={logout} />
                <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-4 sm:px-0">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Add a Job Application
                                </h2>
                                <p className="text-gray-600">
                                    Add a new job application to track
                                    your progress.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Company and Title Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Company *
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter company name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter job title"
                                        />
                                    </div>
                                </div>

                                {/* Location and Applied Date Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={
                                                handleInputChange
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="e.g., San Francisco, CA or Remote"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="appliedDate"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Applied Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="appliedDate"
                                            name="appliedDate"
                                            value={
                                                formData.appliedDate
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Links Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="resumeLink"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Resume Link
                                        </label>
                                        <input
                                            type="url"
                                            id="resumeLink"
                                            name="resumeLink"
                                            value={
                                                formData.resumeLink
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="jobPostingLink"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Job Posting Link
                                        </label>
                                        <input
                                            type="url"
                                            id="jobPostingLink"
                                            name="jobPostingLink"
                                            value={
                                                formData.jobPostingLink
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="https://linkedin.com/jobs/..."
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Job Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Brief description of the role..."
                                    />
                                </div>

                                {/* Requirements and Salary Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="requirements"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Requirements
                                        </label>
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            value={
                                                formData.requirements
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            rows={3}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Key requirements, skills needed..."
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="salary"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Salary Range
                                        </label>
                                        <input
                                            type="text"
                                            id="salary"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={
                                                handleInputChange
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="e.g., $80,000 - $120,000"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Any additional notes, follow-up actions, etc."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.history.back()
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Add Application
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AddJobPage;
