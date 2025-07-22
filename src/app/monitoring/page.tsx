"use client";

import MonitoringDashboard from "@/components/MonitoringDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ClientOnly from "@/components/ClientOnly";

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-github-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-github-fg-default">
                System Monitoring
              </h1>
              <p className="mt-2 text-github-fg-muted">
                Real-time monitoring of WhatsApp sessions, rate limits, and system health
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-github-fg-muted">Live</span>
            </div>
          </div>
        </div>

        {/* Monitoring Dashboard */}
        <ErrorBoundary>
          <MonitoringDashboard />
        </ErrorBoundary>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
            <h3 className="text-lg font-semibold text-github-fg-default mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/status"
                className="block w-full bg-[#1f6feb] hover:bg-[#1f6feb]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                View Session Status
              </a>
              <a
                href="/setup"
                className="block w-full bg-github-canvas-inset hover:bg-github-canvas-inset/80 text-github-fg-default px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center border border-github-border-default"
              >
                Create New Session
              </a>
              <a
                href="https://platform.seemoai.com/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-github-canvas-inset hover:bg-github-canvas-inset/80 text-github-fg-default px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center border border-github-border-default"
              >
                API Documentation
              </a>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
            <h3 className="text-lg font-semibold text-github-fg-default mb-4">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-github-fg-muted">Backend URL:</span>
                <span className="text-github-fg-default font-mono">
                  {process.env.NEXT_PUBLIC_API_URL || 'https://platform.seemoai.com/api'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-github-fg-muted">Environment:</span>
                <span className="text-github-fg-default capitalize">
                  {process.env.NEXT_PUBLIC_APP_ENV || 'development'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-github-fg-muted">Debug Mode:</span>
                <span className="text-github-fg-default">
                  {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-github-fg-muted">Last Updated:</span>
                <ClientOnly fallback={<span className="text-github-fg-muted">Loading...</span>}>
                  <span className="text-github-fg-default">
                    {new Date().toLocaleString()}
                  </span>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Ban Guidelines */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-500 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Anti-Ban Guidelines</h3>
              <div className="text-sm text-yellow-300 space-y-2">
                <p>• <strong>Message Limits:</strong> New numbers: max 20/day for first 10 days</p>
                <p>• <strong>Delays:</strong> 30-60 seconds between messages</p>
                <p>• <strong>Content:</strong> Avoid spam, gambling, scams</p>
                <p>• <strong>Warming:</strong> Use numbers normally for 10 days first</p>
                <p>• <strong>Monitoring:</strong> Watch for warnings/restrictions</p>
              </div>
              <a
                href="/SeemoAi-whatsappBack/Usage%20Guidelines.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                Read Full Guidelines →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 