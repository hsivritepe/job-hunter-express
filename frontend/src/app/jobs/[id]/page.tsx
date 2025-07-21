'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Job,
    Action,
    ActionTemplate,
} from '@job-hunter/shared-types';
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
    const [actionTemplates, setActionTemplates] = useState<
        ActionTemplate[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddAction, setShowAddAction] = useState(false);
    const [newAction, setNewAction] = useState({
        templateId: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        scheduledDate: '',
    });

    const jobId = params.id as string;

    useEffect(() => {
        const fetchJobAndActions = async () => {
            try {
                setLoading(true);
                const [
                    jobResponse,
                    actionsResponse,
                    templatesResponse,
                ] = await Promise.all([
                    jobAPI.getById(jobId),
                    actionApi.getActionsByJobId(jobId),
                    actionApi.getActionTemplates(),
                ]);
                setJob(jobResponse.job);
                setActions(actionsResponse.actions);
                setActionTemplates(templatesResponse.templates);
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
    }, [jobId]);

    const handleAddAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user?._id) {
                throw new Error('User not authenticated');
            }

            const response = await actionApi.createAction({
                jobId,
                userId: user._id,
                templateId: newAction.templateId,
                date: new Date(newAction.date),
                notes: newAction.notes,
                scheduledDate: newAction.scheduledDate
                    ? new Date(newAction.scheduledDate)
                    : undefined,
            });
            setActions([response.action, ...actions]);
            setShowAddAction(false);
            setNewAction({
                templateId: '',
                date: new Date().toISOString().split('T')[0],
                notes: '',
                scheduledDate: '',
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

    const getActionCategoryColor = (
        category: ActionTemplate['category']
    ) => {
        const colors = {
            application: 'bg-blue-100 text-blue-800',
            interview: 'bg-green-100 text-green-800',
            response: 'bg-purple-100 text-purple-800',
            'follow-up': 'bg-orange-100 text-orange-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[category];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Error
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        {error || 'Job not found'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Job Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {job.title}
                                </h1>
                                <p className="text-lg text-gray-600 mb-1">
                                    {job.company}
                                </p>
                                {job.location && (
                                    <p className="text-gray-500 mb-2">
                                        📍 {job.location}
                                    </p>
                                )}
                            </div>
                            <Button
                                onClick={() =>
                                    router.push('/applications')
                                }
                                variant="outline"
                            >
                                ← Back to Applications
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Job Details
                                </h3>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Applied Date
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {formatDate(
                                                job.appliedDate
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Job Type
                                        </dt>
                                        <dd className="text-sm text-gray-900 capitalize">
                                            {job.type}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Status
                                        </dt>
                                        <dd className="text-sm text-gray-900 capitalize">
                                            {job.status}
                                        </dd>
                                    </div>
                                    {job.salary && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Salary
                                            </dt>
                                            <dd className="text-sm text-gray-900">
                                                {job.salary}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Links
                                </h3>
                                <div className="space-y-2">
                                    {job.resumeLink && (
                                        <a
                                            href={job.resumeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            📄 Resume Link
                                        </a>
                                    )}
                                    {job.jobPostingLink && (
                                        <a
                                            href={job.jobPostingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            🔗 Job Posting
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {job.description && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>
                        )}

                        {job.requirements &&
                            job.requirements.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Requirements
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requirements.map(
                                            (req, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                >
                                                    {req}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {job.notes && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Notes
                                </h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {job.notes}
                                </p>
                            </div>
                        )}
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
                                {showAddAction
                                    ? 'Cancel'
                                    : 'Add Action'}
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
                                            value={
                                                newAction.templateId
                                            }
                                            onChange={(e) =>
                                                setNewAction({
                                                    ...newAction,
                                                    templateId:
                                                        e.target
                                                            .value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">
                                                Select an action...
                                            </option>
                                            {actionTemplates.map(
                                                (template) => (
                                                    <option
                                                        key={
                                                            template._id
                                                        }
                                                        value={
                                                            template._id
                                                        }
                                                    >
                                                        {
                                                            template.icon
                                                        }{' '}
                                                        {
                                                            template.name
                                                        }
                                                    </option>
                                                )
                                            )}
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
                                                    date: e.target
                                                        .value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Scheduled Date (Optional)
                                        </label>
                                        <Input
                                            type="date"
                                            value={
                                                newAction.scheduledDate
                                            }
                                            onChange={(e) =>
                                                setNewAction({
                                                    ...newAction,
                                                    scheduledDate:
                                                        e.target
                                                            .value,
                                                })
                                            }
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
                                                    notes: e.target
                                                        .value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Additional notes about this action..."
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
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getActionCategoryColor(
                                                        actionTemplates.find(
                                                            (t) =>
                                                                t._id ===
                                                                action.templateId
                                                        )?.category ||
                                                            'other'
                                                    )}`}
                                                >
                                                    {
                                                        action.templateName
                                                    }
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(
                                                    action.date
                                                )}
                                            </span>
                                        </div>
                                        {action.notes && (
                                            <p className="text-gray-600 text-sm italic">
                                                "{action.notes}"
                                            </p>
                                        )}
                                        {action.scheduledDate && (
                                            <p className="text-gray-500 text-xs mt-1">
                                                📅 Scheduled:{' '}
                                                {formatDate(
                                                    action.scheduledDate
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
