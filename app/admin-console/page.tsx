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

const EventCard = ({ event, onUpdate, onStatusUpdate }: { 
  event: Event, 
  onUpdate: (id: string, data: Partial<Event>) => Promise<void>,
  onStatusUpdate: (id: string, status: 'verified' | 'rejected') => Promise<void>
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(event)

  const handleSave = async () => {
    await onUpdate(event.id, {
      title: formData.title,
      date: formData.date,
      description: formData.description
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border p-4 rounded-lg bg-slate-50 space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Title</label>
          <input 
            className="w-full p-2 border rounded" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Date</label>
          <input 
            type="datetime-local"
            className="w-full p-2 border rounded" 
            value={new Date(formData.date).toISOString().slice(0, 16)}
            onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Description</label>
          <textarea 
            className="w-full p-2 border rounded" 
            rows={3}
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 p-5 rounded-xl hover:shadow-lg transition-all bg-white group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{event.title}</h3>
        <button 
          onClick={() => setIsEditing(true)} 
          className="text-slate-400 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="flex items-center text-sm text-slate-500 mb-3">
        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium mr-2">DATE</span>
        {new Date(event.date).toLocaleDateString()}
      </div>
      <p className="text-sm text-slate-600 mb-5 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
        {event.description}
      </p>
      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button 
          onClick={() => onStatusUpdate(event.id, 'verified')}
          className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg text-sm font-medium hover:bg-green-100 hover:border-green-300 transition-all"
        >
          Approve
        </button>
        <button 
          onClick={() => onStatusUpdate(event.id, 'rejected')}
          className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

const EvidenceCard = ({ item, onUpdate, onStatusUpdate }: { 
  item: Evidence, 
  onUpdate: (id: string, data: Partial<Evidence>) => Promise<void>,
  onStatusUpdate: (id: string, status: 'verified' | 'rejected') => Promise<void>
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(item)

  const handleSave = async () => {
    await onUpdate(item.id, {
      title: formData.title,
      type: formData.type,
      side: formData.side,
      content_url: formData.content_url
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border p-4 rounded-lg bg-slate-50 space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Title</label>
          <input 
            className="w-full p-2 border rounded" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Type</label>
            <select 
              className="w-full p-2 border rounded"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="link">Link</option>
              <option value="youtube">YouTube</option>
              <option value="iframe">Iframe</option>
              <option value="blob">Blob</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Side</label>
            <select 
              className="w-full p-2 border rounded"
              value={formData.side}
              onChange={e => setFormData({...formData, side: e.target.value})}
            >
              <option value="neutral">Neutral</option>
              <option value="pro">Pro</option>
              <option value="against">Against</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase">Content URL</label>
          <textarea 
            className="w-full p-2 border rounded font-mono text-xs" 
            rows={3}
            value={formData.content_url}
            onChange={e => setFormData({...formData, content_url: e.target.value})}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 p-5 rounded-xl hover:shadow-lg transition-all bg-white group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
        <button 
          onClick={() => setIsEditing(true)} 
          className="text-slate-400 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
      </div>
      
      <div className="mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event</span>
        <p className="text-sm text-slate-700 font-medium">{item.events?.title}</p>
      </div>

      <div className="flex gap-2 text-xs mb-4">
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium border border-slate-200 uppercase tracking-wide text-[10px]">
          {item.type}
        </span>
        <span className={`px-2.5 py-1 rounded-md font-medium border uppercase tracking-wide text-[10px] ${
          item.side === 'pro' ? 'bg-green-50 text-green-700 border-green-200' : 
          item.side === 'against' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {item.side}
        </span>
      </div>
      
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-5">
        <p className="text-xs text-slate-500 font-mono break-all line-clamp-3 hover:line-clamp-none transition-all cursor-pointer" title={item.content_url}>
          {item.content_url}
        </p>
      </div>

      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button 
          onClick={() => onStatusUpdate(item.id, 'verified')}
          className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg text-sm font-medium hover:bg-green-100 hover:border-green-300 transition-all"
        >
          Approve
        </button>
        <button 
          onClick={() => onStatusUpdate(item.id, 'rejected')}
          className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

export default function AdminConsole() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([])
  const [verifiedEvents, setVerifiedEvents] = useState<Event[]>([])
  const [verifiedEvidence, setVerifiedEvidence] = useState<Evidence[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending')
  
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    // Fetch Pending
    const { data: pEvents } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (pEvents) setPendingEvents(pEvents)

    const { data: pEvidence } = await supabase
      .from('evidence')
      .select('*, events(title)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (pEvidence) setPendingEvidence(pEvidence)

    // Fetch Verified
    const { data: vEvents } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'verified')
      .order('date', { ascending: false })
    if (vEvents) setVerifiedEvents(vEvents)

    const { data: vEvidence } = await supabase
      .from('evidence')
      .select('*, events(title)')
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
    if (vEvidence) setVerifiedEvidence(vEvidence)
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

  const updateData = async (table: 'events' | 'evidence', id: string, data: Partial<Event> | Partial<Evidence>) => {
    const { error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)

    if (error) {
      alert('Error updating data: ' + error.message)
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

        <div className="flex space-x-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-2 px-4 font-medium transition-colors relative ${
              activeTab === 'pending' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pending Approvals
            {pendingEvents.length + pendingEvidence.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                {pendingEvents.length + pendingEvidence.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'verified' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Verified Content
          </button>
        </div>

        {activeTab === 'pending' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Events */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                Pending Events ({pendingEvents.length})
              </h2>
              <div className="space-y-4">
                {pendingEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onUpdate={(id, data) => updateData('events', id, data)}
                    onStatusUpdate={(id, status) => updateStatus('events', id, status)}
                  />
                ))}
                {pendingEvents.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No pending events
                  </div>
                )}
              </div>
            </div>

            {/* Pending Evidence */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                Pending Evidence ({pendingEvidence.length})
              </h2>
              <div className="space-y-4">
                {pendingEvidence.map(item => (
                  <EvidenceCard 
                    key={item.id} 
                    item={item} 
                    onUpdate={(id, data) => updateData('evidence', id, data)}
                    onStatusUpdate={(id, status) => updateStatus('evidence', id, status)}
                  />
                ))}
                {pendingEvidence.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No pending evidence
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Verified Events */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                Verified Events ({verifiedEvents.length})
              </h2>
              <div className="space-y-4">
                {verifiedEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onUpdate={(id, data) => updateData('events', id, data)}
                    onStatusUpdate={(id, status) => updateStatus('events', id, status)}
                  />
                ))}
                {verifiedEvents.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No verified events
                  </div>
                )}
              </div>
            </div>

            {/* Verified Evidence */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                Verified Evidence ({verifiedEvidence.length})
              </h2>
              <div className="space-y-4">
                {verifiedEvidence.map(item => (
                  <EvidenceCard 
                    key={item.id} 
                    item={item} 
                    onUpdate={(id, data) => updateData('evidence', id, data)}
                    onStatusUpdate={(id, status) => updateStatus('evidence', id, status)}
                  />
                ))}
                {verifiedEvidence.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No verified evidence
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

