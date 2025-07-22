"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-github-canvas flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-500 text-xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-github-fg-default">
                  Something went wrong
                </h2>
                <p className="text-sm text-github-fg-muted">
                  An unexpected error occurred
                </p>
              </div>
            </div>

            {process.env.NEXT_PUBLIC_DEBUG_MODE === "true" && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-github-fg-muted hover:text-github-fg-default">
                  Error Details
                </summary>
                <div className="mt-2 p-3 bg-github-canvas-inset rounded border border-github-border-default">
                  <pre className="text-xs text-red-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#1f6feb] hover:bg-[#1f6feb]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="flex-1 bg-github-canvas-inset hover:bg-github-canvas-inset/80 text-github-fg-default px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-github-border-default"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 