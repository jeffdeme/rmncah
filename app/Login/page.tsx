'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateLgaAdmin } from '../../lib/lgaAuth'; // Import the authentication function
import Link from 'next/link';

const lgas = [
  'Bassa', 'Barkin Ladi', 'Bokkos', 'Jos North', 'Jos South', 'Jos East', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua’an Pan', 'Riyom', 'Shendam', 'Wase'
];

export default function LgaAdminLoginPage() {
  const [selectedLga, setSelectedLga] = useState('');
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');

    // Simulate async operation
    setTimeout(() => {
      const { success, message } = authenticateLgaAdmin(selectedLga, passcode);
      if (success) {
        setStatus('success');
        setTimeout(() => {
          router.push(`/data-entry?lga=${selectedLga}`);
        }, 1500);
      } else {
        setStatus('error');
        setError(message);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900">LGA Admin Portal</h1>
          <p className="mt-2 text-zinc-500">Please log in to manage your data.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="lga" className="block text-sm font-medium text-zinc-700">
              LGA
            </label>
            <select
              id="lga"
              className="mt-1 block w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={selectedLga}
              onChange={(e) => setSelectedLga(e.target.value)}
              required
              disabled={status === 'submitting'}
            >
              <option value="" disabled>Select your LGA</option>
              {lgas.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-zinc-700">
              Passcode
            </label>
            <input
              type="password"
              placeholder="Enter your passcode"
              id="passcode"
              className="mt-1 block w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              disabled={status === 'submitting'}
            />
          </div>

          {status === 'error' && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg">
              <strong>Success!</strong> Redirecting you now...
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-zinc-400 transition-colors"
              disabled={status === 'submitting' || status === 'success'}
            >
              {status === 'submitting' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </>
              ) : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}