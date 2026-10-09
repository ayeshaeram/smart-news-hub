import rawArticles from './articles.json';

export interface Article {
  id: string;
  title: string;
  category: 'Tech' | 'Business' | 'World' | 'Science' | 'Sports';
  summary: string;
  fullText: string;
  image: string;
  date: string;
  source: string;
  readTime: string;
  listenTimeSeconds: number;
  dataStoryId?: string;
}

export const ARTICLES: Article[] = rawArticles as Article[];

export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'All') return ARTICLES;
  return ARTICLES.filter((a) => a.category.toLowerCase() === category.toLowerCase());
}
