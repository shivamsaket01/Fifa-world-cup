import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

const ErrorState = ({ message = 'Something went wrong while loading data.', retry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-destructive/5 text-destructive">
      <AlertCircle className="h-12 w-12 mb-4 opacity-80" />
      <h3 className="text-xl font-bold mb-2">Oops!</h3>
      <p className="opacity-80 mb-6">{message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="bg-destructive text-destructive-foreground px-6 py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
