import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WildBuddy Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-nature-lg border border-sage-border text-center">
            <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-charcoal mb-2">Something went sideways</h2>
            <p className="text-sm text-charcoal-muted mb-4">
              {this.state.error?.message || 'An unexpected error occurred in the application.'}
            </p>
            <Button
              variant="primary"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => window.location.reload()}
            >
              Reload WildBuddy
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
