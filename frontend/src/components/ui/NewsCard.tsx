import type { News } from '../../types';

interface NewsCardProps {
  news: News;
}

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground font-medium mb-2 flex justify-between">
          <span>{new Date(news.date).toLocaleDateString()}</span>
          <span>By {news.author}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
          {news.summary}
        </p>
        <button className="text-primary font-semibold hover:underline self-start mt-auto">
          Read Full Article &rarr;
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
