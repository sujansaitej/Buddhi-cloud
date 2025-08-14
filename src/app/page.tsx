'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  CheckCircle,
  Calendar,
  Download,
  Sparkles,
  MousePointer,
  Monitor,
  Smartphone,
  Globe,
  Database,
  Cloud,
  ShoppingBag,
  MessageCircle,
  TrendingUp,
  Bot,
  Workflow,
  Key,
  Target,
  Rocket,
  Star,
  ChevronRight,
  ExternalLink,
  Cpu,
  Brain,
  Eye,
  Lock,
  RefreshCw,
  BarChart,
  FileText,
  Settings,
  Palette
} from 'lucide-react'
import { ShadowIllustration, AutomationIllustration, DataFlowIllustration, WorkflowIllustration } from '@/components/Illustrations'

export default function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Intelligent browser automation using advanced AI models that understand and execute complex tasks."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Visual Workflow Builder",
      description: "Create sophisticated automation workflows with our intuitive drag-and-drop interface."
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Credential Wallet",
      description: "Securely store and manage your credentials for seamless automation across platforms."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Live Browser View",
      description: "Watch your automation happen in real-time with live browser monitoring and control."
    }
  ]

  const benefits = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "10x Faster Execution",
      description: "Complete tasks in minutes that would take hours manually"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Intelligence",
      description: "Advanced AI models that adapt and learn from your automation patterns"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and secure credential management"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Share workflows and collaborate with your team seamlessly"
    }
  ]

  const useCases = [
    {
      title: "E-commerce Automation",
      description: "Price monitoring, inventory management, and order processing",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      features: ["Price Tracking", "Inventory Sync", "Order Automation"]
    },
    {
      title: "Data Collection",
      description: "Web scraping, API integration, and data validation",
      icon: <Database className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      features: ["Web Scraping", "API Integration", "Data Validation"]
    },
    {
      title: "Form Automation",
      description: "Automated form filling and submission across websites",
      icon: <FileText className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      features: ["Form Filling", "Data Entry", "Submission Tracking"]
    },
    {
      title: "Social Media Management",
      description: "Automated posting, engagement, and analytics",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      features: ["Auto Posting", "Engagement", "Analytics"]
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Inc",
      content: "Nizhal has revolutionized our marketing automation. We've increased our lead generation by 300% while reducing manual work by 80%.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "E-commerce Manager",
      company: "ShopSmart",
      content: "The workflow builder is incredibly intuitive. We automated our entire inventory management process in just one day.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Data Analyst",
      company: "DataCorp",
      content: "The credential wallet feature is a game-changer. No more managing API keys across multiple platforms manually.",
      rating: 5
    }
  ]

  const stats = [
    { number: "10,000+", label: "Automations" },
    { number: "500+", label: "Teams" },
    { number: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/40">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Nizhal</span>
                  <p className="text-xs text-gray-500">AI Browser Automation Platform</p>
                </div>
              </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="#features"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              How it works
            </Link>
            <Link 
              href="/dashboard"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard"
              className="btn-primary px-6 py-2.5 text-sm rounded-xl flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-24 left-10 w-56 h-56 bg-blue-100 rounded-full blur-2xl"></div>
            <div className="absolute top-52 right-10 w-64 h-64 bg-purple-100 rounded-full blur-2xl"></div>
          </div>

          <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">AI-Powered Browser Automation</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Automate your
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shift">
                    browser workflows
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  Turn repetitive web work into reliable automations. Build flows fast, watch live, and get results with files and webhooks.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                  <Link 
                    href="/dashboard"
                    className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl flex items-center space-x-3 animate-fade-in-up stagger-3"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>Start Automating</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="group relative inline-flex items-center gap-3 animate-fade-in-up stagger-4">
                    <span className="relative inline-flex items-center gap-3 rounded-2xl bg-white/80 px-6 py-3 text-base font-semibold text-gray-800 border border-gray-200 hover:border-indigo-200 hover:bg-white shadow-sm hover:shadow-xl transition-all">
                      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                        <Play className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                        <span className="absolute -inset-1 rounded-full bg-indigo-400/30 blur opacity-0 group-hover:opacity-100 transition"></span>
                      </span>
                      <span className="whitespace-nowrap">Watch Demo</span>
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl px-4 py-3 text-center shadow-sm">
                      <div className="text-xl md:text-2xl font-extrabold text-gray-900">{stat.number}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex justify-center animate-fade-in-up stagger-2">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-6">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-purple-200/40 to-blue-200/40 rounded-full blur-2xl"></div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-4 justify-items-center">
                    <div className="translate-y-2 animate-float">
                      <AutomationIllustration className="w-36 h-36 md:w-44 md:h-44" />
                    </div>
                    <div className="delay-150 animate-float">
                      <DataFlowIllustration className="w-32 h-32 md:w-40 md:h-40" />
                    </div>
                    <div className="-translate-y-2 delay-300 animate-float">
                      <WorkflowIllustration className="w-32 h-32 md:w-40 md:h-40" />
                    </div>
                    <div className="delay-500 animate-float">
                      <ShadowIllustration className="w-36 h-36 md:w-44 md:h-44" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature showcase as accessible tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-fade-in-up stagger-5">
              <div
                className="flex flex-wrap items-center justify-center gap-3 mb-5"
                role="tablist"
                aria-label="Product features"
              >
                {features.map((feature, index) => (
                  <button
                    key={index}
                    id={`feature-tab-${index}`}
                    role="tab"
                    aria-selected={currentFeature === index}
                    aria-controls="feature-panel"
                    tabIndex={currentFeature === index ? 0 : -1}
                    onClick={() => setCurrentFeature(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault()
                        setCurrentFeature((index + 1) % features.length)
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault()
                        setCurrentFeature((index - 1 + features.length) % features.length)
                      } else if (e.key === 'Home') {
                        e.preventDefault()
                        setCurrentFeature(0)
                      } else if (e.key === 'End') {
                        e.preventDefault()
                        setCurrentFeature(features.length - 1)
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm border outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-0 transition-colors ${
                      currentFeature === index
                        ? 'bg-indigo-600/10 text-indigo-700 border-indigo-300 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span
                      className={`p-1.5 rounded-md ${
                        currentFeature === index
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      {feature.icon}
                    </span>
                    <span className="font-medium whitespace-nowrap">{feature.title}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-5 text-center" role="tabpanel" id="feature-panel" aria-labelledby={`feature-tab-${currentFeature}`}>
                <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto" aria-live="polite">
                  {features[currentFeature].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Go from idea to automated execution in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl animate-scale-in">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe the task</h3>
              <p className="text-gray-600">Use natural language or templates to define what the agent should do.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl animate-scale-in stagger-2">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Watch live & control</h3>
              <p className="text-gray-600">View the live browser, pause/resume/stop, and inspect steps in real-time.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl animate-scale-in stagger-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get results & webhooks</h3>
              <p className="text-gray-600">Capture output, files, screenshots, and receive status updates via webhooks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product capabilities */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">Product capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up stagger-1">Everything you need to build, run, and scale browser automations.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-4"><Workflow className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual workflows</h3>
              <p className="text-gray-600">Reusable templates and multi-step automations with versioning.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4"><Monitor className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live browser control</h3>
              <p className="text-gray-600">Watch the live browser via `live_url`, with pause/resume/stop controls.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4"><Calendar className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scheduling</h3>
              <p className="text-gray-600">Interval and cron schedules with next-run previews and status.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4"><Shield className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Credential wallet</h3>
              <p className="text-gray-600">Secure secrets storage, encrypted at rest and scoped per task.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4"><Settings className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browser profiles</h3>
              <p className="text-gray-600">Proxies, adblock, viewport, persistence, and country targeting.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center mb-4"><BarChart3 className="w-6 h-6" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Health & insights</h3>
              <p className="text-gray-600">Success rate, durations, alerts, and performance analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Powerful Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up stagger-1">
              From simple tasks to complex workflows, Nizhal adapts to your automation needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-300 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {useCase.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up stagger-1">
              See how teams are transforming their workflows with Nizhal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-200 animate-scale-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-up stagger-1">
              Join thousands of professionals who are already automating their browser tasks with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-2">
              <Link 
                href="/dashboard"
                className="btn-primary inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/dashboard"
                className="btn-secondary inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Settings className="w-5 h-5" />
                <span>View Documentation</span>
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-top border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                                 <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Nizhal</span>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered browser automation platform for modern teams.
              </p>
              <div className="flex space-x-3">
                <a href="#" aria-label="Website" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Globe className="w-4 h-4 text-gray-600" />
                </a>
                <a href="#" aria-label="Community" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                </a>
                <a href="#" aria-label="Status" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <BarChart className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
                <li><Link href="/workflows" className="hover:text-gray-900 transition-colors">Workflows</Link></li>
                <li><Link href="/tasks" className="hover:text-gray-900 transition-colors">Tasks</Link></li>
                <li><Link href="/wallet" className="hover:text-gray-900 transition-colors">Credential Wallet</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
                         <p className="text-gray-600">
               © {new Date().getFullYear()} Nizhal. All rights reserved. Built with ❤️ for automation enthusiasts.
             </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

 