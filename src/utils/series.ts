import { getCollection } from 'astro:content';

export interface SeriesInfo {
  taleid: string;
  maintitle: string;
  maindescription: string;
  chapters: Array<{
    id: string;
    title: string;
    description: string;
    chapter: number;
    date: Date;
    lang: string;
  }>;
  firstChapter: {
    id: string;
    title: string;
    description: string;
    chapter: number;
    date: Date;
    lang: string;
  };
  lang: string;
  totalChapters: number;
  lastUpdated: Date;
}

export async function getSeriesByLang(lang: string): Promise<SeriesInfo[]> {
  // First, get all posts that have taleid (series posts)
  const allSeriesPosts = await getCollection('stories', ({ data }) => 
    data.lang === lang && data.taleid
  );

  // Group posts by taleid
  const seriesMap = new Map<string, any[]>();
  
  allSeriesPosts.forEach(post => {
    const taleid = post.data.taleid!;
    if (!seriesMap.has(taleid)) {
      seriesMap.set(taleid, []);
    }
    seriesMap.get(taleid)!.push(post);
  });

  // Convert to SeriesInfo array
  const series: SeriesInfo[] = [];
  
  seriesMap.forEach((posts, taleid) => {
    // Sort chapters by chapter number
    const sortedChapters = posts
      .sort((a, b) => (a.data.chapter || 0) - (b.data.chapter || 0))
      .map(post => ({
        id: post.data.id || post.id,
        title: post.data.title,
        description: post.data.description,
        chapter: post.data.chapter || 1,
        date: post.data.date,
        lang: post.data.lang,
      }));

    // Find the first chapter that has maintitle and maindescription, or use first chapter
    const mainPost = posts.find(p => p.data.maintitle && p.data.maindescription) || posts[0];
    const firstChapter = sortedChapters[0];
    
    // Only include series that have at least one post with maintitle and maindescription
    if (mainPost && (mainPost.data.maintitle || mainPost.data.maindescription)) {
      series.push({
        taleid,
        maintitle: mainPost.data.maintitle || mainPost.data.title,
        maindescription: mainPost.data.maindescription || mainPost.data.description,
        chapters: sortedChapters,
        firstChapter,
        lang,
        totalChapters: sortedChapters.length,
        lastUpdated: new Date(Math.max(...sortedChapters.map(c => c.date.getTime()))),
      });
    }
  });

  // Sort series by last updated date (newest first)
  return series.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
}

export async function getStandaloneStoriesByLang(lang: string) {
  const allPosts = await getCollection('stories', ({ data }) => 
    data.lang === lang && !data.taleid
  );

  return allPosts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(post => ({
      id: post.data.id || post.id,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      lang: post.data.lang,
    }));
}

export async function getSeriesById(taleid: string, lang: string): Promise<SeriesInfo | null> {
  const series = await getSeriesByLang(lang);
  return series.find(s => s.taleid === taleid) || null;
}
