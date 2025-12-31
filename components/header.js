'use client';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-800">
                            RMNCAH Dashboard - Plateau State
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
