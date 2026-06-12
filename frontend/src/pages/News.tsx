import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { News as NewsType } from '../types';
import NewsCard from '../components/ui/NewsCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const News = () => {
  const { data: news, isLoading, error, refetch } = useQuery<NewsType[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const response = await api.get('/news');
      return response.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState retry={refetch} />
      ) : news && news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No news available</h3>
        </div>
      )}
    </div>
  );
};

export default News;
