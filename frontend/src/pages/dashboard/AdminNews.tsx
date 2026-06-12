import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import api from '../../services/api';
import type { News } from '../../types';
import ErrorState from '../../components/ui/ErrorState';

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
});

type NewsFormData = z.infer<typeof newsSchema>;

const AdminNews = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: news, isLoading, error, refetch } = useQuery<News[]>({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const response = await api.get('/admin/news'); // Assuming admin routes are set up this way, or we can use public GET
      return response.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      if (editingId) {
        return api.put(`/admin/news/${editingId}`, data);
      }
      return api.post('/admin/news', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
  });

  const openModal = (item?: News) => {
    if (item) {
      setEditingId(item._id);
      reset({
        title: item.title,
        summary: item.summary,
        content: item.content,
        author: item.author,
        imageUrl: item.imageUrl,
      });
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (data: NewsFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl"></div>;
  if (error) return <ErrorState retry={refetch} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage News</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove news articles.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Article
        </button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4 hidden md:table-cell">Author</th>
                <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news?.map((item) => (
                <tr key={item._id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt="" className="w-12 h-12 rounded object-cover border hidden sm:block" />
                      <div>
                        <p className="font-bold line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">{item.author}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            deleteMutation.mutate(item._id);
                          }
                        }} 
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Article' : 'Add New Article'}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input {...register('title')} className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input {...register('imageUrl')} className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.imageUrl && <p className="text-destructive text-sm mt-1">{errors.imageUrl.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input {...register('author')} className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    {errors.author && <p className="text-destructive text-sm mt-1">{errors.author.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <textarea {...register('summary')} rows={2} className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.summary && <p className="text-destructive text-sm mt-1">{errors.summary.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea {...register('content')} rows={5} className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                  <button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg font-medium border hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {mutation.isPending ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
