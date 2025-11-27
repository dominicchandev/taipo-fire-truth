import React from 'react';
import { TimelineEvent } from '@/app/data';
import { Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-12">
        {events.map((event) => (
          <div key={event.id} className="ml-6 md:ml-10 relative group">
            {/* Dot on the timeline */}
            <div className="absolute -left-[1.85rem] md:-left-[2.85rem] mt-1.5 w-6 h-6 bg-white rounded-full border-4 border-slate-300 group-hover:border-red-500 transition-colors duration-300 shadow-sm"></div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{event.title}</h3>

            {/* Date Badge */}
            <div className="flex items-center mb-4 text-slate-500 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-slate-600">
                {event.date}
              </span>
            </div>

            {/* Content Card */}
            {(event.sourceType && event.sourceContent) && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-slate-300">
                {/* Source Content */}
                <div className="">
                  {(() => {
                    if (event.sourceType === 'iframe' && event.sourceContent) {
                      return (
                        <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                          <div 
                            className="flex justify-center"
                            dangerouslySetInnerHTML={{ __html: event.sourceContent }} 
                          />
                        </div>
                      );
                    }

                    if (event.sourceContent) {
                      const youtubeId = getYouTubeId(event.sourceContent);
                      if (youtubeId) {
                        return (
                          <div className="rounded-lg overflow-hidden bg-black shadow-sm">
                            <iframe 
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title={event.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full aspect-video"
                            ></iframe>
                          </div>
                        );
                      }

                      return (
                        <a 
                          href={event.sourceContent} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block group/link"
                        >
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center hover:bg-slate-100 transition-colors">
                            <div className="bg-white p-2 rounded-full border border-slate-200 mr-3 group-hover/link:border-blue-200 group-hover/link:text-blue-600 transition-colors">
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {event.sourceContent}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                                點擊查看來源 <ExternalLink className="w-3 h-3 ml-1" />
                              </p>
                            </div>
                          </div>
                        </a>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;


