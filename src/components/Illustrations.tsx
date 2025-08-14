import React from 'react'

export const ShadowIllustration = ({ className = "w-64 h-64" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background gradient */}
    <defs>
      <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3"/>
        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Main shadow figure */}
    <g filter="url(#glow)">
      {/* Human silhouette */}
      <path 
        d="M128 40 C 140 40, 150 50, 150 70 L 150 120 C 150 140, 140 150, 128 150 C 116 150, 106 140, 106 120 L 106 70 C 106 50, 116 40, 128 40 Z"
        fill="url(#shadowGradient)"
        opacity="0.8"
      />
      
      {/* Head */}
      <circle cx="128" cy="60" r="15" fill="url(#shadowGradient)" opacity="0.9"/>
      
      {/* Digital shadow effect */}
      <path 
        d="M128 40 C 140 40, 150 50, 150 70 L 150 120 C 150 140, 140 150, 128 150 C 116 150, 106 140, 106 120 L 106 70 C 106 50, 116 40, 128 40 Z"
        fill="none"
        stroke="#6366F1"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.6"
        transform="translate(10, 10)"
      />
      
      {/* Connection lines */}
      <line x1="128" y1="150" x2="128" y2="180" stroke="#8B5CF6" strokeWidth="2" opacity="0.7"/>
      <line x1="128" y1="180" x2="100" y2="200" stroke="#8B5CF6" strokeWidth="2" opacity="0.5"/>
      <line x1="128" y1="180" x2="156" y2="200" stroke="#8B5CF6" strokeWidth="2" opacity="0.5"/>
      
      {/* Digital particles */}
      <circle cx="100" cy="200" r="3" fill="#6366F1" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="156" cy="200" r="3" fill="#8B5CF6" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="128" cy="180" r="2" fill="#3B82F6" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
    </g>
  </svg>
)

export const AutomationIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="autoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    
    {/* Browser window */}
    <rect x="20" y="20" width="152" height="152" rx="8" fill="url(#autoGradient)" opacity="0.1" stroke="url(#autoGradient)" strokeWidth="2"/>
    
    {/* Browser header */}
    <rect x="20" y="20" width="152" height="30" rx="8" fill="url(#autoGradient)" opacity="0.2"/>
    
    {/* Browser dots */}
    <circle cx="40" cy="35" r="4" fill="#EF4444"/>
    <circle cx="55" cy="35" r="4" fill="#F59E0B"/>
    <circle cx="70" cy="35" r="4" fill="#10B981"/>
    
    {/* Content area */}
    <rect x="30" y="60" width="132" height="102" rx="4" fill="url(#autoGradient)" opacity="0.05"/>
    
    {/* Automation elements */}
    <rect x="40" y="70" width="112" height="8" rx="4" fill="url(#autoGradient)" opacity="0.3"/>
    <rect x="40" y="90" width="80" height="8" rx="4" fill="url(#autoGradient)" opacity="0.3"/>
    <rect x="40" y="110" width="96" height="8" rx="4" fill="url(#autoGradient)" opacity="0.3"/>
    
    {/* Cursor */}
    <rect x="40" y="130" width="2" height="12" fill="#8B5CF6">
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
    </rect>
    
    {/* Progress indicator */}
    <circle cx="160" cy="160" r="8" fill="none" stroke="url(#autoGradient)" strokeWidth="2">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 160 160"
        to="360 160 160"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
)

export const DataFlowIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    
    {/* Data nodes */}
    <circle cx="40" cy="40" r="12" fill="url(#dataGradient)" opacity="0.8"/>
    <circle cx="152" cy="40" r="12" fill="url(#dataGradient)" opacity="0.8"/>
    <circle cx="40" cy="152" r="12" fill="url(#dataGradient)" opacity="0.8"/>
    <circle cx="152" cy="152" r="12" fill="url(#dataGradient)" opacity="0.8"/>
    <circle cx="96" cy="96" r="16" fill="url(#dataGradient)" opacity="0.9"/>
    
    {/* Connection lines */}
    <line x1="40" y1="40" x2="96" y2="96" stroke="url(#dataGradient)" strokeWidth="2" opacity="0.6"/>
    <line x1="152" y1="40" x2="96" y2="96" stroke="url(#dataGradient)" strokeWidth="2" opacity="0.6"/>
    <line x1="40" y1="152" x2="96" y2="96" stroke="url(#dataGradient)" strokeWidth="2" opacity="0.6"/>
    <line x1="152" y1="152" x2="96" y2="96" stroke="url(#dataGradient)" strokeWidth="2" opacity="0.6"/>
    
    {/* Data flow particles */}
    <circle cx="68" cy="68" r="2" fill="#6366F1">
      <animateMotion
        path="M 0 0 L 28 28"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="124" cy="68" r="2" fill="#8B5CF6">
      <animateMotion
        path="M 0 0 L -28 28"
        dur="2s"
        repeatCount="indefinite"
        begin="0.5s"
      />
    </circle>
    <circle cx="68" cy="124" r="2" fill="#8B5CF6">
      <animateMotion
        path="M 0 0 L 28 -28"
        dur="2s"
        repeatCount="indefinite"
        begin="1s"
      />
    </circle>
    <circle cx="124" cy="124" r="2" fill="#6366F1">
      <animateMotion
        path="M 0 0 L -28 -28"
        dur="2s"
        repeatCount="indefinite"
        begin="1.5s"
      />
    </circle>
  </svg>
)

export const WorkflowIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="workflowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    
    {/* Workflow steps */}
    <rect x="20" y="40" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    <rect x="76" y="40" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    <rect x="132" y="40" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    
    <rect x="20" y="112" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    <rect x="76" y="112" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    <rect x="132" y="112" width="40" height="40" rx="8" fill="url(#workflowGradient)" opacity="0.8"/>
    
    {/* Arrows */}
    <path d="M 60 60 L 76 60" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M 116 60 L 132 60" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M 60 132 L 76 132" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M 116 132 L 132 132" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    
    {/* Vertical connections */}
    <path d="M 40 80 L 40 112" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M 96 80 L 96 112" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M 152 80 L 152 112" stroke="url(#workflowGradient)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    
    {/* Arrow marker */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="url(#workflowGradient)"/>
      </marker>
    </defs>
    
    {/* Step indicators */}
    <circle cx="40" cy="60" r="3" fill="white" opacity="0.9"/>
    <circle cx="96" cy="60" r="3" fill="white" opacity="0.9"/>
    <circle cx="152" cy="60" r="3" fill="white" opacity="0.9"/>
    <circle cx="40" cy="132" r="3" fill="white" opacity="0.9"/>
    <circle cx="96" cy="132" r="3" fill="white" opacity="0.9"/>
    <circle cx="152" cy="132" r="3" fill="white" opacity="0.9"/>
  </svg>
) 