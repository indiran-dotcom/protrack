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
  Code2
} from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { TypeIcon } from '../common/TypeIcon';

interface LandingViewProps {
  onNavigate: (tab: ActiveTab) => void;
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  issues,
  users,
  onSelectIssue,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackEmail.trim()) {
      setFeedbackSubmitted(true);
    }
  };

  const previewIssues = issues.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto bg-white text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-6 lg:px-12 border-b border-slate-200 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-6xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Complete Full-Stack Starter: React 19 + Spring Boot 3 + MySQL 8.0</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]" style={{ textWrap: 'balance' }}>
                The Jira-grade issue tracker built for high-velocity software engineering.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                ProTrack delivers a high-density Scrum and Kanban tracking experience paired with a production-ready Java 21 Spring Boot REST API and MySQL 8.0 schema. Runs out-of-the-box on your local laptop.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('board')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Columns3 className="w-4 h-4" />
                  <span>Launch Live Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Packaging ZIP...' : 'Download Starter Code (.zip)'}</span>
                </button>

                <button
                  onClick={() => onNavigate('backend-code')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  View Architecture & DDL
                </button>
              </div>

              {/* Trust & Architecture Markers */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Stateless JWT Auth (HS256)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  InnoDB Composite Indexes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Docker Compose Ready
                </span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_jira_software_product_1792734528627.jpg"
                  alt="ProTrack Engineering Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <p className="font-mono font-bold text-emerald-400">ProTrack v1.0 Production Architecture</p>
                    <p className="text-slate-300 text-[11px] mt-0.5">Dual-monitor developer workflow: Kanban Board + Spring Boot 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="py-6 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.total}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">Sample Issues Loaded</p>
          </div>
          <div className="p-3">
            <span className="text-2xl lg:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
              4 Stages
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">Open · In Prog · Resolved · Closed</p>
          </div>
          <div className="p-3">
            <span className="text-2xl lg:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              100%
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">Local Laptop Portable</p>
          </div>
          <div className="p-3">
            <span className="text-2xl lg:text-3xl font-extrabold text-purple-600 font-mono tabular-nums">
              REST APIs
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">Spring Security 6 with JWT</p>
          </div>
        </div>
      </section>

      {/* 3. Live Embedded Board Preview */}
      <section className="py-16 px-6 lg:px-12 bg-[#F4F5F7] border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interactive Live Preview</span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Experience the 4-Stage Kanban Workflow
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Click any issue card below to launch full discussion notes, checklists, and assignment attributes.
              </p>
            </div>

            <button
              onClick={() => onNavigate('board')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <span>Open Full Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini 4-Column Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map(status => {
              const columnIssues = issues.filter(i => i.status === status);
              return (
                <div key={status} className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{status.replace('_', ' ')}</span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">{columnIssues.length} issues</span>
                  </div>

                  <div className="space-y-2">
                    {columnIssues.slice(0, 2).map(issue => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          onSelectIssue(issue);
                          onNavigate('board');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-md transition-colors cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-700">{issue.key}</span>
                          <PriorityBadge priority={issue.priority} showIconOnly />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{issue.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities (Bento Grid) */}
      <section className="py-16 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Engineered for Velocity</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Built with professional engineering discipline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Every feature requested by modern development teams—without heavy SaaS overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Columns3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">01. 4-Stage Lifecycle Governance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track tickets across Open, In Progress, Resolved, and Closed states with drag-and-drop mechanics and column point totals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">02. Priority & Blocker Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distinct color tags for Low, Medium, High, and Critical priorities with proactive alerting on unmitigated blockers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">03. Developer Workload Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Developer-wise workload distribution matrices and completion velocity progress bars calculated in real time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">04. Discussion Panel & Subtasks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-ticket collaboration thread for developers and testers to post technical notes with author avatars and timestamps.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">05. MySQL 8.0 DDL & Indexes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean relational schema with composite indexes on (status, priority) and (assignee_id, status) for sub-millisecond lookups.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">06. Spring Boot 3 REST API</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spring Security 6 stateless JWT Bearer token filter, JPA entity mappings, and clean RESTful controllers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Local Workstation Quickstart */}
      <section className="py-16 px-6 lg:px-12 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">Developer Local Target</span>
              <h2 className="text-2xl font-bold tracking-tight mt-1">Run on your laptop in 3 commands</h2>
              <p className="text-xs text-slate-400 mt-1">Docker Compose spins up MySQL 8.0, then launch Spring Boot and Vite.</p>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-md flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Starter Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Command 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 1: Start MySQL 8.0 container</p>
                <code className="text-sm font-mono text-emerald-400">docker compose up -d mysql</code>
              </div>
              <button
                onClick={() => handleCopy('docker compose up -d mysql', 'c1')}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Command 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 2: Start Spring Boot 3 Backend</p>
                <code className="text-sm font-mono text-emerald-400">cd backend && ./mvnw spring-boot:run</code>
              </div>
              <button
                onClick={() => handleCopy('cd backend && ./mvnw spring-boot:run', 'c2')}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Command 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1"># Step 3: Start Vite Dev Server</p>
                <code className="text-sm font-mono text-emerald-400">cd frontend && npm install && npm run dev</code>
              </div>
              <button
                onClick={() => handleCopy('cd frontend && npm install && npm run dev', 'c3')}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'c3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Lead / Developer Feedback Capture */}
      <section className="py-16 px-6 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Request Custom Modules or Architecture Consulting</h2>
          <p className="text-xs text-slate-500">
            Need custom JQL filters, GitHub webhooks, or SSO SAML integrations? Drop your email for the architecture roadmap.
          </p>

          {feedbackSubmitted ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! We will send the architecture guide to {feedbackEmail}.</span>
            </div>
          ) : (
            <form onSubmit={handleFeedback} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
              >
                Get Roadmap
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. Website Quiet Footer */}
      <footer className="py-8 px-6 lg:px-12 bg-[#FAFBFC] border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="font-bold text-slate-900">ProTrack Issue Tracker</span>
            <span>·</span>
            <span>Full-Stack Starter</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('board')} className="hover:text-slate-900 cursor-pointer">
              Kanban Board
            </button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-900 cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => onNavigate('reports')} className="hover:text-slate-900 cursor-pointer">
              Reports
            </button>
            <button onClick={() => onNavigate('backend-code')} className="hover:text-slate-900 cursor-pointer">
              Spring Boot Code
            </button>
            <button onClick={() => onNavigate('local-setup')} className="hover:text-slate-900 cursor-pointer">
              Setup Guide
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; 2026 ProTrack Systems. Licensed under MIT.
          </p>
        </div>
      </footer>
    </div>
  );
};
