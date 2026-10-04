import { z } from 'zod';

// Base GitHub Repository Schema
export const GitHubRepositorySchema = z.object({
  id: z.number(),
  node_id: z.string(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string().url(),
    gists_url: z.string().url(),
    starred_url: z.string().url(),
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string().url(),
    received_events_url: z.string().url(),
    type: z.string(),
    site_admin: z.boolean(),
  }),
  description: z.string().nullable(),
  fork: z.boolean(),
  url: z.string().url(),
  html_url: z.string().url(),
  archive_url: z.string(),
  assignees_url: z.string(),
  blobs_url: z.string(),
  branches_url: z.string(),
  collaborators_url: z.string(),
  comments_url: z.string(),
  commits_url: z.string(),
  compare_url: z.string(),
  contents_url: z.string(),
  contributors_url: z.string().url(),
  deployments_url: z.string().url(),
  downloads_url: z.string().url(),
  events_url: z.string().url(),
  forks_url: z.string().url(),
  git_commits_url: z.string(),
  git_refs_url: z.string(),
  git_tags_url: z.string(),
  git_url: z.string().url(),
  issue_comment_url: z.string(),
  issue_events_url: z.string(),
  issues_url: z.string(),
  keys_url: z.string(),
  labels_url: z.string(),
  languages_url: z.string().url(),
  merges_url: z.string(),
  milestones_url: z.string(),
  notifications_url: z.string(),
  pulls_url: z.string(),
  releases_url: z.string(),
  ssh_url: z.string().url(),
  stargazers_url: z.string().url(),
  statuses_url: z.string(),
  subscribers_url: z.string().url(),
  subscription_url: z.string().url(),
  tags_url: z.string().url(),
  teams_url: z.string().url(),
  trees_url: z.string(),
  clone_url: z.string().url(),
  mirror_url: z.string().nullable(),
  hooks_url: z.string().url(),
  svn_url: z.string().url(),
  homepage: z.string().nullable(),
  language: z.string().nullable(),
  forks_count: z.number(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  size: z.number(),
  default_branch: z.string(),
  open_issues_count: z.number(),
  is_template: z.boolean(),
  topics: z.array(z.string()),
  has_issues: z.boolean(),
  has_projects: z.boolean(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  has_downloads: z.boolean(),
  archived: z.boolean(),
  disabled: z.boolean(),
  visibility: z.string(),
  pushed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  permissions: z.object({
    admin: z.boolean(),
    maintain: z.boolean(),
    push: z.boolean(),
    pull: z.boolean(),
  }).optional(),
  license: z.object({
    key: z.string(),
    name: z.string(),
    spdx_id: z.string().nullable(),
    url: z.string().nullable(),
    node_id: z.string(),
  }).nullable(),
});

// Contributor Schema
export const GitHubContributorSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string().url(),
  gravatar_id: z.string(),
  url: z.string().url(),
  html_url: z.string().url(),
  followers_url: z.string().url(),
  following_url: z.string().url(),
  gists_url: z.string().url(),
  starred_url: z.string().url(),
  subscriptions_url: z.string().url(),
  organizations_url: z.string().url(),
  repos_url: z.string().url(),
  events_url: z.string().url(),
  received_events_url: z.string().url(),
  type: z.string(),
  site_admin: z.boolean(),
  contributions: z.number(),
});

// Commit Schema
export const GitHubCommitSchema = z.object({
  sha: z.string(),
  node_id: z.string(),
  commit: z.object({
    author: z.object({
      name: z.string(),
      email: z.string(),
      date: z.string(),
    }),
    committer: z.object({
      name: z.string(),
      email: z.string(),
      date: z.string(),
    }),
    message: z.string(),
    tree: z.object({
      sha: z.string(),
      url: z.string().url(),
    }),
    url: z.string().url(),
    comment_count: z.number(),
    verification: z.object({
      verified: z.boolean(),
      reason: z.string().nullable(),
      signature: z.string().nullable(),
      payload: z.string().nullable(),
    }).nullable(),
  }),
  url: z.string().url(),
  html_url: z.string().url(),
  comments_url: z.string().url(),
  author: GitHubContributorSchema.nullable(),
  committer: GitHubContributorSchema.nullable(),
  parents: z.array(z.object({
    sha: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
  })),
  stats: z.object({
    additions: z.number(),
    deletions: z.number(),
    total: z.number(),
  }).optional(),
  files: z.array(z.object({
    sha: z.string(),
    filename: z.string(),
    status: z.string(),
    additions: z.number(),
    deletions: z.number(),
    changes: z.number(),
    blob_url: z.string().url(),
    raw_url: z.string().url(),
    contents_url: z.string().url(),
    patch: z.string().optional(),
  })).optional(),
});

