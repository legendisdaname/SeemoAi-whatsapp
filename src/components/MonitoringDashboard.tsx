"use client";

import { useCallback, useEffect, useState } from "react";
import { whatsappApi, HealthData } from "@/lib/api";
import ClientOnly from "./ClientOnly";

interface RateLimitData {
  sessions: Array<{
    sessionId: string;
    status: {
      canSend: boolean;
      timeUntilNextMessage: number;
      hourlyCount: number;
      hourlyLimit: number;
      globalCount: number;
      globalLimit: number;
    };
  }>;
  global: {
    globalHourlyCount: number;
    globalHourlyLimit: number;
    activeSessions: number;
    timeUntilReset: number;
  };
}

export default function MonitoringDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [rateLimitData, setRateLimitData] = useState<RateLimitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    try {
      const response = await whatsappApi.healthCheck();
      if (response.success && response.data) {
        setHealthData(response.data);
      }
    } catch (err) {
      console.error("Error fetching health data:", err);
    }
  };

  const fetchRateLimitData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/rate-limits`);
      const data = await response.json();
      if (data.success) {
        setRateLimitData(data.data);
      }
    } catch (err) {
      console.error("Error fetching rate limit data:", err);
    }
  };

  const updateData = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      await Promise.all([fetchHealthData(), fetchRateLimitData()]);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch monitoring data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateData();
    
    // Update every 30 seconds
    const interval = setInterval(updateData, 30000);
    
    return () => clearInterval(interval);
  }, [updateData]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatTimeUntilReset = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading && !healthData) {
    return (
      <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-github-canvas-inset rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-github-canvas-inset rounded"></div>
            <div className="h-3 bg-github-canvas-inset rounded w-5/6"></div>
            <div className="h-3 bg-github-canvas-inset rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400">Monitoring Error</h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={updateData}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-github-fg-default">System Health</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${healthData?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-github-fg-muted capitalize">{healthData?.status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-github-fg-muted">Uptime</p>
            <p className="text-lg font-semibold text-github-fg-default">
              {healthData ? formatUptime(healthData.uptime) : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Version</p>
            <p className="text-lg font-semibold text-github-fg-default">{healthData?.version || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Environment</p>
            <p className="text-lg font-semibold text-github-fg-default capitalize">{healthData?.environment || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Last Update</p>
            <ClientOnly fallback={<p className="text-lg font-semibold text-github-fg-muted">Loading...</p>}>
              <p className="text-lg font-semibold text-github-fg-default">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
              </p>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* WhatsApp Sessions */}
      <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
        <h3 className="text-lg font-semibold text-github-fg-default mb-4">WhatsApp Sessions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-github-fg-muted">Active Sessions</p>
            <p className="text-2xl font-bold text-github-fg-default">
              {healthData?.services.whatsapp.activeSessions || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Max Sessions</p>
            <p className="text-2xl font-bold text-github-fg-default">
              {healthData?.services.whatsapp.maxSessions || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Usage</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-github-canvas-inset rounded-full h-2">
                <div 
                  className="bg-[#1f6feb] h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${healthData ? (healthData.services.whatsapp.activeSessions / healthData.services.whatsapp.maxSessions) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <span className="text-sm text-github-fg-muted">
                {healthData ? Math.round((healthData.services.whatsapp.activeSessions / healthData.services.whatsapp.maxSessions) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
        <h3 className="text-lg font-semibold text-github-fg-default mb-4">Rate Limiting</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-github-fg-muted">Global Messages</p>
            <p className="text-2xl font-bold text-github-fg-default">
              {rateLimitData?.global.globalHourlyCount || 0} / {rateLimitData?.global.globalHourlyLimit || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Active Sessions</p>
            <p className="text-2xl font-bold text-github-fg-default">
              {rateLimitData?.global.activeSessions || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Reset In</p>
            <p className="text-2xl font-bold text-github-fg-default">
              {rateLimitData ? formatTimeUntilReset(rateLimitData.global.timeUntilReset) : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Anti-Ban</p>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${healthData?.config.enableAntiBan ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-github-fg-muted">
                {healthData?.config.enableAntiBan ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Session Rate Limits */}
        {rateLimitData?.sessions && rateLimitData.sessions.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-github-fg-default mb-3">Session Limits</h4>
            <div className="space-y-3">
              {rateLimitData.sessions.map((session) => (
                <div key={session.sessionId} className="bg-github-canvas-inset border border-github-border-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-github-fg-default">{session.sessionId}</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      session.status.canSend ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {session.status.canSend ? 'Can Send' : 'Rate Limited'}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-github-fg-muted">Hourly: </span>
                      <span className="text-github-fg-default">{session.status.hourlyCount}/{session.status.hourlyLimit}</span>
                    </div>
                    <div>
                      <span className="text-github-fg-muted">Global: </span>
                      <span className="text-github-fg-default">{session.status.globalCount}/{session.status.globalLimit}</span>
                    </div>
                    <div>
                      <span className="text-github-fg-muted">Wait: </span>
                      <span className="text-github-fg-default">
                        {session.status.timeUntilNextMessage > 0 ? `${Math.ceil(session.status.timeUntilNextMessage / 1000)}s` : 'Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="bg-github-canvas-subtle border border-github-border-default rounded-lg p-6">
        <h3 className="text-lg font-semibold text-github-fg-default mb-4">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-github-fg-muted">Message Delay</p>
            <p className="text-lg font-semibold text-github-fg-default">
              {healthData ? Math.round(healthData.config.messageDelayMs / 1000) : 0}s
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Max Messages/Hour</p>
            <p className="text-lg font-semibold text-github-fg-default">
              {healthData?.config.maxMessagesPerHour || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-github-fg-muted">Anti-Ban Protection</p>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${healthData?.config.enableAntiBan ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-github-fg-muted">
                {healthData?.config.enableAntiBan ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 