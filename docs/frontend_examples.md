# SkillMap AI - Frontend Integration Guide (Next.js)

This guide provides the core React components and hooks to connect your Next.js frontend to the SkillMap AI backend.

## 1. API Configuration
```typescript
// utils/api.ts
const BASE_URL = "http://localhost:8000";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response.json();
};
```

## 2. Dashboard Component
```tsx
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [progress, setProgress] = useState({ percentage: 0 });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const progRes = await apiFetch("/progress");
      const assignRes = await apiFetch("/assignments");
      
      if (progRes.success) setProgress(progRes.data);
      if (assignRes.success) setAssignments(assignRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleComplete = async (id: number) => {
    const res = await apiFetch(`/assignments/${id}/complete`, { method: "PATCH" });
    if (res.success) {
      alert("Assignment Completed!");
      window.location.reload(); // Simple refresh for demo
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Progress: {progress.percentage}%</h1>
      <div className="grid gap-4">
        {assignments.map((a: any) => (
          <div key={a.id} className="border p-4 rounded bg-white flex justify-between">
            <div>
              <h3 className="font-semibold">{a.title} (Week {a.week})</h3>
              <p className="text-gray-600">{a.status}</p>
            </div>
            {a.status === 'pending' && (
              <button 
                onClick={() => handleComplete(a.id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Done
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 3. Profile Form
```tsx
import { useState } from 'react';

export function ProfileForm() {
  const [data, setData] = useState({ career_goal: '', skill_level: 'Beginner', weekly_hours: 10 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (res.success) alert("Profile Saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input 
        placeholder="Career Goal"
        className="block w-full border p-2"
        onChange={e => setData({...data, career_goal: e.target.value})}
      />
      <select className="block w-full border p-2" onChange={e => setData({...data, skill_level: e.target.value})}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <input 
        type="number"
        placeholder="Weekly Hours"
        className="block w-full border p-2"
        onChange={e => setData({...data, weekly_hours: parseInt(e.target.value)})}
      />
      <button className="bg-blue-600 text-white p-2 w-full">Save Profile</button>
    </form>
  );
}
```