// Issue Schema
export const GitHubIssueSchema = z.object({
  id: z.number(),
  node_id: z.string(),
  url: z.string().url(),
  repository_url: z.string().url(),
  labels_url: z.string(),
  comments_url: z.string().url(),
  events_url: z.string().url(),
  html_url: z.string().url(),
  number: z.number(),
  state: z.enum(['open', 'closed']),
  title: z.string(),
  body: z.string().nullable(),
  user: GitHubContributorSchema,
  labels: z.array(z.object({
    id: z.number(),
    node_id: z.string(),
    url: z.string().url(),
    name: z.string(),
    color: z.string(),
    default: z.boolean(),
    description: z.string().nullable(),
  })),
  assignee: GitHubContributorSchema.nullable(),
  assignees: z.array(GitHubContributorSchema),
  milestone: z.object({
    url: z.string().url(),
    html_url: z.string().url(),
    labels_url: z.string(),
    id: z.number(),
    node_id: z.string(),
    number: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    creator: GitHubContributorSchema,
    open_issues: z.number(),
    closed_issues: z.number(),
    state: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullable(),
    due_on: z.string().nullable(),
  }).nullable(),
  locked: z.boolean(),
  active_lock_reason: z.string().nullable(),
  comments: z.number(),
  pull_request: z.object({
    url: z.string().url(),
    html_url: z.string().url(),
    diff_url: z.string().url(),
    patch_url: z.string().url(),
    merged_at: z.string().nullable(),
  }).optional(),
  closed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_by: GitHubContributorSchema.nullable(),
  author_association: z.string(),
  state_reason: z.string().nullable(),
});

// Pull Request Schema
export const GitHubPullRequestSchema = z.object({
  id: z.number(),
  node_id: z.string(),
  url: z.string().url(),
  html_url: z.string().url(),
  diff_url: z.string().url(),
  patch_url: z.string().url(),
  issue_url: z.string().url(),
  number: z.number(),
  state: z.enum(['open', 'closed']),
  locked: z.boolean(),
  title: z.string(),
  user: GitHubContributorSchema,
  body: z.string().nullable(),
  labels: z.array(z.object({
    id: z.number(),
    node_id: z.string(),
    url: z.string().url(),
    name: z.string(),
    color: z.string(),
    default: z.boolean(),
    description: z.string().nullable(),
  })),
  milestone: z.object({
    url: z.string().url(),
    html_url: z.string().url(),
    labels_url: z.string(),
    id: z.number(),
    node_id: z.string(),
    number: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    creator: GitHubContributorSchema,
    open_issues: z.number(),
    closed_issues: z.number(),
    state: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullable(),
    due_on: z.string().nullable(),
  }).nullable(),
  active_lock_reason: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  merged_at: z.string().nullable(),
  merge_commit_sha: z.string().nullable(),
  assignee: GitHubContributorSchema.nullable(),
  assignees: z.array(GitHubContributorSchema),
  requested_reviewers: z.array(GitHubContributorSchema),
  requested_teams: z.array(z.object({
    id: z.number(),
    node_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    privacy: z.string(),
    permission: z.string(),
    members_url: z.string().url(),
    repositories_url: z.string().url(),
    permission: z.string(),
  })),
  head: z.object({
    label: z.string(),
    ref: z.string(),
    sha: z.string(),
    user: GitHubContributorSchema,
    repo: GitHubRepositorySchema.nullable(),
  }),
  base: z.object({
    label: z.string(),
    ref: z.string(),
    sha: z.string(),
    user: GitHubContributorSchema,
    repo: GitHubRepositorySchema,
  }),
  merged: z.boolean(),
  mergeable: z.boolean().nullable(),
  rebaseable: z.boolean().nullable(),
  mergeable_state: z.string(),
  merged_by: GitHubContributorSchema.nullable(),
  comments: z.number(),
  review_comments: z.number(),
  maintainer_can_modify: z.boolean(),
  commits: z.number(),
  additions: z.number(),
  deletions: z.number(),
  changed_files: z.number(),
});

// Release Schema
export const GitHubReleaseSchema = z.object({
  url: z.string().url(),
  html_url: z.string().url(),
  assets_url: z.string().url(),
  upload_url: z.string(),
  tarball_url: z.string().url(),
  zipball_url: z.string().url(),
  id: z.number(),
  node_id: z.string(),
  tag_name: z.string(),
  target_commitish: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  created_at: z.string(),
  published_at: z.string().nullable(),
  author: GitHubContributorSchema,
  assets: z.array(z.object({
    url: z.string().url(),
    id: z.number(),
    node_id: z.string(),
    name: z.string(),
    label: z.string().nullable(),
    uploader: GitHubContributorSchema,
    content_type: z.string(),
    state: z.string(),
    size: z.number(),
    download_count: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    browser_download_url: z.string().url(),
  })),
});

