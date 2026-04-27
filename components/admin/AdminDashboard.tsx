'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '../ui/Button'
import { VisitorStatsModal } from './VisitorStatsModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function AdminDashboard() {
  const [showVisitorModal, setShowVisitorModal] = useState(false)

  const { data, error, isLoading, mutate } = useSWR('/api/admin/stats', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  })

  const stats = data?.success ? data.stats : null

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex gap-6 overflow-x-auto">
            <Link
              href="/admin/dashboard"
              className="border-b-2 border-primary-600 px-3 py-2 text-sm font-medium text-primary-600 whitespace-nowrap"
            >
              Statistics
            </Link>
            <Link
              href="/admin/content/home"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Home Page
            </Link>
            <Link
              href="/admin/content/about"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              About Page
            </Link>
            <Link
              href="/admin/content/projects"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Projects
            </Link>
            <Link
              href="/admin/content/blog"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Blog
            </Link>
            <Link
              href="/admin/content/contact"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Contact
            </Link>
            <Link
              href="/admin/contact-requests"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Contact Requests
            </Link>
          </nav>
        </div>

        {/* Statistics */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Loading statistics...</div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">Failed to load statistics. Please try again.</div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Unique Visitors"
                value={stats.visitors?.thisMonth || 0}
                icon="👥"
                color="bg-teal-50 text-teal-600"
                subtitle="this month"
                onClick={() => setShowVisitorModal(true)}
              />
              <Link href="/admin/contact-requests">
                <StatCard
                  title="Contact Requests"
                  value={stats.contactRequests?.pending || 0}
                  icon="📬"
                  color="bg-amber-50 text-amber-600"
                  subtitle="pending"
                />
              </Link>
              <StatCard
                title="Total Visitors"
                value={stats.visitors?.total || 0}
                icon="📊"
                color="bg-purple-50 text-purple-600"
                subtitle="all time"
                onClick={() => setShowVisitorModal(true)}
              />
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/admin/content/home"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">🏠</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Edit Home Page</div>
                </Link>
                <Link
                  href="/admin/content/about"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">👤</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Edit About Page</div>
                </Link>
                <Link
                  href="/admin/content/projects/new"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">🚀</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Create Project</div>
                </Link>
                <Link
                  href="/admin/content/blog/new"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">✍️</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Write Blog Post</div>
                </Link>
                <Link
                  href="/admin/content/contact"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">📧</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Manage Contact</div>
                </Link>
                <Link
                  href="/admin/contact-requests"
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">📬</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">Contact Requests</div>
                </Link>
                <button
                  onClick={() => mutate()}
                  className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <div className="text-2xl">🔄</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">
                    {isLoading ? 'Refreshing...' : 'Refresh Stats'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <VisitorStatsModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        stats={stats?.visitors || null}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  onClick,
}: {
  title: string
  value: number
  icon: string
  color: string
  subtitle?: string
  onClick?: () => void
}) {
  const content = (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {value}
          {subtitle && <span className="text-sm font-normal text-slate-500 ml-1">{subtitle}</span>}
        </p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-lg bg-white p-6 text-left shadow transition-shadow hover:shadow-md"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
      {content}
    </div>
  )
}
