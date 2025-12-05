// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Component Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <h2>Something went wrong</h2>
                        <p>This component encountered an error and couldn't render properly.</p>
                        <details>
                            <summary>Error Details</summary>
                            <pre>{this.state.error?.toString()}</pre>
                        </details>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="retry-button"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;