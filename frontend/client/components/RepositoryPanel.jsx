import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Github,
  Zap,
  RefreshCw,
  Copy,
  Star,
  GitFork,
  FileCode,
  FolderOpen,
  Clock,
  BarChart3,
  Package,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Database,
  Globe,
  Search,
  Check,
  PanelRightOpen,
  PanelRightClose
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";
import { Button } from "@/components/ui/button";

const loadingSteps = [
  "Cloning Repository",
  "Reading Files",
  "Parsing Source Code",
  "Generating Embeddings",
  "Building Vector Database"
];

function MultiStepLoader({ isAnalyzing, isAnalyzed }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      setActiveStepIndex(0);
      const interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2000); // Fake progress for UI demo
      return () => clearInterval(interval);
    }
    if (isAnalyzed) {
      setActiveStepIndex(loadingSteps.length);
    } else {
      setActiveStepIndex(0);
    }
  }, [isAnalyzing, isAnalyzed]);

  if (!isAnalyzing && !isAnalyzed) return null;
  if (!isAnalyzing && isAnalyzed) return null; // Only show while analyzing

  return (
    <div className="p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur-md max-w-md w-full mb-6">
      <div className="space-y-4">
        {loadingSteps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isActive = index === activeStepIndex;
          
          return (
            <div key={step} className={cn("flex items-center gap-3 transition-opacity duration-300", 
              isCompleted || isActive ? "opacity-100" : "opacity-40"
            )}>
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border text-[10px]",
                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                isActive ? "border-primary text-primary animate-pulse" : "border-muted-foreground text-transparent"
              )}>
                {isCompleted && <Check className="w-3 h-3" />}
              </div>
              <span className={cn("text-sm font-medium", isActive && "text-foreground animate-pulse")}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RepositoryPanel({ onToggleChat, isChatOpen }) {
  const { currentRepo, addRepo } = useRepo();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [tabContent, setTabContent] = useState({});
  const [isTabLoading, setIsTabLoading] = useState(false);

  const tabPrompts = {
    architecture: "Provide a detailed architecture overview of this repository. What are the main components and how do they interact?",
    documentation: "Generate a high-level documentation summary for this repository, explaining what it does and how to get started.",
    bugs: "Analyze the codebase for potential bugs, security vulnerabilities, or anti-patterns.",
    improvements: "Suggest code improvements, performance optimizations, and best practices that could be applied to this repository.",
    dependencies: "List and explain the main dependencies, libraries, and frameworks used in this repository.",
    api: "Outline the public API, endpoints, or primary exported functions/classes of this repository."
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "architecture", label: "Architecture", icon: Package },
    { id: "documentation", label: "Documentation", icon: BookOpen },
    { id: "bugs", label: "Bug Analysis", icon: AlertCircle },
    { id: "improvements", label: "Improvements", icon: Lightbulb },
    { id: "dependencies", label: "Dependencies", icon: Database },
    { id: "api", label: "API", icon: Globe },
  ];

  useEffect(() => {
    if (currentRepo) {
      // Fetch stats
      api.getRepoStats(currentRepo.repo_name)
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [currentRepo]);

  useEffect(() => {
    if (activeTab === "overview" || !currentRepo || !isAnalyzed) return;
    
    if (tabContent[activeTab]) return;

    const fetchTabContent = async () => {
      setIsTabLoading(true);
      try {
        const response = await api.analyzeRepo(currentRepo.repo_name, tabPrompts[activeTab]);
        setTabContent(prev => ({ ...prev, [activeTab]: response.answer }));
      } catch (err) {
        console.error(err);
        setTabContent(prev => ({ ...prev, [activeTab]: "Failed to load analysis for this section. Please ensure the repository is fully analyzed first." }));
      } finally {
        setIsTabLoading(false);
      }
    };

    fetchTabContent();
  }, [activeTab, currentRepo, isAnalyzed, tabContent]);

  const handleAnalyze = async () => {
    if (!currentRepo) return;
    setIsAnalyzing(true);
    try {
      await api.indexRepo(currentRepo.repo_name);
      setIsAnalyzed(true);
    } catch (e) {
      console.error(e);
      alert("Failed to analyze repository");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRepo = async (url) => {
    const targetUrl = url || repoUrl;
    if (!targetUrl) return;
    setIsAddingRepo(true);
    try {
      const response = await api.cloneRepo(targetUrl);
      if (response.success) {
        addRepo(response.data);
        setRepoUrl("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add repository");
    } finally {
      setIsAddingRepo(false);
    }
  };

  if (!currentRepo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background/50 h-full p-8 text-center relative">
        <div className="absolute top-4 right-4">
           {!isChatOpen && (
              <button 
                onClick={onToggleChat}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title="Open Chat"
              >
                <PanelRightOpen className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
        </div>
        <div className="w-16 h-16 bg-card border border-border/50 shadow-sm rounded-2xl flex items-center justify-center mb-6">
          <Github className="w-8 h-8 text-foreground/80" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">Analyze any Repository</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Paste a public GitHub repository URL to generate architecture diagrams, locate bugs, and search the codebase using AI.
        </p>
        
        <div className="w-full max-w-md relative flex items-center">
          <div className="absolute left-3 text-muted-foreground"><Search className="w-4 h-4" /></div>
          <input 
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={isAddingRepo}
            className="w-full pl-10 pr-24 py-3 bg-card border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors shadow-sm"
            placeholder="https://github.com/facebook/react"
            onKeyDown={(e) => e.key === 'Enter' && handleAddRepo()}
          />
          <Button 
            className="absolute right-1.5 h-8 px-4 text-xs"
            disabled={!repoUrl || isAddingRepo}
            onClick={() => handleAddRepo()}
          >
            {isAddingRepo ? "Adding..." : "Analyze"}
          </Button>
        </div>
        
        <div className="mt-8 flex gap-3 text-xs text-muted-foreground">
          <span>Try:</span>
          <button onClick={() => handleAddRepo("https://github.com/vercel/next.js")} className="hover:text-foreground underline decoration-border underline-offset-4">vercel/next.js</button>
          <button onClick={() => handleAddRepo("https://github.com/shadcn-ui/ui")} className="hover:text-foreground underline decoration-border underline-offset-4">shadcn-ui/ui</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {currentRepo.repo_name}
              <span className="px-2 py-0.5 bg-card rounded-md text-[10px] font-medium text-muted-foreground border border-border/50 uppercase tracking-wider">
                main
              </span>
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
              {currentRepo.local_path}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium text-sm shadow-sm"
          >
            <Zap className="w-4 h-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
          </button>
          <button className="flex items-center justify-center p-2 bg-card border border-border/60 text-foreground rounded-lg hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          {!isChatOpen && (
            <button 
              onClick={onToggleChat}
              className="flex items-center justify-center p-2 bg-card border border-border/60 text-foreground rounded-lg hover:bg-muted transition-colors ml-2"
              title="Open Chat"
            >
              <PanelRightOpen className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Sleek Tabs Navigation */}
      <div className="px-6 py-2 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto">
            {isAnalyzing && <MultiStepLoader isAnalyzing={isAnalyzing} isAnalyzed={isAnalyzed} />}
            
            {/* Premium Stats Card */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Files Indexed", value: stats?.total_files || "-", icon: FileCode, color: "text-blue-500" },
                { label: "Characters", value: stats?.total_characters ? (stats.total_characters/1000).toFixed(1) + 'k' : "-", icon: BarChart3, color: "text-purple-500" },
                { label: "Semantic Chunks", value: stats?.chunks || "-", icon: Database, color: "text-emerald-500" },
                { label: "Analysis Status", value: isAnalyzed ? "Complete" : "Pending", icon: isAnalyzed ? Check : Clock, color: isAnalyzed ? "text-success" : "text-warning" }
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-xl border border-border/40 bg-card/20 hover:bg-card/40 transition-colors flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-semibold text-foreground/90">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Placeholder for where actual markdown overview would go */}
            <div className="rounded-xl border border-border/40 bg-card/20 p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground/80 mb-2">Repository Overview</h3>
              <p className="max-w-md mx-auto text-sm">
                Run the analysis to generate a comprehensive overview of this repository, including its architecture, core technologies, and structure.
              </p>
            </div>
          </div>
        )}
        
        {activeTab !== "overview" && (
          <div className="max-w-5xl mx-auto">
            {!isAnalyzed ? (
              <div className="rounded-xl border border-border/40 bg-card/20 p-8 text-center text-muted-foreground flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground/80 mb-2">Analysis Required</h3>
                <p className="max-w-md mx-auto text-sm">
                  Please run the repository analysis first (click "Analyze Repository") to view the {tabs.find(t => t.id === activeTab)?.label}.
                </p>
              </div>
            ) : isTabLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="flex space-x-1 items-center mb-4">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                </div>
                <p className="text-sm">Generating AI analysis for {tabs.find(t => t.id === activeTab)?.label}...</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border/40 bg-card/20 p-8 shadow-sm">
                <div className="prose prose-slate max-w-none text-foreground/90 leading-relaxed break-words">
                  <ReactMarkdown>{tabContent[activeTab] || ""}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
