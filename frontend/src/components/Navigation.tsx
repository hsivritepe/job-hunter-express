import React from 'react';
import UserDropdown from './UserDropdown';
import { User } from '@/types';

interface NavigationProps {
    user: User;
    onSignOut: () => void;
}

export default function Navigation({
    user,
    onSignOut,
}: NavigationProps) {
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            Job Hunter
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <UserDropdown
                            user={user}
                            onSignOut={onSignOut}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
