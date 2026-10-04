'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { Search, Github, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { parseGitHubUrl } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (owner: string, repo: string) => void;
  isLoading?: boolean;
}

export function SearchInput({ onSearch, isLoading = false }: SearchInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validateUrl = (value: string) => {
    const parsed = parseGitHubUrl(value);
    setIsValid(!!parsed);
    if (value && !parsed) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseGitHubUrl(url);
    if (parsed) {
      onSearch(parsed.owner, parsed.repo);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseGitHubUrl(url);
      if (parsed) {
        onSearch(parsed.owner, parsed.repo);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
          <Github className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            validateUrl(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="https://github.com/owner/repository"
          className="w-full pl-12 pr-12 py-4 text-lg bg-surface dark:bg-surface-dark border-2 border-border dark:border-border-dark rounded-xl text-text dark:text-text-dark placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
          aria-label="GitHub repository URL"
          autoComplete="off"
          autoFocus
        />
        {isLoading ? (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" aria-hidden="true" />
          </div>
        ) : isValid ? (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
          </div>
        ) : error ? (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-danger" aria-hidden="true" />
          </div>
        ) : (
          <Search className="absolute inset-y-0 right-0 pr-4 w-5 h-5 text-muted/50 pointer-events-none" aria-hidden="true" />
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-danger flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}
      <div className="mt-4 text-center text-sm text-muted">
        <kbd className="px-2 py-1 bg-muted/20 dark:bg-muted/10 rounded text-xs font-mono">Enter</kbd> to search
      </div>
    </form>
  );
}
