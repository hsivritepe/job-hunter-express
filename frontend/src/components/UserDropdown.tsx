import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    ChevronDownIcon,
    UserIcon,
    ArrowRightStartOnRectangleIcon,
    InboxArrowDownIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { User } from '@/types';

interface UserDropdownProps {
    user: User;
    onSignOut: () => void;
}

export default function UserDropdown({
    user,
    onSignOut,
}: UserDropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <span className="text-sm text-gray-700">
                        {user.name}
                    </span>
                    <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/dashboard"
                                    className={`${
                                        active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                    } group flex items-center px-4 py-2 text-sm`}
                                >
                                    <InboxArrowDownIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Dashboard
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/profile"
                                    className={`${
                                        active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                    } group flex items-center px-4 py-2 text-sm`}
                                >
                                    <UserIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Profile
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={onSignOut}
                                    className={`${
                                        active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <ArrowRightStartOnRectangleIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Sign out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
