import {
  GitHubRepositorySchema,
  GitHubContributorSchema,
  GitHubCommitSchema,
  GitHubIssueSchema,
  GitHubPullRequestSchema,
  GitHubReleaseSchema,
  GitHubBranchProtectionSchema,
  GitHubLanguagesSchema,
  type GitHubRepository,
  type GitHubContributor,
  type GitHubCommit,
  type GitHubIssue,
  type GitHubPullRequest,
  type GitHubRelease,
  type GitHubBranchProtection,
  type GitHubLanguages,
} from './github-types';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

let rateLimitInfo: RateLimitInfo = {
  limit: 60,
  remaining: 60,
  reset: Date.now() + 3600000,
};

async function fetchWithCache<T>(
  url: string,
  schema: z.ZodSchema<T>,
  options: RequestInit = {}
): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  // Check rate limit
  if (rateLimitInfo.remaining <= 0) {
    const waitTime = rateLimitInfo.reset - Date.now();
    if (waitTime > 0) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoLens/1.0',
      ...options.headers,
    },
  });

  // Update rate limit info
  rateLimitInfo = {
    limit: parseInt(response.headers.get('X-RateLimit-Limit') || '60'),
    remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '60'),
    reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000,
  };

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found');
    }
    if (response.status === 403) {
      const resetTime = new Date(rateLimitInfo.reset).toLocaleTimeString();
      throw new Error(`Rate limit exceeded. Resets at ${resetTime}`);
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const parsed = schema.parse(data);
  
  cache.set(url, { data: parsed, timestamp: Date.now() });
  return parsed;
}

// We need zod for the function above
export { z } from 'zod';

// Repository
export async function fetchRepository(owner: string, repo: string): Promise<GitHubRepository> {
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
    GitHubRepositorySchema
  );
}

// Languages
export async function fetchLanguages(owner: string, repo: string): Promise<GitHubLanguages> {
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
    GitHubLanguagesSchema
  );
}

// Contributors
export async function fetchContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100`,
    z.array(GitHubContributorSchema)
  );
}

// Commits (last 90 days)
export async function fetchCommits(owner: string, repo: string, since?: string): Promise<GitHubCommit[]> {
  const sinceParam = since ? `?since=${since}&per_page=100` : '?per_page=100';
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits${sinceParam}`,
    z.array(GitHubCommitSchema)
  );
}

// Issues (last 90 days)
export async function fetchIssues(owner: string, repo: string, since?: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubIssue[]> {
  const sinceParam = since ? `&since=${since}` : '';
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}${sinceParam}&per_page=100`,
    z.array(GitHubIssueSchema)
  );
}

// Pull Requests (last 90 days)
export async function fetchPullRequests(owner: string, repo: string, since?: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubPullRequest[]> {
  const sinceParam = since ? `&since=${since}` : '';
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=${state}${sinceParam}&per_page=100`,
    z.array(GitHubPullRequestSchema)
  );
}

// Releases
export async function fetchReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
  return fetchWithCache(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=100`,
    z.array(GitHubReleaseSchema)
  );
}

// Branch Protection
export async function fetchBranchProtection(owner: string, repo: string, branch: string): Promise<GitHubBranchProtection | null> {
  try {
    return await fetchWithCache(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/${branch}/protection`,
      GitHubBranchProtectionSchema
    );
  } catch (error) {
    // Branch protection not enabled returns 404
    return null;
  }
}

// Get rate limit info
export function getRateLimitInfo(): RateLimitInfo {
  return { ...rateLimitInfo };
}

// Clear cache (for testing)
export function clearCache(): void {
  cache.clear();
}
