import React, { useState } from 'react';
import { ActiveTab, Issue, User } from '../../types/jira';
import { StorageService } from '../../services/storage';
import { downloadStarterProjectZip } from '../../utils/exportProject';
import { 
  ArrowRight, 
  Columns3, 
  Database, 
  Terminal, 
  Download, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Users, 
  Clock, 
  Copy, 
  Check, 
  Laptop, 
  Sparkles,
  BarChart3,
  Code2,
  ExternalLink,
  ChevronRight,
  Zap,
  Lock,
  GitBranch,
  Server
} from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { TypeIcon } from '../common/TypeIcon';

interface ProductWebPageProps {
  onLaunchApp: (tab?: ActiveTab) => void;
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
}

export const ProductWebPage: React.FC<ProductWebPageProps> = ({
  onLaunchApp,
  issues,
  users,
  onSelectIssue,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState<'board' | 'schema' | 'terminal'>('board');
  const [demoSelectedStatus, setDemoSelectedStatus] = useState<string>('ALL');
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const metrics = StorageService.getDashboardMetrics();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadStarterProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubmitted(true);
    }
  };

  const filteredDemoIssues = demoSelectedStatus === 'ALL'
    ? issues.slice(0, 4)
    : issues.filter(i => i.status === demoSelectedStatus);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Standalone Web Page Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">ProTrack</span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase leading-none mt-1">Enterprise Jira</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors whitespace-nowrap">Features</a>
            <a href="#interactive-demo" className="hover:text-slate-900 transition-colors whitespace-nowrap">Live Demo</a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors whitespace-nowrap">Architecture</a>
            <a href="#quickstart" className="hover:text-slate-900 transition-colors whitespace-nowrap">Local Setup</a>
            <button onClick={() => onLaunchApp('backend-code')} className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer">
              API Docs
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onLaunchApp('board')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 lg:px-12 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Full-Stack Starter: React 19 + Java 21 Spring Boot 3 + MySQL 8.0</span>
          </div>

          {/* Main Headline & Value Proposition */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]" style={{ textWrap: 'balance' }}>
              The Jira-grade issue tracker built for high-velocity software teams.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              ProTrack delivers an agile tracking experience with interactive Kanban boards, 4-stage lifecycle workflows, developer workload telemetry, and production-ready Java Spring Boot & MySQL code designed to run directly on your laptop.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLaunchApp('board')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Columns3 className="w-4 h-4" />
                <span>Launch Live Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Packaging ZIP...' : 'Download Starter Code (.zip)'}</span>
              </button>

              <button
                onClick={() => onLaunchApp('backend-code')}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
              >
                Explore Backend Hub
              </button>
            </div>
          </div>

          {/* Hero Photography & Proof Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-900 group">
            <img
              src="/src/assets/images/hero_jira_software_product_1792734528627.jpg"
              alt="ProTrack Engineering Console"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-101 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Workstation Architecture</span>
                  </div>
                  <h3 className="text-lg font-bold">Dual-Screen Engineering Setup</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Live React 19 Kanban board synced with Java 21 Spring Boot REST APIs and MySQL 8.0.
                  </p>
                </div>

                <button
                  onClick={() => onLaunchApp('board')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Test Board In Realtime &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Architectural Trust Markers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Stateless JWT Auth (HS256)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>InnoDB Composite Indexes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>4-Stage Lifecycle Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero-Cloud Local Portability</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quantitative Telemetry Strip */}
      <section className="py-8 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.total}
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Pre-Seeded Issues</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Bugs, Tasks & Stories ready to triage</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
              {metrics.pending}
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Active Pipeline</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{metrics.openCount} Open · {metrics.inProgressCount} In Progress</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {metrics.resolved}
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Resolved Deliverables</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{metrics.resolvedCount} Resolved · {metrics.closedCount} Closed</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
              &lt; 15ms
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Local Response Time</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Optimized with composite indexes</p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Demo Section */}
      <section id="interactive-demo" className="py-20 px-6 lg:px-12 bg-[#F4F5F7] border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Live Playground</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                Test the Jira Workflow Right on this Page
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Filter sample tickets below or jump straight into the full interactive Kanban board to reassign developers, move cards, or post discussion comments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLaunchApp('board')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Open Full Board Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Filter Strip */}
          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setDemoSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  demoSelectedStatus === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {st === 'ALL' ? 'All Stages' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Demo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDemoIssues.map(issue => {
              const assignee = users.find(u => u.id === issue.assigneeId);
              return (
                <div
                  key={issue.id}
                  onClick={() => {
                    onSelectIssue(issue);
                    onLaunchApp('board');
                  }}
                  className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-lg p-4 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon type={issue.issueType} />
                      <span className="font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {issue.key}
                      </span>
                    </div>
                    <PriorityBadge priority={issue.priority} showIconOnly />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                    {issue.title}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <StatusBadge status={issue.status} />
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {assignee ? assignee.fullName : 'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onLaunchApp('board')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all {issues.length} issues in the full Kanban workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Core Capabilities (Bento Grid) */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Comprehensive Architecture</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Everything required to track software with clarity
            </h2>
            <p className="text-sm text-slate-500">
              ProTrack removes enterprise clutter while retaining the rigor required for mission-critical software delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Columns3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">01. 4-Stage Lifecycle Governance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear progression through Open, In Progress, Resolved, and Closed states with automatic transition validation and column story point sums.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">02. Priority & Blocker Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Color-coded triage badges for Low, Medium, High, and Critical tickets with dedicated dashboard blocker alerts.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">03. Developer Workload Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Developer-wise workload tables and completion velocity percentages computed in real time to prevent bottlenecks.
              </p>
            </div>

            {/* Box 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">04. Discussion Threads & Subtasks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated technical discussion panel inside each issue modal with author roles, timestamps, and interactive checklist items.
              </p>
            </div>

            {/* Box 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">05. MySQL 8.0 DDL & Indexing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Normalized schema with composite indexes on (status, priority) and (assignee_id, status) ensuring rapid query response.
              </p>
            </div>

            {/* Box 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">06. Spring Security 6 & JWT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stateless OncePerRequestFilter with HMAC-SHA256 signature verification, BCrypt password hashing, and role authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Architecture & Codebase Hub Section */}
      <section id="architecture" className="py-20 px-6 lg:px-12 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Complete Backend Stack</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                Spring Boot 3 + MySQL Starter Code Included
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Inspect real production code: Security configurations, JWT providers, JPA repositories, and DDL scripts.
              </p>
            </div>

            <button
              onClick={() => onLaunchApp('backend-code')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Architecture Explorer</span>
            </button>
          </div>

          {/* Architecture Visual Preview Card */}
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl text-slate-200">
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 font-mono text-xs text-slate-400">backend/src/main/resources/schema.sql</span>
              </div>
              <button
                onClick={() => handleCopy('CREATE TABLE IF NOT EXISTS issues (id BIGINT AUTO_INCREMENT PRIMARY KEY, issue_key VARCHAR(20) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, status ENUM("OPEN","IN_PROGRESS","RESOLVED","CLOSED")...);', 'ddl_prev')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedCmd === 'ddl_prev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'ddl_prev' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`-- MySQL 8.0 DDL Engine: Issues Table with Composite Indexes
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_key VARCHAR(20) NOT NULL UNIQUE,
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_type ENUM('BUG', 'TASK', 'STORY', 'IMPROVEMENT') NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    story_points INT DEFAULT 3,
    assignee_id BIGINT DEFAULT NULL,
    reporter_id BIGINT NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issues_assignee FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_issues_status_priority (status, priority),
    INDEX idx_issues_assignee_status (assignee_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
            </pre>
          </div>
        </div>
      </section>

      {/* 7. Local Laptop Quickstart Guide */}
      <section id="quickstart" className="py-20 px-6 lg:px-12 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">Local Workstation Setup</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Run ProTrack on your laptop in 3 commands
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Clone, run Docker for MySQL, and launch the Spring Boot backend with Maven.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Starter (.zip)</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Command 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 1: Start MySQL 8.0 with pre-loaded schema & seed data</p>
                <code className="text-sm font-mono text-emerald-400">docker compose up -d mysql</code>
              </div>
              <button
                onClick={() => handleCopy('docker compose up -d mysql', 'c1')}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Command 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 2: Start Spring Boot 3 Backend on port 8080</p>
                <code className="text-sm font-mono text-emerald-400">cd backend && ./mvnw clean spring-boot:run</code>
              </div>
              <button
                onClick={() => handleCopy('cd backend && ./mvnw clean spring-boot:run', 'c2')}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Command 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 3: Start Vite Dev Server on port 3000</p>
                <code className="text-sm font-mono text-emerald-400">cd frontend && npm install && npm run dev</code>
              </div>
              <button
                onClick={() => handleCopy('cd frontend && npm install && npm run dev', 'c3')}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action / Roadmap Section */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Ready to track with clarity?
          </h2>
          <p className="text-sm text-slate-600">
            Launch the interactive workspace directly in your browser or download the full-stack project ZIP to start building locally.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onLaunchApp('board')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Starter Code</span>
            </button>
          </div>

          {/* Lead capture */}
          <div className="pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">Join other engineers receiving our Spring Boot architecture blueprints:</p>
            {emailSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Architecture guide sent to {emailInput}</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Standalone Website Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">ProTrack Issue Tracker</p>
              <p className="text-[11px] text-slate-400 leading-tight">React 19 · Spring Boot 3 · MySQL 8.0</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => onLaunchApp('board')} className="hover:text-slate-900 cursor-pointer">
              Kanban Board
            </button>
            <button onClick={() => onLaunchApp('issues-list')} className="hover:text-slate-900 cursor-pointer">
              All Issues
            </button>
            <button onClick={() => onLaunchApp('dashboard')} className="hover:text-slate-900 cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => onLaunchApp('reports')} className="hover:text-slate-900 cursor-pointer">
              Reports
            </button>
            <button onClick={() => onLaunchApp('backend-code')} className="hover:text-slate-900 cursor-pointer">
              Spring Boot Code
            </button>
            <button onClick={() => onLaunchApp('database-schema')} className="hover:text-slate-900 cursor-pointer">
              MySQL DDL
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; 2026 ProTrack Systems. Open-source MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
};
