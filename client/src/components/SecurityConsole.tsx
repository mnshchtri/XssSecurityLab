import { useState } from "react";
import { X, ChevronDown, ChevronUp, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSecurity } from "@/hooks/use-security";

export default function SecurityConsole() {
  const { logs, clearLogs, isConsoleOpen, toggleConsole } = useSecurity();
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (!isConsoleOpen) return null;

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <section className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white z-40">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900">
        <h3 className="font-mono text-sm">XSS Security Console</h3>
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            className="text-xs h-7 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white"
            onClick={clearLogs}
          >
            <Trash className="h-3 w-3 mr-1" /> Clear
          </Button>
          <Button 
            variant="ghost" 
            className="text-xs h-7 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white"
            onClick={toggleMinimize}
          >
            {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost"
            className="text-xs h-7 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white"
            onClick={toggleConsole}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="security-console p-2 text-xs">
          {logs.map((log) => (
            <p 
              key={log.id} 
              className={
                log.type === "info" 
                  ? "text-green-400" 
                  : log.type === "warning" 
                  ? "text-yellow-400" 
                  : "text-red-400"
              }
            >
              {log.message}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
