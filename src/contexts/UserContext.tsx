'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface UserContextType {
  user: User | null
  loading: boolean
  updateUser: (userData: Partial<User>) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with default user data
    // In a real app, this would fetch from API/auth service
    const defaultUser: User = {
      id: '1',
      name: 'rajesh',
      email: 'rajesh@example.com',
      accountType: 'pro'
    }
    
    setUser(defaultUser)
    setLoading(false)
  }, [])

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const logout = () => {
    setUser(null)
    // Additional logout logic here
  }

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 