import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f27 100%)',
          color: '#e2e8f0',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ marginBottom: '0.5rem' }}>Something went wrong!</h1>
          <p style={{ color: '#a0aec0', marginBottom: '2rem', maxWidth: '500px' }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #ff1493, #dd00ff)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
