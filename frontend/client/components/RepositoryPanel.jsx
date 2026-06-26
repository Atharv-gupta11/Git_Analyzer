import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";

export function RepositoryPanel({ onToggleCollapse }) {
  const { currentRepo } = useRepo();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

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

  if (!currentRepo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background h-screen text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 bg-sidebar-accent rounded-full flex items-center justify-center mb-6">
          <Github className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Repository Selected</h2>
        <p className="text-sm max-w-sm">
          Add or select a repository from the sidebar to begin analyzing its codebase.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden h-screen">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {currentRepo.repo_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Local path: {currentRepo.local_path}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-card rounded-full text-xs font-medium text-foreground border border-border">
              main
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium text-sm"
          >
            <Zap className="w-4 h-4" />
            {isAnalyzing ? "Analyzing (Indexing)..." : "Analyze"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-sidebar-accent transition-colors font-medium text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-sidebar-accent transition-colors font-medium text-sm">
            <Copy className="w-4 h-4" />
            Clone
          </button>
        </div>
      </div>

      {/* Repository Summary Card */}
      <div className="px-6 py-4 overflow-y-auto">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground font-medium">
                  Files
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {stats ? stats.total_files : "-"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  Characters
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {stats ? stats.total_characters : "-"}
              </p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Status
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAnalyzed ? (
                  <>
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm font-medium text-success">
                      Analysis Complete
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm font-medium text-warning">
                      Not Analyzed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
