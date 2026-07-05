import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const email = localStorage.getItem('studentEmail');
    if (!email) { setLoading(false); return; }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/students/profile?email=${encodeURIComponent(email)}`)
      .then(res => res.ok ? res.json() : null)
      .then(student => {
        if (student) {
          reset({
            name: student.name || '',
            email: student.email || '',
            department: student.department || '',
            careerGoal: student.careerGoal || 'Backend Developer',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setMessage('');
    const email = localStorage.getItem('studentEmail');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/students/profile?email=${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem('careerGoal', updated.careerGoal || data.careerGoal);
        setMessage('Profile saved successfully!');
      } else {
        setMessage('Failed to save profile.');
      }
    } catch {
      setMessage('Cannot connect to server.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Student Profile</h1>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                disabled
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                {...register('department')}
                type="text"
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Career Goal</label>
              <select
                {...register('careerGoal')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {message && (
              <span className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
