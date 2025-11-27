import Timeline from '@/components/Timeline';
import { timelineData } from '@/app/data';
import { Flame, Info } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6">
            <Flame className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            大埔宏福苑<br className="sm:hidden" />維修火災事件簿
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
            整合大埔宏福苑大維修期間發生的火災及相關爭議。
            <br />
            我們致力於透過客觀的事實與紀錄，還原事件真相。
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
              <Info className="w-4 h-4 mr-2" />
              <span>資料來源：公開會議紀錄、社交媒體、新聞報導</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Timeline events={timelineData} />
      </div>
    </main>
  );
}

