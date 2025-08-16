import { getCollection } from 'astro:content';

export interface SeriesInfo {
  taleid: string;
  maintitle: string;
  maindescription: string;
  author: string;
  type: string;
  genre: string;
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

// Helper function to get metadata from Italian chapter 1
async function getSeriesMetadataFromItalian(taleid: string) {
  const italianChapter1 = await getCollection('stories', ({ data }) => 
    data.lang === 'it' && 
    data.taleid === taleid && 
    data.chapter === 1
  );

  if (italianChapter1.length > 0) {
    const metadata = italianChapter1[0].data;
    return {
      author: metadata.author || 'Unknown',
      type: metadata.type || 'story',
      genre: metadata.genre || '',
    };
  }

  // Fallback if no Italian chapter 1 found
  return {
    author: 'Unknown',
    type: 'story',
    genre: '',
  };
}

export async function getSeriesByLang(lang: string, type?: 'story' | 'comic'): Promise<SeriesInfo[]> {
  // First, get all posts that have taleid (series posts)
  const allSeriesPosts = await getCollection('stories', ({ data }) => 
    data.lang === lang && data.taleid && (type ? data.type === type : true)
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
  
  const processedSeries = await Promise.all(
    Array.from(seriesMap.entries()).map(async ([taleid, posts]) => {
      // Get metadata from Italian chapter 1
      const metadata = await getSeriesMetadataFromItalian(taleid);

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
        return {
          taleid,
          maintitle: mainPost.data.maintitle || mainPost.data.title,
          maindescription: mainPost.data.maindescription || mainPost.data.description,
          author: metadata.author,
          type: metadata.type,
          genre: metadata.genre,
          chapters: sortedChapters,
          firstChapter,
          lang,
          totalChapters: sortedChapters.length,
          lastUpdated: new Date(Math.max(...sortedChapters.map(c => c.date.getTime()))),
        };
      }
      return null;
    })
  );

  // Filter out null values and add to series array
  series.push(...processedSeries.filter(s => s !== null) as SeriesInfo[]);

  // Sort series by last updated date (newest first)
  return series.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
}

export async function getStandaloneStoriesByLang(lang: string, type?: 'story' | 'comic') {
  const allPosts = await getCollection('stories', ({ data }) => 
    data.lang === lang && !data.taleid && (type ? data.type === type : true)
  );

  // For standalone stories, we still use their own metadata since they don't have a taleid
  return allPosts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(post => ({
      id: post.data.id || post.id,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      lang: post.data.lang,
      author: post.data.author || 'Unknown',
      type: post.data.type || 'story',
      genre: post.data.genre || '',
    }));
}

export async function getSeriesById(taleid: string, lang: string, type?: 'story' | 'comic'): Promise<SeriesInfo | null> {
  const series = await getSeriesByLang(lang, type);
  return series.find(s => s.taleid === taleid) || null;
}

// Helper functions for specific content types
export async function getStorySeries(lang: string): Promise<SeriesInfo[]> {
  return getSeriesByLang(lang, 'story');
}

export async function getComicSeries(lang: string): Promise<SeriesInfo[]> {
  return getSeriesByLang(lang, 'comic');
}

export async function getStandaloneStories(lang: string) {
  return getStandaloneStoriesByLang(lang, 'story');
}

export async function getStandaloneComics(lang: string) {
  return getStandaloneStoriesByLang(lang, 'comic');
}
