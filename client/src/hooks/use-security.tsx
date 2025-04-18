import { createContext, ReactNode, useContext, useState, useEffect } from "react";

type SecurityMode = "vulnerable" | "secure";

type LogEntry = {
  id: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: Date;
};

interface SecurityContextType {
  mode: SecurityMode;
  toggleMode: () => void;
  logs: LogEntry[];
  addLog: (message: string, type?: "info" | "warning" | "error") => void;
  clearLogs: () => void;
  isConsoleOpen: boolean;
  toggleConsole: () => void;
  sanitizeInput: (input: string) => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SecurityMode>("vulnerable");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Initialize with starter logs
  useEffect(() => {
    setLogs([
      {
        id: "system-init",
        message: "[System] Security console initialized. This console logs XSS attempts and system events.",
        type: "info",
        timestamp: new Date()
      },
      {
        id: "warning-mode",
        message: "[Warning] Security is currently in VULNERABLE mode. Toggle the security switch to enable protections.",
        type: "warning",
        timestamp: new Date()
      },
      {
        id: "alert-search",
        message: "[Alert] Search functionality is vulnerable to Reflected XSS attacks.",
        type: "error",
        timestamp: new Date()
      },
      {
        id: "alert-reviews",
        message: "[Alert] Review system is vulnerable to Stored XSS attacks.",
        type: "error",
        timestamp: new Date()
      },
      {
        id: "alert-cart",
        message: "[Alert] Shopping cart notes are vulnerable to DOM-based XSS attacks.",
        type: "error",
        timestamp: new Date()
      }
    ]);
  }, []);

  const toggleMode = () => {
    const newMode = mode === "vulnerable" ? "secure" : "vulnerable";
    setMode(newMode);
    addLog(
      newMode === "secure"
        ? "[System] Security mode activated. Input sanitization enabled."
        : "[Warning] Security mode deactivated. Site is now vulnerable to XSS attacks.",
      newMode === "secure" ? "info" : "warning"
    );
  };

  const addLog = (message: string, type: "info" | "warning" | "error" = "info") => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Keep last 100 logs
  };

  const clearLogs = () => {
    setLogs([{
      id: Date.now().toString(),
      message: "[System] Console cleared.",
      type: "info",
      timestamp: new Date()
    }]);
  };

  const toggleConsole = () => {
    setIsConsoleOpen(prev => !prev);
  };

  // This function will sanitize input if in secure mode, or return raw input if in vulnerable mode
  const sanitizeInput = (input: string): string => {
    if (mode === "secure") {
      // Basic sanitization for XSS
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    return input; // In vulnerable mode, return as-is
  };

  return (
    <SecurityContext.Provider
      value={{
        mode,
        toggleMode,
        logs,
        addLog,
        clearLogs,
        isConsoleOpen,
        toggleConsole,
        sanitizeInput
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
