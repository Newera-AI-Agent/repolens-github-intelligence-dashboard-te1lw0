import {
  type GitHubRepository,
  type GitHubContributor,
  type GitHubCommit,
  type GitHubIssue,
  type GitHubPullRequest,
  type GitHubRelease,
  type GitHubBranchProtection,
  type GitHubLanguages,
  type RepositoryHealthScore,
  type ActivityVelocity,
  type CommunityHealth,
  type CodeQualitySignals,
  type RepositoryMaturity,
  type RepositoryIntelligence,
} from './github-types';

// Helper functions
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
}

function weeksBetween(date1: string, date2: string): number {
  return daysBetween(date1, date2) / 7;
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const week = Math.ceil((date.getDate() + date.getDay()) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function getLastNWeeks(n: number): string[] {
  const weeks: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    const year = date.getFullYear();
    const weekNum = Math.ceil((date.getDate() + 6) / 7); // Approximate week
    weeks.push(`${year}-W${String(weekNum).padStart(2, '0')}`);
  }
  return weeks;
}

// Calculate Repository Health Score (0-100)
export function calculateHealthScore(
  repository: GitHubRepository,
  commits: GitHubCommit[],
  issues: GitHubIssue[],
  pullRequests: GitHubPullRequest[],
  contributors: GitHubContributor[],
  releases: GitHubRelease[],
  branchProtection: GitHubBranchProtection | null
): RepositoryHealthScore {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Recent Activity (commits in last 30/90 days) - weight: 20%
  const recentCommits30 = commits.filter(c => new Date(c.commit.author.date) >= new Date(thirtyDaysAgo)).length;
  const recentCommits90 = commits.filter(c => new Date(c.commit.author.date) >= new Date(ninetyDaysAgo)).length;
  const recentActivityScore = Math.min(100, (recentCommits30 * 2 + recentCommits90 * 0.5));

  // 2. Issue Response Time (median time to first response) - weight: 15%
  const issuesWithComments = issues.filter(i => i.comments > 0);
  let issueResponseTimeScore = 50; // default neutral
  if (issuesWithComments.length > 0) {
    const responseTimes = issuesWithComments.map(issue => {
      // We can't easily get first response time from the basic API
      // Use created_at to updated_at as proxy for now
      return daysBetween(issue.created_at, issue.updated_at);
    });
    responseTimes.sort((a, b) => a - b);
    const medianResponse = responseTimes[Math.floor(responseTimes.length / 2)];
    // Score: <1 day = 100, 1-3 days = 80, 3-7 days = 60, 7-14 days = 40, >14 days = 20
    if (medianResponse < 1) issueResponseTimeScore = 100;
    else if (medianResponse < 3) issueResponseTimeScore = 80;
    else if (medianResponse < 7) issueResponseTimeScore = 60;
    else if (medianResponse < 14) issueResponseTimeScore = 40;
    else issueResponseTimeScore = 20;
  }

  // 3. Issue Close Rate (closed / total in last 90 days) - weight: 15%
  const recentIssues = issues.filter(i => new Date(i.created_at) >= new Date(ninetyDaysAgo));
  const closedIssues = recentIssues.filter(i => i.state === 'closed').length;
  const issueCloseRate = recentIssues.length > 0 ? (closedIssues / recentIssues.length) * 100 : 50;

  // 4. PR Merge Rate (merged / total in last 90 days) - weight: 15%
  const recentPRs = pullRequests.filter(pr => new Date(pr.created_at) >= new Date(ninetyDaysAgo));
  const mergedPRs = recentPRs.filter(pr => pr.merged_at !== null).length;
  const prMergeRate = recentPRs.length > 0 ? (mergedPRs / recentPRs.length) * 100 : 50;

  // 5. Contributor Diversity (unique contributors in last 90 days) - weight: 10%
  const recentContributors = new Set(
    [...commits.filter(c => new Date(c.commit.author.date) >= new Date(ninetyDaysAgo)).map(c => c.author?.login).filter(Boolean),
     ...pullRequests.filter(pr => new Date(pr.created_at) >= new Date(ninetyDaysAgo)).map(pr => pr.user.login),
     ...issues.filter(i => new Date(i.created_at) >= new Date(ninetyDaysAgo)).map(i => i.user.login)
    ]
  ).size;
  const contributorDiversityScore = Math.min(100, recentContributors * 5);

  // 6. Documentation Presence - weight: 10%
  const hasReadme = true; // Would need to check repo contents API
  const hasContributing = false; // Would need to check
  const hasCodeOfConduct = false; // Would need to check
  const hasLicense = repository.license !== null;
  const docScore = (hasReadme ? 25 : 0) + (hasContributing ? 25 : 0) + (hasCodeOfConduct ? 25 : 0) + (hasLicense ? 25 : 0);

  // 7. Release Cadence (releases in last year) - weight: 10%
  const recentReleases = releases.filter(r => new Date(r.published_at || r.created_at) >= new Date(oneYearAgo)).length;
  const releaseCadenceScore = Math.min(100, recentReleases * 10);

  // 8. Dependency Freshness - weight: 5%
  // Placeholder - would need Dependabot API or package.json analysis
  const dependencyFreshnessScore = 50;

  // Weighted average
  const weights = {
    recentActivity: 0.20,
    issueResponseTime: 0.15,
    issueCloseRate: 0.15,
    prMergeRate: 0.15,
    contributorDiversity: 0.10,
    documentationPresence: 0.10,
    releaseCadence: 0.10,
    dependencyFreshness: 0.05,
  };

  const factors = {
    recentActivity: recentActivityScore,
    issueResponseTime: issueResponseTimeScore,
    issueCloseRate: issueCloseRate,
    prMergeRate: prMergeRate,
    contributorDiversity: contributorDiversityScore,
    documentationPresence: docScore,
    releaseCadence: releaseCadenceScore,
    dependencyFreshness: dependencyFreshnessScore,
  };

  const score = Math.round(
    factors.recentActivity * weights.recentActivity +
    factors.issueResponseTime * weights.issueResponseTime +
    factors.issueCloseRate * weights.issueCloseRate +
    factors.prMergeRate * weights.prMergeRate +
    factors.contributorDiversity * weights.contributorDiversity +
    factors.documentationPresence * weights.documentationPresence +
    factors.releaseCadence * weights.releaseCadence +
    factors.dependencyFreshness * weights.dependencyFreshness
  );

  let label: RepositoryHealthScore['label'] = 'Needs Attention';
  if (score >= 80) label = 'Excellent';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Fair';

  return { score, label, factors };
}

// Calculate Activity Velocity
export function calculateActivityVelocity(
  commits: GitHubCommit[],
  issues: GitHubIssue[],
  pullRequests: GitHubPullRequest[]
): ActivityVelocity {
  const now = new Date();
  const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
  
  // Initialize arrays for 12 weeks
  const weeks = getLastNWeeks(12);
  const commitsPerWeek = new Array(12).fill(0);
  const issuesOpenedPerWeek = new Array(12).fill(0);
  const issuesClosedPerWeek = new Array(12).fill(0);
  const prsOpenedPerWeek = new Array(12).fill(0);
  const prsMergedPerWeek = new Array(12).fill(0);

  // Process commits
  commits.forEach(commit => {
    const commitDate = new Date(commit.commit.author.date);
    if (commitDate >= twelveWeeksAgo) {
      const weekIndex = Math.floor((now.getTime() - commitDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex >= 0 && weekIndex < 12) {
        commitsPerWeek[11 - weekIndex]++;
      }
    }
  });

  // Process issues
  issues.forEach(issue => {
    const createdDate = new Date(issue.created_at);
    if (createdDate >= twelveWeeksAgo) {
      const weekIndex = Math.floor((now.getTime() - createdDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex >= 0 && weekIndex < 12) {
        issuesOpenedPerWeek[11 - weekIndex]++;
      }
    }
    if (issue.closed_at) {
      const closedDate = new Date(issue.closed_at);
      if (closedDate >= twelveWeeksAgo) {
        const weekIndex = Math.floor((now.getTime() - closedDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weekIndex >= 0 && weekIndex < 12) {
          issuesClosedPerWeek[11 - weekIndex]++;
        }
      }
    }
  });

  // Process PRs
  pullRequests.forEach(pr => {
    const createdDate = new Date(pr.created_at);
    if (createdDate >= twelveWeeksAgo) {
      const weekIndex = Math.floor((now.getTime() - createdDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex >= 0 && weekIndex < 12) {
        prsOpenedPerWeek[11 - weekIndex]++;
      }
    }
    if (pr.merged_at) {
      const mergedDate = new Date(pr.merged_at);
      if (mergedDate >= twelveWeeksAgo) {
        const weekIndex = Math.floor((now.getTime() - mergedDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weekIndex >= 0 && weekIndex < 12) {
          prsMergedPerWeek[11 - weekIndex]++;
        }
      }
    }
  });

  return {
    commitsPerWeek,
    issuesOpenedPerWeek,
    issuesClosedPerWeek,
    prsOpenedPerWeek,
    prsMergedPerWeek,
    weeks,
  };
}

// Calculate Community Health
export function calculateCommunityHealth(
  repository: GitHubRepository,
  contributors: GitHubContributor[],
  commits: GitHubCommit[],
  issues: GitHubIssue[],
  pullRequests: GitHubPullRequest[]
): CommunityHealth {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Bus Factor: contributors covering 80% of commits
  const commitCounts = new Map<string, number>();
  commits.forEach(commit => {
    if (commit.author?.login) {
      commitCounts.set(commit.author.login, (commitCounts.get(commit.author.login) || 0) + 1);
    }
  });
  const totalCommits = commits.length;
  const sortedContributors = Array.from(commitCounts.entries())
    .sort((a, b) => b[1] - a[1]);
  let cumulativeCommits = 0;
  let busFactor = 0;
  for (const [, count] of sortedContributors) {
    cumulativeCommits += count;
    busFactor++;
    if (cumulativeCommits / totalCommits >= 0.8) break;
  }
  const busFactorScore = Math.min(100, (busFactor / 5) * 100); // 5+ contributors = 100

  // First-time contributor friendliness
  const hasGoodFirstIssue = issues.some(i => 
    i.labels.some(l => l.name.toLowerCase().includes('good first issue') || l.name.toLowerCase().includes('first-timer'))
  );
  // We can't easily check for CONTRIBUTING.md without contents API
  const hasContributingGuide = false;
  const firstTimeScore = (hasGoodFirstIssue ? 50 : 0) + (hasContributingGuide ? 50 : 0);

  // Response Rate (% issues/PRs with maintainer response in 48h)
  // Simplified: check if issues/PRs have comments from repo collaborators
  // This is a proxy since we don't have collaborator list
  const recentIssues = issues.filter(i => new Date(i.created_at) >= ninetyDaysAgo);
  const recentPRs = pullRequests.filter(pr => new Date(pr.created_at) >= ninetyDaysAgo);
  
  let respondedIssues = 0;
  recentIssues.forEach(issue => {
    if (issue.comments > 0) respondedIssues++;
  });
  
  let respondedPRs = 0;
  recentPRs.forEach(pr => {
    if (pr.review_comments > 0 || pr.comments > 0) respondedPRs++;
  });
  
  const totalRecent = recentIssues.length + recentPRs.length;
  const responseRate = totalRecent > 0 ? ((respondedIssues + respondedPRs) / totalRecent) * 100 : 50;

  // Stale Issue/PR Ratio (open for > 90 days without activity)
  const staleIssues = issues.filter(i => 
    i.state === 'open' && 
    new Date(i.updated_at) < ninetyDaysAgo
  ).length;
  const stalePRs = pullRequests.filter(pr => 
    pr.state === 'open' && 
    new Date(pr.updated_at) < ninetyDaysAgo
  ).length;
  const openIssues = issues.filter(i => i.state === 'open').length;
  const openPRs = pullRequests.filter(pr => pr.state === 'open').length;
  const staleIssueRatio = openIssues > 0 ? (staleIssues / openIssues) * 100 : 0;
  const stalePrRatio = openPRs > 0 ? (stalePRs / openPRs) * 100 : 0;

  return {
    busFactor: busFactorScore,
    firstTimeContributorFriendliness: firstTimeScore,
    responseRate,
    staleIssueRatio,
    stalePrRatio,
  };
}

// Calculate Code Quality Signals
export function calculateCodeQualitySignals(
  branchProtection: GitHubBranchProtection | null
): CodeQualitySignals {
  return {
    branchProtection: branchProtection !== null,
    requiredStatusChecks: branchProtection?.required_status_checks !== null && branchProtection.required_status_checks.enabled,
    codeReviewRequirements: branchProtection?.required_pull_request_reviews !== null && branchProtection.required_pull_request_reviews.required_approving_review_count > 0,
    signedCommitsRequired: branchProtection?.required_signatures?.enabled === true,
    dependabotAlertsCount: 0, // Not accessible via public API
    codeScanningAlertsCount: 0, // Not accessible via public API
  };
}

// Calculate Repository Maturity
export function calculateRepositoryMaturity(
  repository: GitHubRepository,
  releases: GitHubRelease[]
): RepositoryMaturity {
  const createdAt = new Date(repository.created_at);
  const now = new Date();
  const ageInMonths = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());

  // Semantic versioning adoption: check if releases follow semver
  const semverReleases = releases.filter(r => {
    const tag = r.tag_name.replace(/^v/, '');
    return /^\d+\.\d+\.\d+(-.*)?$/.test(tag);
  });
  const semanticVersioningAdoption = releases.length > 0 
    ? (semverReleases.length / releases.length) > 0.5
    : false;

  // Changelog presence - would need to check repo contents
  const changelogPresence = false;

  return {
    ageInMonths,
    totalReleases: releases.length,
    semanticVersioningAdoption,
    changelogPresence,
  };
}

// Main intelligence calculation
export function calculateIntelligence(
  repository: GitHubRepository,
  languages: GitHubLanguages,
  contributors: GitHubContributor[],
  commits: GitHubCommit[],
  issues: GitHubIssue[],
  pullRequests: GitHubPullRequest[],
  releases: GitHubRelease[],
  branchProtection: GitHubBranchProtection | null
): RepositoryIntelligence {
  const healthScore = calculateHealthScore(repository, commits, issues, pullRequests, contributors, releases, branchProtection);
  const activityVelocity = calculateActivityVelocity(commits, issues, pullRequests);
  const communityHealth = calculateCommunityHealth(repository, contributors, commits, issues, pullRequests);
  const codeQualitySignals = calculateCodeQualitySignals(branchProtection);
  const maturity = calculateRepositoryMaturity(repository, releases);

  return {
    healthScore,
    activityVelocity,
    communityHealth,
    codeQualitySignals,
    maturity,
  };
}

// Re-export zod for the client
import { z } from 'zod';
export { z };
