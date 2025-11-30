import Timeline from '@/components/Timeline';
import { Flame, Info, PlusCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for real-time updates

export default async function Home() {
  const supabase = await createClient();

  // Fetch verified events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'verified')
    .order('date', { ascending: true });

  // Fetch verified evidence
  const { data: evidenceData } = await supabase
    .from('evidence')
    .select('*')
    .eq('status', 'verified');

  // Combine data
  const events = (eventsData || []).map(event => ({
    ...event,
    evidence: (evidenceData || []).filter(e => e.event_id === event.id)
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-6 shadow-lg shadow-red-900/20">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            大埔宏福苑<br className="sm:hidden" />維修火災事件簿
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed">
            整合大埔宏福苑大維修期間發生的火災及相關爭議。
            <br />
            我們致力於透過客觀的事實與紀錄，還原事件真相。
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
            <div className="flex items-center text-sm text-slate-400 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <Info className="w-4 h-4 mr-2" />
              <span>資料來源：公開會議紀錄、社交媒體、新聞報導</span>
            </div>
            <Link href="/submit" className="flex items-center text-sm font-bold text-white bg-red-600 px-6 py-3 rounded-full hover:bg-red-500 transition-all shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>提交新資料</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Timeline events={events} />
        
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>由一群關心大埔的居民自發製作。</p>
          <p className="mt-2">資料僅供參考，如有錯漏請指正。</p>
        </div>
      </div>
    </main>
  );
}
