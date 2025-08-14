'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Edit,
  Trash2,
  Settings,
  Monitor,
  Shield,
  Globe2,
  Eye,
  EyeOff,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { apiService, BrowserProfileResponse } from '@/lib/api'
import CreateBrowserProfileModal from './CreateBrowserProfileModal'
import EditBrowserProfileModal from './EditBrowserProfileModal'

interface BrowserProfilesPageProps {
  className?: string
}

export default function BrowserProfilesPage({ className }: BrowserProfilesPageProps) {
  const [profiles, setProfiles] = useState<BrowserProfileResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<BrowserProfileResponse | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterProxy, setFilterProxy] = useState<'all' | 'on' | 'off'>('all')
  const [filterAdblock, setFilterAdblock] = useState<'all' | 'on' | 'off'>('all')
  const [filterPersist, setFilterPersist] = useState<'all' | 'on' | 'off'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent')

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const response = await apiService.getBrowserProfiles(1, 50)
      setProfiles(response.profiles || [])
    } catch (error) {
      console.error('Error fetching browser profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleCreateProfile = async (profileData: any) => {
    try {
      await apiService.createBrowserProfile(profileData)
      await fetchProfiles()
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating browser profile:', error)
      throw error
    }
  }

  const handleEditProfile = async (profileData: any) => {
    if (!selectedProfile) return
    
    try {
      await apiService.updateBrowserProfile(selectedProfile.profile_id, profileData)
      await fetchProfiles()
      setShowEditModal(false)
      setSelectedProfile(null)
    } catch (error) {
      console.error('Error updating browser profile:', error)
      throw error
    }
  }

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this browser profile? This action cannot be undone.')) {
      return
    }

    try {
      await apiService.deleteBrowserProfile(profileId)
      await fetchProfiles()
    } catch (error) {
      console.error('Error deleting browser profile:', error)
    }
  }

  const filteredProfiles = profiles
    .filter(profile =>
      profile.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.description && profile.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(p => filterProxy === 'all' ? true : filterProxy === 'on' ? !!p.proxy : !p.proxy)
    .filter(p => filterAdblock === 'all' ? true : filterAdblock === 'on' ? !!p.ad_blocker : !p.ad_blocker)
    .filter(p => filterPersist === 'all' ? true : filterPersist === 'on' ? !!p.persist : !p.persist)
    .sort((a,b) => sortBy === 'name' ? a.profile_name.localeCompare(b.profile_name) : 0)

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'UK': '🇬🇧', 
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'JP': '🇯🇵',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FI': '🇫🇮',
      'CA': '🇨🇦',
      'IN': '🇮🇳'
    }
    return flags[countryCode?.toUpperCase()] || '🌍'
  }

  const handleCopyId = async (profileId: string) => {
    try {
      await navigator.clipboard.writeText(profileId)
      setCopiedId(profileId)
      setTimeout(() => setCopiedId(null), 1500)
    } catch (e) {
      console.error('Clipboard copy failed:', e)
    }
  }

  return (
    <div className={`${className || ''}`}>
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 mt-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10 pointer-events-none" />
            <Input
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterProxy} onChange={(e)=> setFilterProxy(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Proxy: All</option>
              <option value="on">Proxy: On</option>
              <option value="off">Proxy: Off</option>
            </select>
            <select value={filterAdblock} onChange={(e)=> setFilterAdblock(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Adblock: All</option>
              <option value="on">Adblock: On</option>
              <option value="off">Adblock: Off</option>
            </select>
            <select value={filterPersist} onChange={(e)=> setFilterPersist(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Persistence: All</option>
              <option value="on">Persistence: On</option>
              <option value="off">Persistence: Off</option>
            </select>
            <select value={sortBy} onChange={(e)=> setSortBy(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="recent">Sort: Recent</option>
              <option value="name">Sort: Name</option>
            </select>
            <Button 
              variant="outline" 
              onClick={fetchProfiles}
              disabled={loading}
              className="border-gray-200 hover:border-gray-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateModal(true)} variant="gradient" className="h-10 px-5">
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl animate-pulse border-0">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <Card className="m-6 text-center py-12 bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-lg">
          <CardContent>
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No profiles match your search.' : 'Create your first browser profile to get started.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
          {filteredProfiles.map((profile) => (
            <Card key={profile.profile_id} className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group rounded-2xl overflow-hidden h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                {/* Card Header (matches workflows) */}
                <div className="p-6 pb-4 flex-1 min-h-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold truncate max-w-[18rem]">{profile.profile_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500">ID: {profile.profile_id.slice(0,10)}…</span>
                          <button onClick={() => handleCopyId(profile.profile_id)} className="inline-flex items-center text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50" title="Copy Profile ID">
                            {copiedId === profile.profile_id ? (<><Check className="w-3 h-3 mr-1 text-emerald-600"/> Copied</>) : (<><Copy className="w-3 h-3 mr-1"/> Copy</>)}
                          </button>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm">Profile</Badge>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600"><Monitor className="w-4 h-4 mr-2"/>Viewport</div>
                      <span className="text-sm font-medium">{profile.browser_viewport_width} × {profile.browser_viewport_height}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600"><Shield className="w-4 h-4 mr-2"/>Ad Blocker</div>
                      <span className={`px-2.5 py-0.5 text-[11px] rounded-full font-semibold ${profile.ad_blocker ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-900'}`}>{profile.ad_blocker ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600"><Globe2 className="w-4 h-4 mr-2"/>Proxy</div>
                      <div className="flex items-center gap-2">
                        {profile.proxy ? (<><span className="text-sm leading-none">{getCountryFlag(profile.proxy_country_code)}</span><span className="text-xs font-medium text-gray-600 uppercase">{(profile.proxy_country_code || '').trim() ? (profile.proxy_country_code || '').toUpperCase() : '—'}</span></>) : (<span className="text-xs text-gray-500">—</span>)}
                        <span className={`px-2.5 py-0.5 text-[11px] rounded-full font-semibold ${profile.proxy ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-900'}`}>{profile.proxy ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">{profile.persist ? <Eye className="w-4 h-4 mr-2"/> : <EyeOff className="w-4 h-4 mr-2"/>}Data Persistence</div>
                      <span className={`px-2.5 py-0.5 text-[11px] rounded-full font-semibold ${profile.persist ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'}`}>{profile.persist ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer (matches workflows) */}
                <div className="mt-auto">
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-t border-gray-100/60">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{profile.browser_viewport_width} × {profile.browser_viewport_height}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="font-semibold text-gray-700">{profile.proxy ? 'Proxy On' : 'Proxy Off'}</span>
                      </div>
                      <span className="font-medium text-gray-600">{profile.profile_id.slice(0,8)}…</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button size="sm" variant="gradient" onClick={() => { setSelectedProfile(profile); setShowEditModal(true) }} className="w-full rounded-xl h-10"><Edit className="w-4 h-4 mr-2"/> Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteProfile(profile.profile_id)} className="w-full bg-white/90 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-xl h-10"><Trash2 className="w-4 h-4 mr-2"/> Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Profile Modal */}
      {showCreateModal && (
        <CreateBrowserProfileModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateProfile}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && selectedProfile && (
        <EditBrowserProfileModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProfile(null)
          }}
          onSave={handleEditProfile}
          profile={selectedProfile}
        />
      )}
    </div>
  )
}


