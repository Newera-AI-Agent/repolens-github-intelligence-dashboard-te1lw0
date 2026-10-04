import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Since we don't have clsx and tailwind-merge installed, let's create simple versions
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

// Format numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// Format date
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format relative time
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 30) {
    return formatDate(dateStr)
  }
  if (diffDays > 0) {
    return `${diffDays}d ago`
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`
  }
  if (diffMinutes > 0) {
    return `${diffMinutes}m ago`
  }
  return 'Just now'
}

// Parse GitHub URL
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'github.com') return null
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) return null
    return { owner: pathParts[0], repo: pathParts[1] }
  } catch {
    return null
  }
}

// Generate shareable URL
export function generateShareUrl(owner: string, repo: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/repo/${owner}/${repo}`
  }
  return `/repo/${owner}/${repo}`
}

// Get health score color
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  if (score >= 40) return 'text-warning'
  return 'text-danger'
}

// Get health score background
export function getHealthScoreBg(score: number): string {
  if (score >= 80) return 'bg-success/10 border-success/20'
  if (score >= 60) return 'bg-primary/10 border-primary/20'
  if (score >= 40) return 'bg-warning/10 border-warning/20'
  return 'bg-danger/10 border-danger/20'
}

// Sparkline component data
export function generateSparklinePath(data: number[], width: number, height: number): string {
  if (data.length === 0) return ''
  const max = Math.max(...data, 1)
  const stepX = width / (data.length - 1 || 1)
  return data
    .map((value, index) => {
      const x = index * stepX
      const y = height - (value / max) * height
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}
