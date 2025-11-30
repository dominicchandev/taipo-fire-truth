'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface Event {
  id: string
  title: string
  date: string
  description: string
  status: string
}

interface Evidence {
  id: string
  title: string
  type: string
  side: string
  content_url: string
  status: string
  events?: { title: string }
}

export default function AdminConsole() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([])
  
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (events) setPendingEvents(events)

    const { data: evidence } = await supabase
      .from('evidence')
      .select('*, events(title)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (evidence) setPendingEvidence(evidence)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (session) fetchData()
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchData()
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchData])


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const updateStatus = async (table: 'events' | 'evidence', id: string, status: 'verified' | 'rejected') => {
    const { error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      fetchData()
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Events */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pending Events ({pendingEvents.length})</h2>
            <div className="space-y-4">
              {pendingEvents.map(event => (
                <div key={event.id} className="border p-4 rounded-lg">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm mt-2">{event.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => updateStatus('events', event.id, 'verified')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateStatus('events', event.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingEvents.length === 0 && <p className="text-gray-500">No pending events.</p>}
            </div>
          </div>

          {/* Pending Evidence */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pending Evidence ({pendingEvidence.length})</h2>
            <div className="space-y-4">
              {pendingEvidence.map(item => (
                <div key={item.id} className="border p-4 rounded-lg">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">For Event: {item.events?.title}</p>
                  <div className="flex gap-2 text-xs mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">Type: {item.type}</span>
                    <span className={`px-2 py-1 rounded ${
                      item.side === 'pro' ? 'bg-green-100 text-green-800' : 
                      item.side === 'against' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                    }`}>
                      Side: {item.side}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 break-all mb-2">{item.content_url}</p>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => updateStatus('evidence', item.id, 'verified')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateStatus('evidence', item.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingEvidence.length === 0 && <p className="text-gray-500">No pending evidence.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
