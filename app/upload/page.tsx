'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { UploadCloud, File as FileIcon } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ type: 'idle', message: '' }); // idle, uploading, success, error
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                router.push('/Login');
            }
        };
        checkUser();
    }, [router]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setStatus({ type: 'idle', message: '' });
        } else {
            setFile(null);
            setStatus({ type: 'error', message: 'Please select a valid .csv file.' });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus({ type: 'error', message: 'No file selected.' });
            return;
        }

        setStatus({ type: 'uploading', message: 'Uploading and processing file...' });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
             setStatus({ type: 'error', message: 'Authentication error. Please log in again.' });
             return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvData = event.target.result;
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/csv',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: csvData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'An unknown error occurred.');
                }

                setStatus({ type: 'success', message: `Successfully uploaded and processed ${result.processedRows} rows.` });
                setFile(null); // Clear file input after success
            } catch (error) {
                setStatus({ type: 'error', message: `Upload failed: ${error.message}` });
            }
        };
        reader.readAsText(file);
    };
    
    if (loading) {
        return <div className="flex-1 p-6 text-center">Loading...</div>;
    }

    return (
        <div className="flex-1 p-6 space-y-8 bg-zinc-50">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-6">LGA Data Upload</h1>
                <p className="text-gray-600 mb-8">
                    Welcome, {user?.email}. Upload a CSV file with monthly health data.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    {!file ? (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-4">
                            <UploadCloud className="w-16 h-16 text-gray-400" />
                            <span className="text-blue-600 font-semibold">Click to browse</span>
                            <p className="text-gray-500 text-sm">or drag and drop a CSV file</p>
                        </label>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <FileIcon className="w-16 h-16 text-green-500" />
                            <p className="font-semibold text-gray-700">{file.name}</p>
                            <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col items-center">
                    <button
                        onClick={handleUpload}
                        disabled={!file || status.type === 'uploading'}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                        {status.type === 'uploading' ? 'Processing...' : 'Upload Data'}
                    </button>
                    {status.message && (
                        <div className={`mt-4 text-sm p-3 rounded-lg ${
                            status.type === 'success' ? 'bg-green-100 text-green-800' :
                            status.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {status.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
