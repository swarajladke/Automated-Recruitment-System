import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: "javascript" | "python" | "java";
  setLanguage: (lang: "javascript" | "python" | "java") => void;
}

function CodeEditor({ code, setCode, language, setLanguage }: CodeEditorProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  // Filter questions based on role or fallback to default
  const filteredQuestions = role 
    ? CODING_QUESTIONS.filter(q => !q.role || q.role === role)
    : CODING_QUESTIONS;

  const initialQuestion = role 
    ? CODING_QUESTIONS.find(q => q.role === role) || filteredQuestions[0]
    : filteredQuestions[0];

  const [selectedQuestion, setSelectedQuestion] = useState(initialQuestion);

  // LIVE CODE SYNC LOGIC (HR View only)
  useEffect(() => {
    const candidateId = searchParams.get("candidate_id") || "mock-c";
    
    if (role === 'admin') {
      const pullInterval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:5001/get-synced-code/${candidateId}`);
          const data = await res.json();
          if (data.code !== undefined && data.code !== code) {
            setCode(data.code);
          }
          if (data.language !== undefined && data.language !== language) {
            setLanguage(data.language);
          }
        } catch (e) { console.error("Code pull error:", e); }
      }, 1500);
      return () => clearInterval(pullInterval);
    }
  }, [role, searchParams, code, language, setCode, setLanguage]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    
    // CANDIDATE SIDE: Push code to backend
    if (role === 'candidate' || !role) {
      const candidateId = searchParams.get("candidate_id") || "mock-c";
      fetch(`http://localhost:5001/sync-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: candidateId, code: newCode, language: language })
      }).catch(e => console.error("Code push error:", e));
    }
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    const starterCode = selectedQuestion.starterCode[newLanguage];
    setCode(starterCode);
    
    // CANDIDATE SIDE: Sync language change
    if (role === 'candidate' || !role) {
      const candidateId = searchParams.get("candidate_id") || "mock-c";
      fetch(`http://localhost:5001/sync-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: candidateId, code: starterCode, language: newLanguage })
      }).catch(e => console.error("Language sync error:", e));
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* IDE CONTROL BAR */}
      <div className="h-12 px-4 border-b border-[#30363d] bg-[#161b22]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
            <img src={`/${language}.png`} alt={language} className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{language} environment</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-[130px] bg-[#0d1117] border-[#30363d] text-[10px] font-bold text-[#8b949e]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1117] border-[#30363d]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id} className="text-xs text-[#8b949e] focus:bg-emerald-500/10 focus:text-white">
                  <div className="flex items-center gap-2">
                    <img src={`/${lang.id}.png`} alt={lang.name} className="w-4 h-4 object-contain" />
                    {lang.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 relative">
        <Editor
          height={"100%"}
          defaultLanguage={language}
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            readOnly: role === 'admin',
            minimap: { enabled: false },
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            wordWrap: "on",
            wrappingIndent: "indent",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditor;
