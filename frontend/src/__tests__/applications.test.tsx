import React from 'react';
import {
    render,
    screen,
    waitFor,
    fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplicationsPage from '../app/applications/page';
import { useAuth } from '@/hooks/useAuth';
import { jobAPI } from '@/lib/api';

// Mock the hooks and API
jest.mock('@/hooks/useAuth');
jest.mock('@/lib/api');
jest.mock('@/components/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));
jest.mock('@/components/Navigation', () => ({
    __esModule: true,
    default: ({
        user,
        onSignOut,
    }: {
        user: any;
        onSignOut: () => void;
    }) => (
        <div data-testid="navigation">
            <button onClick={onSignOut}>Sign Out</button>
        </div>
    ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockJobAPI = jobAPI as jest.Mocked<typeof jobAPI>;

describe('ApplicationsPage', () => {
    const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'mockpassword', // Added password
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockJobs = [
        {
            _id: 'job1',
            userId: 'user123',
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            description: 'Full-stack development role',
            requirements: ['JavaScript', 'React'],
            salary: { min: 80000, max: 120000, currency: 'USD' },
            type: 'full-time' as const,
            status: 'open' as const,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            _id: 'job2',
            userId: 'user123',
            title: 'Frontend Developer',
            company: 'Design Studio',
            location: 'New York, NY',
            description: 'Frontend development role',
            requirements: ['React', 'TypeScript'],
            salary: { min: 70000, max: 100000, currency: 'USD' },
            type: 'full-time' as const,
            status: 'open' as const,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10'),
        },
        {
            _id: 'job3',
            userId: 'user123',
            title: 'Backend Developer',
            company: 'API Company',
            location: 'Remote',
            description: 'Backend development role',
            requirements: ['Node.js', 'MongoDB'],
            salary: { min: 90000, max: 130000, currency: 'USD' },
            type: 'contract' as const,
            status: 'open' as const,
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20'),
        },
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup default mock implementations
        mockUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            logout: jest.fn(),
            isAuthenticated: true,
        });

        mockJobAPI.getAll.mockResolvedValue({
            jobs: mockJobs,
            message: 'Jobs fetched successfully',
        });
    });

    describe('Rendering', () => {
        it('should render the applications page with title', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('My Applications')
                ).toBeInTheDocument();
            });
        });

        it('should show loading state initially', () => {
            render(<ApplicationsPage />);

            expect(
                screen.getByText('Loading jobs...')
            ).toBeInTheDocument();
        });

        it('should render jobs table when data is loaded', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('Software Engineer')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Tech Corp')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Frontend Developer')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Design Studio')
                ).toBeInTheDocument();
            });
        });

        it('should render table headers correctly', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(screen.getByText('#')).toBeInTheDocument();
                expect(
                    screen.getByText('Company')
                ).toBeInTheDocument();
                expect(screen.getByText('Title')).toBeInTheDocument();
                expect(screen.getByText('Date')).toBeInTheDocument();
            });
        });

        it('should show row numbers correctly', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
                expect(screen.getByText('2')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument();
            });
        });

        it('should format dates correctly', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                // Check that dates are formatted (should show month names)
                const dateElements = screen.getAllByText(/Jan/);
                expect(dateElements.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Empty state', () => {
        it('should show empty state when no jobs are returned', async () => {
            mockJobAPI.getAll.mockResolvedValue({
                jobs: [],
                message: 'Jobs fetched successfully',
            });

            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        'No jobs found. Create your first job application!'
                    )
                ).toBeInTheDocument();
            });
        });
    });

    describe('Error handling', () => {
        it('should show error message when API call fails', async () => {
            mockJobAPI.getAll.mockRejectedValue(
                new Error('Network error')
            );

            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        'Failed to load jobs: Network error'
                    )
                ).toBeInTheDocument();
            });
        });

        it('should show error message for unknown errors', async () => {
            mockJobAPI.getAll.mockRejectedValue('Unknown error');

            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        'Failed to load jobs: Unknown error'
                    )
                ).toBeInTheDocument();
            });
        });
    });

    describe('Sorting functionality', () => {
        it('should sort by company when company header is clicked', async () => {
            const user = userEvent.setup();
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('Company')
                ).toBeInTheDocument();
            });

            const companyHeader = screen.getByText('Company');
            await user.click(companyHeader);

            // Check that sort indicator appears
            await waitFor(() => {
                expect(screen.getByText('↑')).toBeInTheDocument();
            });
        });

        it('should sort by title when title header is clicked', async () => {
            const user = userEvent.setup();
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(screen.getByText('Title')).toBeInTheDocument();
            });

            const titleHeader = screen.getByText('Title');
            await user.click(titleHeader);

            // Check that sort indicator appears
            await waitFor(() => {
                expect(screen.getByText('↑')).toBeInTheDocument();
            });
        });

        it('should sort by date when date header is clicked', async () => {
            const user = userEvent.setup();
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(screen.getByText('Date')).toBeInTheDocument();
            });

            const dateHeader = screen.getByText('Date');
            await user.click(dateHeader);

            // Check that sort indicator appears
            await waitFor(() => {
                expect(screen.getByText('↑')).toBeInTheDocument();
            });
        });

        it('should toggle sort direction when same header is clicked twice', async () => {
            const user = userEvent.setup();
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('Company')
                ).toBeInTheDocument();
            });

            const companyHeader = screen.getByText('Company');

            // First click - ascending
            await user.click(companyHeader);
            await waitFor(() => {
                expect(screen.getByText('↑')).toBeInTheDocument();
            });

            // Second click - descending
            await user.click(companyHeader);
            await waitFor(() => {
                expect(screen.getByText('↓')).toBeInTheDocument();
            });
        });
    });

    describe('API integration', () => {
        it('should call jobAPI.getAll on component mount', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(mockJobAPI.getAll).toHaveBeenCalledTimes(1);
            });
        });

        it('should handle API response correctly', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(mockJobAPI.getAll).toHaveBeenCalledWith();
            });

            // Check that jobs are displayed
            await waitFor(() => {
                expect(
                    screen.getByText('Software Engineer')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Tech Corp')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Authentication', () => {
        it('should render when user is authenticated', async () => {
            mockUseAuth.mockReturnValue({
                user: mockUser,
                loading: false,
                logout: jest.fn(),
                isAuthenticated: true,
            });

            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('My Applications')
                ).toBeInTheDocument();
            });
        });

        it('should show loading when auth is loading', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                loading: true,
                logout: jest.fn(),
                isAuthenticated: false,
            });

            render(<ApplicationsPage />);

            expect(
                screen.getByText('Loading jobs...')
            ).toBeInTheDocument();
        });
    });

    describe('Navigation integration', () => {
        it('should render navigation component', async () => {
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByTestId('navigation')
                ).toBeInTheDocument();
            });
        });

        it('should handle logout from navigation', async () => {
            const mockLogout = jest.fn();
            mockUseAuth.mockReturnValue({
                user: mockUser,
                loading: false,
                logout: mockLogout,
                isAuthenticated: true,
            });

            const user = userEvent.setup();
            render(<ApplicationsPage />);

            await waitFor(() => {
                expect(
                    screen.getByText('Sign Out')
                ).toBeInTheDocument();
            });

            const signOutButton = screen.getByText('Sign Out');
            await user.click(signOutButton);

            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });
});
