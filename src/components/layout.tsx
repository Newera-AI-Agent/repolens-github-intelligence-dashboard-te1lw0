'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useTheme } from './theme-provider';
import { Menu, X, Sun, Moon, Monitor, Copy, Check, ExternalLink, Github } from 'lucide-react';
import { generateShareUrl } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  repository?: {
    owner: string;
    name: string;
    html_url: string;
  } | null;
}

export function Layout({ children, repository = null }: LayoutProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    if (!repository) return;
    const url = generateShareUrl(repository.owner, repository.name);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeIcons = {
    light: <Sun className="w-5 h-5" />,
    dark: <Moon className="w-5 h-5" />,
    system: <Monitor className="w-5 h-5" />,
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark text-text dark:text-text-dark transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="RepoLens Home">
              <Github className="w-7 h-7 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl text-text dark:text-text-dark">RepoLens</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-text dark:hover:text-text-dark transition-colors"
              >
                Home
              </Link>
              {repository && (
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted hover:text-text dark:hover:text-text-dark transition-colors flex items-center gap-1.5"
                  aria-label="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  View on GitHub
                </a>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {repository && (
                <button
                  onClick={handleCopyUrl}
                  className="btn-ghost hidden sm:flex items-center gap-2"
                  aria-label={copied ? 'Copied to clipboard' : 'Copy shareable URL'}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-success" aria-hidden="true" />
                      <span className="text-sm">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">Share</span>
                    </>
                  )}
                </button>
              )}

              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => {
                    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
                    const currentIndex = themes.indexOf(theme);
                    const nextTheme = themes[(currentIndex + 1) % themes.length];
                    setTheme(nextTheme);
                  }}
                  className="btn-ghost p-2 rounded-lg"
                  aria-label={`Current theme: ${themeLabels[theme]}. Click to change.`}
                >
                  {themeIcons[theme]}
                </button>
                {/* Theme dropdown could be added here */}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden mt-4 pb-4 border-t border-border dark:border-border-dark animate-slide-up">
              <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-text dark:hover:text-text-dark rounded-lg hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {repository && (
                  <a
                    href={repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-muted hover:text-text dark:hover:text-text-dark rounded-lg hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    View on GitHub
                  </a>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8" id="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border-dark py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
            <p>RepoLens — GitHub Project Intelligence Dashboard</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Newera-AI-Agent/repolens-github-intelligence-dashboard-te1lw0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text dark:hover:text-text-dark transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                Source Code
              </a>
              <span>Built with Next.js & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
