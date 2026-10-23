import React, { useState } from 'react';
import { STARTER_FILES, BACKEND_FOLDER_STRUCTURE, StarterFile } from '../../data/backendStarterCode';
import { downloadStarterProjectZip } from '../../utils/exportProject';
import { 
  FolderTree, 
  Code2, 
  Database, 
  Terminal, 
  Laptop, 
  Copy, 
  Check, 
  Download, 
  Play, 
  FileCode, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

interface BackendHubProps {
  initialTab?: 'code' | 'schema' | 'setup' | 'apis';
}

export const BackendHub: React.FC<BackendHubProps> = ({ initialTab = 'code' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFile, setActiveFile] = useState<StarterFile>(STARTER_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'code' | 'schema' | 'setup' | 'apis'>(initialTab);
  const [isExporting, setIsExporting] = useState(false);

  // API Tester State
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PATCH'>('GET');
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/v1/issues');
  const [apiPayload, setApiPayload] = useState<string>('{\n  "title": "New issue from REST tester",\n  "issueType": "BUG",\n  "priority": "HIGH"\n}');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadStarterProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunApiTest = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      setIsLoadingApi(false);
      if (apiEndpoint === '/api/v1/auth/login') {
        setApiResponse(JSON.stringify({
          status: 200,
          message: "Authentication successful",
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4LmNoZW4iLCJyb2xlIjoiUk9MRV9QUk9KRUNUX0xFQUQifQ.sig",
          tokenType: "Bearer",
          expiresIn: 86400,
          user: { id: 1, username: "alex.chen", role: "PROJECT_LEAD" }
        }, null, 2));
      } else if (apiEndpoint.startsWith('/api/v1/issues')) {
        if (apiMethod === 'POST') {
          setApiResponse(JSON.stringify({
            id: 109,
            issueKey: "PRO-109",
            title: "New issue from REST tester",
            issueType: "BUG",
            status: "OPEN",
            priority: "HIGH",
            storyPoints: 3,
            reporter: "Alex Chen",
            createdAt: new Date().toISOString()
          }, null, 2));
        } else {
          setApiResponse(JSON.stringify([
            { id: 1, issueKey: "PRO-101", title: "Configure Spring Security 6", status: "IN_PROGRESS", priority: "HIGH" },
            { id: 2, issueKey: "PRO-102", title: "Fix null pointer exception", status: "OPEN", priority: "CRITICAL" },
            { id: 3, issueKey: "PRO-103", title: "Design MySQL relational schema", status: "RESOLVED", priority: "HIGH" }
          ], null, 2));
        }
      } else if (apiEndpoint.startsWith('/api/v1/reports')) {
        setApiResponse(JSON.stringify({
          totalIssues: 8,
          pendingIssues: 4,
          resolvedIssues: 4,
          criticalBlockers: 1,
          velocityRate: "78%"
        }, null, 2));
      }
    }, 400);
  };

  const filteredFiles = selectedCategory === 'all' 
    ? STARTER_FILES 
    : STARTER_FILES.filter(f => f.category === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F5F7] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono uppercase tracking-wider">
              Spring Boot 3 + MySQL 8.0
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Laptop Starter Architecture</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1 leading-tight">
            Backend & Architecture Hub
          </h1>
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating ZIP...' : 'Download Starter Project (.zip)'}</span>
        </button>
      </div>

      {/* Primary Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveSection('code')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Spring Boot Codebase</span>
        </button>

        <button
          onClick={() => setActiveSection('schema')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'schema' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MySQL Database Schema</span>
        </button>

        <button
          onClick={() => setActiveSection('setup')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'setup' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Local Laptop Setup Guide</span>
        </button>

        <button
          onClick={() => setActiveSection('apis')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'apis' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>REST API Explorer</span>
        </button>
      </div>

      {/* 1. Spring Boot Codebase Browser */}
      {activeSection === 'code' && (
        <div className="space-y-4">
          {/* Folder structure snapshot */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span>Complete Project Folder Structure (Frontend + Backend)</span>
              </span>
              <button
                onClick={() => handleCopy(BACKEND_FOLDER_STRUCTURE)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Tree</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-md mt-3 overflow-x-auto leading-relaxed border border-slate-100">
              {BACKEND_FOLDER_STRUCTURE}
            </pre>
          </div>

          {/* Interactive File Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* File List (1 Col) */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Starter Code Files
              </span>
              <div className="space-y-1">
                {STARTER_FILES.map(file => {
                  const isSelected = activeFile.filename === file.filename;
                  return (
                    <button
                      key={file.filename}
                      onClick={() => setActiveFile(file)}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="truncate">{file.filename}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Viewer (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-[#FAFBFC] border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-800">{activeFile.path}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{activeFile.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(activeFile.content)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 overflow-x-auto flex-1 max-h-[500px]">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                  {activeFile.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MySQL Database Schema View */}
      {activeSection === 'schema' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">MySQL 8.0 Relational Entity Diagram & Schema</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tables configured with InnoDB, UTF8MB4, composite indexes and cascading constraints
                </p>
              </div>
              <button
                onClick={() => handleCopy(STARTER_FILES[0].content)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy schema.sql</span>
              </button>
            </div>

            {/* Schema Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Users Table */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-mono font-bold text-xs text-blue-700">TABLE: users</span>
                  <span className="text-[10px] font-mono text-slate-400">InnoDB</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-slate-700">
                  <div className="flex justify-between"><span>id</span><span className="text-slate-400">BIGINT (PK)</span></div>
                  <div className="flex justify-between"><span>username</span><span className="text-slate-400">VARCHAR(50) (UQ)</span></div>
                  <div className="flex justify-between"><span>email</span><span className="text-slate-400">VARCHAR(100) (UQ)</span></div>
                  <div className="flex justify-between"><span>password_hash</span><span className="text-slate-400">VARCHAR(255)</span></div>
                  <div className="flex justify-between"><span>role</span><span className="text-slate-400">ENUM</span></div>
                </div>
              </div>

              {/* Issues Table */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-mono font-bold text-xs text-emerald-700">TABLE: issues</span>
                  <span className="text-[10px] font-mono text-slate-400">InnoDB</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-slate-700">
                  <div className="flex justify-between"><span>id</span><span className="text-slate-400">BIGINT (PK)</span></div>
                  <div className="flex justify-between"><span>issue_key</span><span className="text-slate-400">VARCHAR(20) (UQ)</span></div>
                  <div className="flex justify-between"><span>title</span><span className="text-slate-400">VARCHAR(255)</span></div>
                  <div className="flex justify-between"><span>status</span><span className="text-slate-400">ENUM (Open..Closed)</span></div>
                  <div className="flex justify-between"><span>priority</span><span className="text-slate-400">ENUM (Low..Critical)</span></div>
                  <div className="flex justify-between"><span>assignee_id</span><span className="text-slate-400">BIGINT (FK &rarr; users)</span></div>
                </div>
              </div>

              {/* Comments Table */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-mono font-bold text-xs text-purple-700">TABLE: comments</span>
                  <span className="text-[10px] font-mono text-slate-400">InnoDB</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-slate-700">
                  <div className="flex justify-between"><span>id</span><span className="text-slate-400">BIGINT (PK)</span></div>
                  <div className="flex justify-between"><span>issue_id</span><span className="text-slate-400">BIGINT (FK &rarr; issues)</span></div>
                  <div className="flex justify-between"><span>author_id</span><span className="text-slate-400">BIGINT (FK &rarr; users)</span></div>
                  <div className="flex justify-between"><span>content</span><span className="text-slate-400">TEXT</span></div>
                  <div className="flex justify-between"><span>created_at</span><span className="text-slate-400">TIMESTAMP</span></div>
                </div>
              </div>
            </div>

            {/* DDL Code Block */}
            <div className="mt-5">
              <span className="text-xs font-bold text-slate-700 mb-2 block">schema.sql (MySQL 8.0 DDL)</span>
              <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto max-h-[380px]">
                {STARTER_FILES[0].content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. Local Laptop Setup Guide */}
      {activeSection === 'setup' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step-by-Step Local Workstation Run Guide</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete setup instructions for spinning up MySQL, Spring Boot, and React on your laptop
              </p>
            </div>
            <button
              onClick={() => handleCopy(STARTER_FILES.find(f => f.filename === 'README.md')?.content || '')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy README</span>
            </button>
          </div>

          {/* Setup Steps Timeline */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Launch MySQL 8.0 with Docker Compose</h3>
                <p className="text-xs text-slate-600">
                  Run Docker Compose to start a persistent MySQL 8.0 database initialized with schema and seed data:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-md font-mono text-xs flex items-center justify-between">
                  <span>docker compose up -d mysql</span>
                  <button onClick={() => handleCopy('docker compose up -d mysql')} className="text-slate-400 hover:text-white cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Run Java Spring Boot 3 Backend</h3>
                <p className="text-xs text-slate-600">
                  Navigate to the backend directory and launch with the Maven wrapper:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-md font-mono text-xs flex items-center justify-between">
                  <span>cd backend && ./mvnw clean spring-boot:run</span>
                  <button onClick={() => handleCopy('cd backend && ./mvnw clean spring-boot:run')} className="text-slate-400 hover:text-white cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  * The backend will bind to port 8080 and expose REST endpoints under /api/v1/*
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Launch React + TypeScript Frontend</h3>
                <p className="text-xs text-slate-600">
                  Start the Vite development server in the frontend directory:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-md font-mono text-xs flex items-center justify-between">
                  <span>cd frontend && npm install && npm run dev</span>
                  <button onClick={() => handleCopy('cd frontend && npm install && npm run dev')} className="text-slate-400 hover:text-white cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  * Open http://localhost:3000 to interact with your live ProTrack workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REST API Explorer & Live Tester */}
      {activeSection === 'apis' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Interactive REST API Explorer</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Test Spring Boot REST endpoints with simulated responses matching the backend DTO contracts
            </p>
          </div>

          {/* Quick Endpoints presets */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { method: 'POST' as const, path: '/api/v1/auth/login', label: 'Auth: Login (JWT)' },
              { method: 'GET' as const, path: '/api/v1/issues', label: 'Issues: List All' },
              { method: 'POST' as const, path: '/api/v1/issues', label: 'Issues: Create New' },
              { method: 'GET' as const, path: '/api/v1/reports/dashboard', label: 'Reports: Dashboard Metrics' },
            ].map((ep) => (
              <button
                key={ep.path + ep.method}
                onClick={() => {
                  setApiMethod(ep.method);
                  setApiEndpoint(ep.path);
                  if (ep.method === 'POST' && ep.path.includes('auth')) {
                    setApiPayload('{\n  "username": "alex.chen",\n  "password": "password123"\n}');
                  } else if (ep.method === 'POST') {
                    setApiPayload('{\n  "title": "New ticket from Swagger",\n  "issueType": "BUG",\n  "priority": "HIGH",\n  "storyPoints": 3\n}');
                  }
                }}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded border transition-colors cursor-pointer ${
                  apiEndpoint === ep.path && apiMethod === ep.method
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold text-blue-600 mr-1.5">{ep.method}</span>
                <span>{ep.path}</span>
              </button>
            ))}
          </div>

          {/* Request Input Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs font-bold text-slate-800 outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
              </select>

              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              />

              <button
                onClick={handleRunApiTest}
                disabled={isLoadingApi}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoadingApi ? 'Calling...' : 'Execute'}</span>
              </button>
            </div>

            {apiMethod !== 'GET' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Request Payload (JSON)</label>
                <textarea
                  rows={4}
                  value={apiPayload}
                  onChange={(e) => setApiPayload(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-md outline-none"
                />
              </div>
            )}

            {/* Response Viewer */}
            {apiResponse && (
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-slate-700">Response Payload (HTTP 200 OK)</span>
                  <span className="text-[11px] font-mono text-slate-400">application/json · 18ms</span>
                </div>
                <pre className="p-4 bg-slate-900 text-sky-300 font-mono text-xs rounded-md overflow-x-auto leading-relaxed border border-slate-800">
                  {apiResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
