import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RepositoryPanel } from "@/components/RepositoryPanel";
import { AIChatPanel } from "@/components/AIChatPanel";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

export default function Index() {
  const [showChatPanel, setShowChatPanel] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Sidebar - Flex child now, handles its own width */}
      <div className="hidden lg:flex w-64 flex-shrink-0 border-r border-border/40 bg-sidebar/50 backdrop-blur-xl z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Repository Panel */}
        <div className="flex-1 min-w-0 overflow-hidden bg-background flex flex-col">
          <RepositoryPanel 
            onToggleChat={() => setShowChatPanel(!showChatPanel)}
            isChatOpen={showChatPanel}
          />
        </div>

        {/* AI Chat Panel - Fixed width right sidebar */}
        {showChatPanel && (
          <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 border-l border-border/40 bg-card/20 backdrop-blur-sm flex flex-col z-10 shadow-xl lg:shadow-none absolute lg:relative right-0 h-full">
            <AIChatPanel
              onClose={() => setShowChatPanel(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
