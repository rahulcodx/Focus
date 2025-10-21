"use client";

import { useEffect, useState } from "react";

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState<{
    hasToken: boolean;
    hasUser: boolean;
    token?: string;
    user?: any;
  }>({
    hasToken: false,
    hasUser: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const user = localStorage.getItem('planly_user');
    
    setAuthInfo({
      hasToken: !!token,
      hasUser: !!user,
      token: token?.substring(0, 20) + '...',
      user: user ? JSON.parse(user) : null
    });
  }, []);

  if (!authInfo.hasToken) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg shadow-lg max-w-md z-50">
        <h3 className="font-bold text-lg mb-2">⚠️ Authentication Issue</h3>
        <p className="text-sm mb-2">No auth token found in localStorage!</p>
        <p className="text-xs mb-3">You need to log in to access the dashboard.</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border-2 border-green-500 text-green-800 p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold text-lg mb-2">✅ Authenticated</h3>
      <div className="text-xs space-y-1">
        <p><strong>User:</strong> {authInfo.user?.name || 'Unknown'}</p>
        <p><strong>Email:</strong> {authInfo.user?.email || 'Unknown'}</p>
        <p><strong>Token:</strong> {authInfo.token}</p>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
        className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
      >
        Logout
      </button>
    </div>
  );
}
