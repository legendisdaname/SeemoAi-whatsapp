import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://platform.seemoai.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "default-dev-key-change-in-production",
  },
  timeout: 30000, // 30 second timeout
});

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WhatsAppSession {
  id: string;
  status: "initializing" | "qr" | "authenticated" | "ready" | "disconnected";
  qrCode?: string;
  clientInfo?: {
    pushname: string;
    wid: string;
    platform: string;
  };
}

export interface SendMessageRequest {
  to: string;
  message: string;
}

export interface SendMediaRequest {
  to: string;
  file: File;
  caption?: string;
}

export interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    whatsapp: {
      activeSessions: number;
      maxSessions: number;
    };
    rateLimit: {
      globalHourlyCount: number;
      globalHourlyLimit: number;
      activeSessions: number;
      timeUntilReset: number;
    };
  };
  config: {
    messageDelayMs: number;
    maxMessagesPerHour: number;
    enableAntiBan: boolean;
  };
}

export const whatsappApi = {
  // Session management
  async createSession(
    sessionId?: string
  ): Promise<ApiResponse<WhatsAppSession>> {
    const response = await api.post("/sessions", { sessionId });
    return response.data;
  },

  async getAllSessions(): Promise<ApiResponse<WhatsAppSession[]>> {
    const response = await api.get("/sessions");
    return response.data;
  },

  async getSessionStatus(
    sessionId: string
  ): Promise<ApiResponse<WhatsAppSession>> {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  async logout(sessionId: string): Promise<ApiResponse> {
    const response = await api.post(`/sessions/${sessionId}/logout`);
    return response.data;
  },

  async destroySession(sessionId: string): Promise<ApiResponse> {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },

  // Messaging
  async sendTextMessage(
    sessionId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<{ messageId: string }>> {
    const response = await api.post(`/sessions/${sessionId}/send-text`, data);
    return response.data;
  },

  async sendMediaMessage(
    sessionId: string,
    data: SendMediaRequest
  ): Promise<ApiResponse<{ messageId: string }>> {
    const formData = new FormData();
    formData.append("to", data.to);
    formData.append("file", data.file);
    if (data.caption) {
      formData.append("caption", data.caption);
    }

    const response = await api.post(
      `/sessions/${sessionId}/send-media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<ApiResponse<HealthData>> {
    const response = await api.get("/health");
    return response.data;
  },
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    let message = "Unknown error occurred";
    
    if (error.response) {
      // Server responded with error status
      message = error.response.data?.error || `HTTP ${error.response.status}`;
      
      if (error.response.status === 401) {
        message = "Authentication failed. Please check your API key.";
      } else if (error.response.status === 429) {
        message = "Rate limit exceeded. Please try again later.";
      } else if (error.response.status === 413) {
        message = "Request too large. Please reduce file size.";
      }
    } else if (error.request) {
      // Network error
      message = "Network error. Please check your connection.";
    } else {
      // Other error
      message = error.message;
    }
    
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      console.error("API Error:", {
        message,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
      });
    }
    
    return Promise.reject(new Error(message));
  }
);
