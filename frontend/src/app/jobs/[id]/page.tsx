'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job, Action } from '@job-hunter/shared-types';
import { jobAPI } from '@/lib/api';
import { actionApi } from '@/lib/actionApi';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddAction, setShowAddAction] = useState(false);
    const [newAction, setNewAction] = useState({
        type: 'follow-up' as Action['type'],
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as Action['status'],
        notes: '',
    });

    const jobId = params.id as string;

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchJobAndActions = async () => {
            try {
                setLoading(true);
                const [jobResponse, actionsResponse] =
                    await Promise.all([
                        jobAPI.getById(jobId),
                        actionApi.getActionsByJobId(jobId),
                    ]);
                setJob(jobResponse.job);
                setActions(actionsResponse.actions);
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                        'Failed to fetch job details'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndActions();
    }, [jobId, user, router]);

    const handleAddAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user?._id) {
                throw new Error('User not authenticated');
            }

            const response = await actionApi.createAction({
                jobId,
                userId: user._id,
                ...newAction,
                date: new Date(newAction.date),
            });
            setActions([response.action, ...actions]);
            setShowAddAction(false);
            setNewAction({
                type: 'follow-up',
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                notes: '',
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    'Failed to create action'
            );
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getActionTypeColor = (type: Action['type']) => {
        const colors = {
            'follow-up': 'bg-blue-100 text-blue-800',
            'phone-interview': 'bg-green-100 text-green-800',
            'coding-interview': 'bg-purple-100 text-purple-800',
            'onsite-interview': 'bg-orange-100 text-orange-800',
            offer: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            accepted: 'bg-green-100 text-green-800',
            declined: 'bg-yellow-100 text-yellow-800',
            withdrawn: 'bg-gray-100 text-gray-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[type];
    };

    const getStatusColor = (status: Action['status']) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading job details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Error
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {error || 'Job not found'}
                    </p>
                    <Button onClick={() => router.push('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {job.title}
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                        {job.company}
                    </p>
                </div>

                {/* Job Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Job Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Location
                            </p>
                            <p className="text-gray-900">
                                {job.location || 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Applied Date
                            </p>
                            <p className="text-gray-900">
                                {formatDate(job.appliedDate)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Job Type
                            </p>
                            <p className="text-gray-900 capitalize">
                                {job.type.replace('-', ' ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Salary
                            </p>
                            <p className="text-gray-900">
                                {job.salary || 'Not specified'}
                            </p>
                        </div>
                        {job.jobPostingLink && (
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">
                                    Job Posting
                                </p>
                                <a
                                    href={job.jobPostingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 break-all"
                                >
                                    {job.jobPostingLink}
                                </a>
                            </div>
                        )}
                        {job.resumeLink && (
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">
                                    Resume Link
                                </p>
                                <a
                                    href={job.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 break-all"
                                >
                                    {job.resumeLink}
                                </a>
                            </div>
                        )}
                        {job.description && (
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">
                                    Description
                                </p>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>
                        )}
                        {job.notes && (
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">
                                    Notes
                                </p>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {job.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Actions
                        </h2>
                        <Button
                            onClick={() =>
                                setShowAddAction(!showAddAction)
                            }
                        >
                            {showAddAction ? 'Cancel' : 'Add Action'}
                        </Button>
                    </div>

                    {/* Add Action Form */}
                    {showAddAction && (
                        <form
                            onSubmit={handleAddAction}
                            className="mb-6 p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Action Type
                                    </label>
                                    <select
                                        value={newAction.type}
                                        onChange={(e) =>
                                            setNewAction({
                                                ...newAction,
                                                type: e.target
                                                    .value as Action['type'],
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="follow-up">
                                            Follow-up
                                        </option>
                                        <option value="phone-interview">
                                            Phone Interview
                                        </option>
                                        <option value="coding-interview">
                                            Coding Interview
                                        </option>
                                        <option value="onsite-interview">
                                            Onsite Interview
                                        </option>
                                        <option value="offer">
                                            Offer
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                        <option value="accepted">
                                            Accepted
                                        </option>
                                        <option value="declined">
                                            Declined
                                        </option>
                                        <option value="withdrawn">
                                            Withdrawn
                                        </option>
                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={newAction.date}
                                        onChange={(e) =>
                                            setNewAction({
                                                ...newAction,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <Input
                                        value={newAction.title}
                                        onChange={(e) =>
                                            setNewAction({
                                                ...newAction,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Action title"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newAction.description}
                                        onChange={(e) =>
                                            setNewAction({
                                                ...newAction,
                                                description:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Action description"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={newAction.notes}
                                        onChange={(e) =>
                                            setNewAction({
                                                ...newAction,
                                                notes: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        placeholder="Additional notes"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button type="submit">
                                    Add Action
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Actions List */}
                    {actions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No actions yet. Add your first action
                            above.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {actions.map((action) => (
                                <div
                                    key={action._id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getActionTypeColor(
                                                    action.type
                                                )}`}
                                            >
                                                {action.type.replace(
                                                    '-',
                                                    ' '
                                                )}
                                            </span>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                    action.status
                                                )}`}
                                            >
                                                {action.status}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(action.date)}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {action.title}
                                    </h3>
                                    {action.description && (
                                        <p className="text-gray-600 text-sm mb-2">
                                            {action.description}
                                        </p>
                                    )}
                                    {action.notes && (
                                        <p className="text-gray-500 text-sm italic">
                                            "{action.notes}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
