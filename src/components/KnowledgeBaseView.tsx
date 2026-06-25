import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import { DocumentItem, Department, DocType } from '../types';
import { playUiClick, playUiChime, playEngineSuccess } from '../utils/audio';

interface KnowledgeBaseViewProps {
  documents: DocumentItem[];
  setDocuments: Dispatch<SetStateAction<DocumentItem[]>>;
  onActivityAdded: (activity: string, icon: string) => void;
}

export default function KnowledgeBaseView({
  documents,
  setDocuments,
  onActivityAdded
}: KnowledgeBaseViewProps) {
  // Filters state
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [docTypes, setDocTypes] = useState<Record<DocType, boolean>>({
    pdf: true,
    md: true,
    csv: true,
    docx: true,
    audio: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFileName, setNewFileName] = useState('');
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Directly download any indexed document content locally
  const handleDownloadDoc = (doc: DocumentItem) => {
    playUiClick();
    const content = doc.content || `Indexed File Name: ${doc.name}\nDepartment: ${doc.department}\nSize: ${doc.size}\nStatus: ${doc.status}\n\nThis is the text matrix representation stored in KnowledgeOS secure vector index.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name.includes('.') ? doc.name : `${doc.name}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onActivityAdded(`Downloaded indexed document: ${doc.name}`, 'file_download');
  };

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    // Search query filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Department filter
    const matchesDept = selectedDept === 'All Departments' || doc.department === selectedDept;
    
    // Type filter
    const matchesType = docTypes[doc.type];

    return matchesSearch && matchesDept && matchesType;
  });

  const handleToggleDocType = (type: DocType) => {
    setDocTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Real File Upload Processing
  const handleFilesUpload = (files: FileList | File[]) => {
    if (files.length === 0) return;

    // Process each file
    Array.from(files).forEach((file) => {
      const name = file.name;
      setNewFileName(name);
      setIsUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string || '';

        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          setUploadProgress(progress);

          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const ext = name.split('.').pop()?.toLowerCase() || 'pdf';
              let finalType: DocType = 'pdf';
              if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
                finalType = 'csv';
              } else if (ext === 'md' || ext === 'txt') {
                finalType = 'md';
              } else if (ext === 'docx' || ext === 'doc') {
                finalType = 'docx';
              } else if (ext === 'mp3' || ext === 'wav' || ext === 'audio') {
                finalType = 'audio';
              }

              const depts: Department[] = ['Engineering', 'Finance', 'Marketing', 'Legal', 'HR', 'Executive'];
              // Simple heuristic to assign departments based on name
              let matchedDept: Department = 'Engineering';
              const nameLower = name.toLowerCase();
              if (nameLower.includes('finance') || nameLower.includes('revenue') || nameLower.includes('invoice') || nameLower.includes('budget')) {
                matchedDept = 'Finance';
              } else if (nameLower.includes('brand') || nameLower.includes('marketing') || nameLower.includes('ad_') || nameLower.includes('design')) {
                matchedDept = 'Marketing';
              } else if (nameLower.includes('privacy') || nameLower.includes('legal') || nameLower.includes('policy') || nameLower.includes('terms') || nameLower.includes('contract')) {
                matchedDept = 'Legal';
              } else if (nameLower.includes('resume') || nameLower.includes('hr') || nameLower.includes('employee') || nameLower.includes('hiring')) {
                matchedDept = 'HR';
              }

              // Compute user-friendly file size format
              let sizeStr = '';
              if (file.size > 1024 * 1024) {
                sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
              } else {
                sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
              }

              const newDoc: DocumentItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: name,
                type: finalType,
                size: sizeStr,
                uploadedAt: 'Just now',
                status: 'indexed',
                department: matchedDept,
                content: fileContent
              };

              setDocuments((prevDocs) => [newDoc, ...prevDocs]);
              setIsUploading(false);
              onActivityAdded(`Uploaded and indexed document: ${name}`, 'sync');
              alert(`"${name}" uploaded successfully and indexed into the high-density retrieval system.`);
            }, 500);
          }
        }, 150);
      };

      // Read text files as text, fallback to a placeholder text representation for binaries
      if (file.type.startsWith('text/') || name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.csv') || name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        setTimeout(() => {
          reader.readAsText(new Blob([`[Binary Data - ${file.type || 'Document'} Format]\nName: ${name}\nSize: ${file.size} bytes\nVector indices generated successfully.`]));
        }, 50);
      }
    });
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleDeleteDoc = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete and un-index "${name}"?`)) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      onActivityAdded(`Deleted document index: ${name}`, 'delete');
    }
  };

  const handleSyncDoc = (name: string) => {
    alert(`Initiating full knowledge synchronization for "${name}"...`);
    onActivityAdded(`Re-synchronized index for "${name}"`, 'sync');
  };

  const getIconForType = (type: DocType) => {
    switch (type) {
      case 'pdf': return 'picture_as_pdf';
      case 'csv': return 'table_chart';
      case 'md': return 'description';
      case 'docx': return 'feed';
      case 'audio': return 'audio_file';
    }
  };

  const getColorForType = (type: DocType) => {
    switch (type) {
      case 'pdf': return 'text-red-400 bg-red-500/10';
      case 'csv': return 'text-green-400 bg-green-500/10';
      case 'md': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-amber-400 bg-amber-500/10';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      
      {/* Sidebar Filters Panel */}
      <aside className="w-full lg:w-72 shrink-0 space-y-6">
        <div className="glass-panel rounded-xl p-5 space-y-6 border border-slate-200">
          <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest font-bold">Document Filters</h3>
          
          {/* Department Filter Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500">Department</label>
            <div className="relative">
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 py-2 pl-3 pr-8 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Legal & Compliance</option>
                <option>Human Resources</option>
                <option>Finance</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
            </div>
          </div>

          {/* Doc Type Checkboxes */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-500">Document Type</label>
            <div className="space-y-2 text-sm text-slate-600">
              {Object.keys(docTypes).map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={docTypes[type as DocType]}
                    onChange={() => handleToggleDocType(type as DocType)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/30 w-4 h-4 cursor-pointer"
                  />
                  <span className="group-hover:text-indigo-600 transition-colors uppercase text-xs font-mono tracking-wider">
                    {type === 'csv' ? 'Excel / CSV' : `${type} Files`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Index Status Indicator Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500">Index Status</label>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full font-mono text-[9px] uppercase font-semibold">Indexed</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full font-mono text-[9px] uppercase">Processing</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full font-mono text-[9px] uppercase">Error</span>
            </div>
          </div>
        </div>

        {/* Storage usage indicator card */}
        <div className="glass-panel rounded-xl p-5 bg-indigo-50/50 border border-indigo-100">
          <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            Storage Usage
          </h3>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }} />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>12.4 GB used</span>
            <span>20 GB Total</span>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace Panel */}
      <div className="flex-1 space-y-6">
        
        {/* Hidden actual file input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          id="real-file-upload-input"
        />

        {/* Interactive Drag & Drop / Selection Zone */}
        <div 
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer overflow-hidden shadow-sm ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
              : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
          id="drag-drop-upload-zone"
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white text-slate-500 transition-all duration-300 shadow-sm border border-slate-100">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            {isUploading ? (
              <div className="space-y-2 w-full max-w-xs">
                <h3 className="text-sm font-semibold text-slate-800">Uploading &amp; indexing {newFileName}...</h3>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-xs font-mono text-indigo-600 font-bold">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {isDragging ? 'Drop your files here!' : 'Drag and drop documents here'}
                </h2>
                <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                  Upload PDF, DOCX, or MD files to index them into your KnowledgeOS. AI will automatically process and categorize contents.
                </p>
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-50 border border-slate-200 font-sans font-bold text-xs px-5 py-2.5 rounded-lg text-slate-700 transition-all cursor-pointer"
                  >
                    Browse Files
                  </button>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-100 cursor-pointer">
                    Connect Drive
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-t from-transparent to-indigo-50" />
        </div>

        {/* Documents Table List */}
        <div className="glass-panel rounded-xl overflow-hidden border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Documents</h2>
            
            {/* Search filtering */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all w-full sm:w-56 placeholder-slate-400"
                  placeholder="Filter current view..."
                />
              </div>
              <button className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer shrink-0">
                <span className="material-symbols-outlined text-[18px]">sort</span>
              </button>
              <button 
                onClick={() => alert("Re-syncing metadata files...")}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${getColorForType(doc.type)}`}>
                          <span className="material-symbols-outlined text-xl">{getIconForType(doc.type)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate max-w-xs">{doc.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{doc.uploadedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-indigo-600 font-mono text-[10px] uppercase font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-sans font-medium border border-slate-200/40">
                        {doc.department}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-500 text-xs">{doc.size}</td>
                     <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 cursor-pointer" 
                          title="Preview Content"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleDownloadDoc(doc)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-indigo-500 hover:text-indigo-700 cursor-pointer" 
                          title="Download File"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        <button 
                          onClick={() => handleSyncDoc(doc.name)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 cursor-pointer" 
                          title="Sync"
                        >
                          <span className="material-symbols-outlined text-[18px]">sync</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteDoc(doc.id, doc.name)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer" 
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDocuments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                      No documents match the active filtering constraints.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredDocuments.length} of {documents.length} documents</span>
            <div className="flex gap-1.5">
              <button disabled className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-indigo-600 bg-indigo-50 text-indigo-600 rounded font-mono text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 font-mono text-xs cursor-pointer">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic AI Insights / Compliance summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-xl p-6 relative overflow-hidden group border border-slate-200 shadow-sm">
            <div className="relative z-10 space-y-3">
              <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest font-bold">Dynamic Intelligence Summary</h3>
              <p className="text-slate-700 leading-relaxed text-base">
                AI has detected a <span className="text-indigo-600 font-semibold">consistent trend</span> in recent financial drafts regarding "subscription expansion." Three related documents from <span className="italic text-slate-500 font-medium">Finance</span> and <span className="italic text-slate-500 font-medium">Marketing</span> are now cross-referenced.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center"><span className="material-symbols-outlined text-xs text-indigo-600">description</span></div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center"><span className="material-symbols-outlined text-xs text-violet-600">picture_as_pdf</span></div>
                </div>
                <button 
                  onClick={() => alert("Loading dynamic cross-referenced report...")}
                  className="text-indigo-600 font-sans font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                >
                  View Linked Report
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-50/50 blur-[80px] pointer-events-none group-hover:bg-indigo-100/10 transition-all duration-700" />
          </div>

          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between border border-indigo-100 bg-indigo-50/10 shadow-sm">
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest font-bold">Next Action</h3>
              <p className="font-sans font-bold text-base text-slate-800">Compliance Review</p>
              <p className="text-xs text-slate-500 leading-relaxed">2 documents require human verification for PII detection before system exposure.</p>
            </div>
            <button 
              onClick={() => setShowReviewPopup(true)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs py-2.5 rounded-lg shadow-md shadow-indigo-100 transition-all cursor-pointer"
            >
              Start Review
            </button>
          </div>
        </div>

      </div>

      {/* Document Content Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-200 shadow-2xl relative flex flex-col max-h-[85vh]">
            <button 
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className={`w-10 h-10 rounded flex items-center justify-center ${getColorForType(previewDoc.type)}`}>
                <span className="material-symbols-outlined">{getIconForType(previewDoc.type)}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{previewDoc.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{previewDoc.department} Directory • {previewDoc.size}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono custom-scrollbar">
              <p className="text-indigo-400 mb-2">// KOS INTEL INDEXED OUTPUT SEGMENT</p>
              <p className="mb-4">SYSTEM ID: {previewDoc.id}</p>
              {previewDoc.content ? (
                <div className="whitespace-pre-wrap font-mono text-slate-300">
                  {previewDoc.content}
                </div>
              ) : (
                <>
                  <p className="mb-4">
                    "We performed semantic evaluation and indexing on this document. The parsed corpus reveals consistent reference structures. Latency parameters for querying are set at high-priority vector space."
                  </p>
                  <p className="mb-4">
                    "Segment 1: Evaluating strategic quarterly targets for workspace expansion and auth layer maintenance..."
                  </p>
                  <p className="text-slate-400">
                    [Status: Indexed Successfully • Decoded Entities: 42 • Decoupled Vectors: Operational]
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Review Modal */}
      {showReviewPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">PII Exposure Mitigation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We've isolated 2 documents (Brand_Identity_Guidelines_v2.md, Privacy_Policy_Update_Draft.pdf) for human verification to prevent accidental API leak of personal identities.
                </p>
              </div>
              <div className="space-y-2 text-left bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 leading-normal">
                <p>⚠️ <strong className="text-amber-400">Isolate Code:</strong> PII-MASK-302</p>
                <p>🔒 <strong className="text-indigo-400">Compliance Masking:</strong> Active</p>
                <p>👤 <strong>Evaluator Assigned:</strong> Principal Architect</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowReviewPopup(false)}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-sans font-bold py-2.5 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowReviewPopup(false);
                    onActivityAdded("Cleared document compliance check for workspace indices", "verified_user");
                    alert("Verification cleared! Documents flagged are now safely masked and synchronized.");
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white hover:opacity-95 text-xs font-sans font-bold py-2.5 rounded-lg cursor-pointer shadow-md shadow-indigo-100 transition-all"
                >
                  Approve &amp; Index
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
