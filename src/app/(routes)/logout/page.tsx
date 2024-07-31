'use client';

export default function Logout() {
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });

    localStorage.removeItem('token');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
