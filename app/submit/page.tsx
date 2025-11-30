'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
}

export default function SubmitPage() {
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('new')
  const [evidenceType, setEvidenceType] = useState<string>('link')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('id, title')
        .eq('status', 'verified')
        .order('date', { ascending: false })
      
      if (data) setEvents(data)
    }
    fetchEvents()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      let eventId = selectedEventId

      // 1. Handle Event Creation if "new" is selected
      if (selectedEventId === 'new') {
        const eventData = {
          title: formData.get('eventTitle') as string,
          description: formData.get('eventDescription') as string,
          date: new Date(formData.get('eventDate') as string).toISOString(),
          status: 'pending'
        }

        const { data: event, error: eventError } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single()

        if (eventError) throw eventError
        eventId = event.id
      }

      // 2. Handle File Upload if present
      let contentUrl = formData.get('evidenceContent') as string

      if (evidenceType === 'blob' && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('evidence-files')
          .upload(fileName, file)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('evidence-files')
          .getPublicUrl(fileName)
          
        contentUrl = publicUrl
      }

      // 3. Insert Evidence linked to Event
      const evidenceData = {
        title: formData.get('evidenceTitle') as string,
        type: evidenceType,
        content_url: contentUrl,
        side: formData.get('evidenceSide') as string,
        status: 'pending',
        event_id: eventId
      }

      const { error: evidenceError } = await supabase
        .from('evidence')
        .insert(evidenceData)

      if (evidenceError) throw evidenceError

      alert('提交成功！我們會盡快審核。')
      router.push('/')
    } catch (error: any) {
      console.error('Error submitting:', error)
      alert('提交失敗，請稍後再試。錯誤: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">提交新資料</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">選擇事件</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">事件</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">-- 建立新事件 --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Event Details (Only if 'new' is selected) */}
          {selectedEventId === 'new' && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-medium text-slate-900">新事件詳情</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">事件標題</label>
                <input 
                  name="eventTitle" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：宏福苑大維修期間發生火災"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">發生日期</label>
                <input 
                  type="datetime-local"
                  name="eventDate" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">事件描述</label>
                <textarea 
                  name="eventDescription" 
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請簡述事件經過..."
                />
              </div>
            </div>
          )}

          {/* Evidence Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">相關證據/來源</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">證據標題</label>
              <input 
                name="evidenceTitle" 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：現場影片、新聞報導"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
                <select 
                  name="evidenceType" 
                  value={evidenceType}
                  onChange={(e) => {
                    setEvidenceType(e.target.value)
                    if (e.target.value !== 'blob') setFile(null)
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="link">網頁連結 (Link)</option>
                  <option value="youtube">YouTube 影片</option>
                  <option value="iframe">嵌入代碼 (Iframe)</option>
                  <option value="blob">檔案上傳 (圖片/PDF)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">立場</label>
                <select 
                  name="evidenceSide" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="neutral">中立 / 事實陳述</option>
                  <option value="pro">支持 / 正面</option>
                  <option value="against">反對 / 負面</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {evidenceType === 'blob' ? '上傳檔案' : '內容 (URL 或 Iframe 代碼)'}
              </label>
              
              {evidenceType === 'blob' ? (
                <input 
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              ) : (
                <textarea 
                  name="evidenceContent" 
                  required 
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder={evidenceType === 'iframe' ? '<iframe src="..." ...></iframe>' : 'https://...'}
                />
              )}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '提交中...' : '提交審核'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
