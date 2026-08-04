import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[System Error Boundary Intercepted]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6">
          <div className="apple-card p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-xl border border-red-200 bg-red-50/20">
            <span className="material-symbols-outlined text-red-500 text-5xl">warning</span>
            <h2 className="text-xl font-black text-primary">System Telemetry Intercepted</h2>
            <p className="text-xs text-primary-muted font-medium">
              An unexpected render issue occurred. The system has safely isolated the state.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              🔄 Reload & Recover Telemetry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
