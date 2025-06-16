export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Welcome to Job Hunter
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Find your next career opportunity
                </p>
                <div className="flex justify-center space-x-4">
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors">
                        Browse Jobs
                    </button>
                    <button className="border border-primary-600 text-primary-600 px-6 py-2 rounded-md hover:bg-primary-50 transition-colors">
                        Post a Job
                    </button>
                </div>
            </div>
        </div>
    );
}
