export interface NewsItem {
  id: number;
  title: string;
  points: number;
  author: string;
  published: string;
  url: string | null;
  text: string | null;
  comments: number;
}
