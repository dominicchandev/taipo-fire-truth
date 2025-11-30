import React from 'react';
import { Calendar, Link as LinkIcon, ExternalLink, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export interface Evidence {
  id: string;
  title: string;
  type: string;
  content_url: string;
  side: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
  evidence: Evidence[];
}

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const EvidenceCard = ({ item }: { item: Evidence }) => {
  const renderContent = () => {
    if (item.type === 'iframe') {
      return (
        <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
          <div 
            className="flex justify-center"
            dangerouslySetInnerHTML={{ __html: item.content_url }} 
          />
        </div>
      );
    }

    const youtubeId = getYouTubeId(item.content_url);
    if (youtubeId) {
      return (
        <div className="rounded-lg overflow-hidden bg-black shadow-sm">
          <iframe 
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full aspect-video"
          ></iframe>
        </div>
      );
    }

    return (
      <a 
        href={item.content_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block group/link"
      >
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center hover:bg-slate-100 transition-colors">
          <div className="bg-white p-2 rounded-full border border-slate-200 mr-3 group-hover/link:border-blue-200 group-hover/link:text-blue-600 transition-colors">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {item.content_url}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center">
              點擊查看來源 <ExternalLink className="w-3 h-3 ml-1" />
            </p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 mb-4">
      <h4 className="font-bold text-sm mb-2 text-slate-800">{item.title}</h4>
      {renderContent()}
    </div>
  );
};

interface TimelineProps {
  events: Event[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-16">
        {events.map((event) => {
          const pros = event.evidence.filter(e => e.side === 'pro');
          const against = event.evidence.filter(e => e.side === 'against');
          const neutral = event.evidence.filter(e => e.side === 'neutral' || !e.side);

          return (
            <div key={event.id} className="ml-6 md:ml-10 relative group">
              {/* Dot on the timeline */}
              <div className="absolute -left-[1.85rem] md:-left-[2.85rem] mt-1.5 w-6 h-6 bg-white rounded-full border-4 border-slate-300 group-hover:border-red-500 transition-colors duration-300 shadow-sm"></div>
              
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-snug">{event.title}</h3>
                <div className="flex items-center text-slate-500 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-slate-600">
                    {new Date(event.date).toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {event.description && (
                  <p className="text-slate-600 leading-relaxed">{event.description}</p>
                )}
              </div>

              {/* Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros Column */}
                {(pros.length > 0 || against.length > 0) && (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-700 font-bold border-b border-green-200 pb-2 mb-4">
                      <ThumbsUp className="w-5 h-5 mr-2" />
                      <span>支持 / 正面觀點</span>
                    </div>
                    {pros.length > 0 ? (
                      pros.map(item => <EvidenceCard key={item.id} item={item} />)
                    ) : (
                      <p className="text-slate-400 text-sm italic p-4 bg-slate-50 rounded-lg text-center">暫無相關資料</p>
                    )}
                  </div>
                )}

                {/* Against Column */}
                {(pros.length > 0 || against.length > 0) && (
                  <div className="space-y-4">
                    <div className="flex items-center text-red-700 font-bold border-b border-red-200 pb-2 mb-4">
                      <ThumbsDown className="w-5 h-5 mr-2" />
                      <span>反對 / 負面觀點</span>
                    </div>
                    {against.length > 0 ? (
                      against.map(item => <EvidenceCard key={item.id} item={item} />)
                    ) : (
                      <p className="text-slate-400 text-sm italic p-4 bg-slate-50 rounded-lg text-center">暫無相關資料</p>
                    )}
                  </div>
                )}
              </div>

              {/* Neutral / General Evidence */}
              {neutral.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center text-slate-700 font-bold border-b border-slate-200 pb-2 mb-4">
                    <Minus className="w-5 h-5 mr-2" />
                    <span>相關資料 / 中立報導</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {neutral.map(item => <EvidenceCard key={item.id} item={item} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
