export type SourceType = 'iframe' | 'link';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  relatedPeople: string[];
  sourceType?: SourceType;
  sourceContent?: string; // URL for link, HTML string for iframe
}

export const timelineData: TimelineEvent[] = [
  {
    id: '1',
    date: '2024年7月31日 11:58',
    title: '協助宏福苑居民填寫大維修相關資助表格',
    relatedPeople: ['黃碧嬌'],
    sourceType: 'iframe',
    sourceContent: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fwongpeggytaipo%2Fposts%2Fpfbid0FSLBXAfJn2hXSuVt4JsErytGXfyafNXDJhNGj6nAFYJTeAmaiX3YEMitJQqZaCxQl&show_text=true&width=500" width="500" height="709" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
  },
  {
    id: '2',
    date: '2024年7月',
    title: '業主一年前報東張西望',
    relatedPeople: [],
    sourceType: 'link',
    sourceContent: 'https://www.youtube.com/watch?v=0eOcOGI6R88'
  },
  {
    id: '3',
    date: '2024年8月24日 10:45',
    title: '黃碧嬌反對罷免',
    relatedPeople: ['黃碧嬌'],
    sourceType: 'iframe',
    sourceContent: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fwongpeggytaipo%2Fposts%2Fpfbid02WAgTjR43ygZjeyrhHGJuLpi653nF6ryzG7kjw8rNF7yqC3XjrCrsBPGufG6jU15fl&show_text=true&width=500" width="500" height="581" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
  },
  {
    id: '4',
    date: '2025年11月26日',
    title: '宏福苑大維修期間發生火災',
    relatedPeople: []
  }
];
