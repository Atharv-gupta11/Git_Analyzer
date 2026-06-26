import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RepositoryPanel } from "@/components/RepositoryPanel";
import { AIChatPanel } from "@/components/AIChatPanel";

export default function Index() {
  const [showRepositoryPanel, setShowRepositoryPanel] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex overflow-hidden">
        {/* Repository Panel - Collapsible on smaller screens */}
        <div
          className={`${
            showRepositoryPanel ? "block" : "hidden"
          } lg:block w-full lg:w-1/2 flex-1`}
        >
          <RepositoryPanel
            onToggleCollapse={() => setShowRepositoryPanel(false)}
          />
        </div>

        {/* AI Chat Panel */}
        <div className="flex-1 w-full lg:w-1/2">
          <AIChatPanel
            onToggleRepositoryPanel={() => setShowRepositoryPanel(true)}
          />
        </div>
      </div>
    </div>
  );
}