// Branch Protection Schema
export const GitHubBranchProtectionSchema = z.object({
  url: z.string().url(),
  enabled: z.boolean(),
  required_status_checks: z.object({
    url: z.string().url(),
    strict: z.boolean(),
    contexts: z.array(z.string()),
    checks: z.array(z.object({
      context: z.string(),
      app_id: z.number().nullable(),
    })).optional(),
  }).nullable(),
  enforce_admins: z.object({
    url: z.string().url(),
    enabled: z.boolean(),
  }).nullable(),
  required_pull_request_reviews: z.object({
    url: z.string().url(),
    dismiss_stale_reviews: z.boolean(),
    require_code_owner_reviews: z.boolean(),
    required_approving_review_count: z.number(),
    require_last_push_approval: z.boolean().optional(),
    bypass_pull_request_allowances: z.array(z.object({
      actor_id: z.number(),
      actor_type: z.string(),
      actor_attributes: z.object({
        login: z.string(),
        type: z.string(),
        site_admin: z.boolean(),
      }).optional(),
    })).optional(),
  }).nullable(),
  restrictions: z.object({
    url: z.string().url(),
    users: z.array(GitHubContributorSchema),
    teams: z.array(z.object({
      id: z.number(),
      node_id: z.string(),
      url: z.string().url(),
      html_url: z.string().url(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      privacy: z.string(),
      permission: z.string(),
      members_url: z.string().url(),
      repositories_url: z.string().url(),
    })),
    apps: z.array(z.object({
      id: z.number(),
      node_id: z.string(),
      url: z.string().url(),
      html_url: z.string().url(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      external_url: z.string().url(),
    })),
  }).nullable(),
  required_linear_history: z.boolean().optional(),
  allow_force_pushes: z.boolean().optional(),
  allow_deletions: z.boolean().optional(),
  required_conversation_resolution: z.boolean().optional(),
  lock_branch: z.boolean().optional(),
  required_signatures: z.object({
    url: z.string().url(),
    enabled: z.boolean(),
  }).nullable(),
});

// Language Schema
export const GitHubLanguagesSchema = z.record(z.string(), z.number());

// Export inferred types
export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;
export type GitHubContributor = z.infer<typeof GitHubContributorSchema>;
export type GitHubCommit = z.infer<typeof GitHubCommitSchema>;
export type GitHubIssue = z.infer<typeof GitHubIssueSchema>;
export type GitHubPullRequest = z.infer<typeof GitHubPullRequestSchema>;
export type GitHubRelease = z.infer<typeof GitHubReleaseSchema>;
export type GitHubBranchProtection = z.infer<typeof GitHubBranchProtectionSchema>;
export type GitHubLanguages = z.infer<typeof GitHubLanguagesSchema>;

// Intelligence Types
export interface RepositoryHealthScore {
  score: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  factors: {
    recentActivity: number;
    issueResponseTime: number;
    issueCloseRate: number;
    prMergeRate: number;
    contributorDiversity: number;
    documentationPresence: number;
    releaseCadence: number;
    dependencyFreshness: number;
  };
}

export interface ActivityVelocity {
  commitsPerWeek: number[];
  issuesOpenedPerWeek: number[];
  issuesClosedPerWeek: number[];
  prsOpenedPerWeek: number[];
  prsMergedPerWeek: number[];
  weeks: string[];
}

export interface CommunityHealth {
  busFactor: number;
  firstTimeContributorFriendliness: number;
  responseRate: number;
  staleIssueRatio: number;
  stalePrRatio: number;
}

export interface CodeQualitySignals {
  branchProtection: boolean;
  requiredStatusChecks: boolean;
  codeReviewRequirements: boolean;
  signedCommitsRequired: boolean;
  dependabotAlertsCount: number;
  codeScanningAlertsCount: number;
}

export interface RepositoryMaturity {
  ageInMonths: number;
  totalReleases: number;
  semanticVersioningAdoption: boolean;
  changelogPresence: boolean;
}

export interface RepositoryIntelligence {
  healthScore: RepositoryHealthScore;
  activityVelocity: ActivityVelocity;
  communityHealth: CommunityHealth;
  codeQualitySignals: CodeQualitySignals;
  maturity: RepositoryMaturity;
}

// Complete Dashboard Data
export interface DashboardData {
  repository: GitHubRepository;
  languages: GitHubLanguages;
  contributors: GitHubContributor[];
  commits: GitHubCommit[];
  issues: GitHubIssue[];
  pullRequests: GitHubPullRequest[];
  releases: GitHubRelease[];
  branchProtection: GitHubBranchProtection | null;
  intelligence: RepositoryIntelligence;
  fetchedAt: string;
}
