export * from './infrastructure'

export const IS_PLATFORM = process.env.NEXT_PUBLIC_IS_PLATFORM === 'true'
export const DEFAULT_HOME = IS_PLATFORM ? '/projects' : '/project/default'
export const API_URL = IS_PLATFORM ? process.env.NEXT_PUBLIC_API_URL : '/api'
export const API_ADMIN_URL = IS_PLATFORM ? process.env.NEXT_PUBLIC_API_ADMIN_URL : undefined
export const PG_META_URL = IS_PLATFORM
  ? process.env.PLATFORM_PG_META_URL
  : process.env.STUDIO_PG_META_URL
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * @deprecated use DATETIME_FORMAT
 */
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

// should be used for all dayjs formattings shown to the user. Includes timezone info.
export const DATETIME_FORMAT = 'DD MMM YYYY, HH:mm:ss (ZZ)'

export const GOTRUE_ERRORS = {
  UNVERIFIED_GITHUB_USER: 'Error sending confirmation mail',
}

export const STRIPE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_XVwg5IZH3I9Gti98hZw6KRzd00v5858heG'

export const USAGE_APPROACHING_THRESHOLD = 0.75

export const LOCAL_STORAGE_KEYS = {
  RECENTLY_VISITED_ORGANIZATION: 'supabase-organization',
  TELEMETRY_CONSENT: 'supabase-consent',

  UI_PREVIEW_NAVIGATION_LAYOUT: 'supabase-ui-preview-nav-layout',
  UI_PREVIEW_API_SIDE_PANEL: 'supabase-ui-api-side-panel',
  UI_PREVIEW_RLS_AI_ASSISTANT: 'supabase-ui-rls-ai-assistant',
  UI_PREVIEW_CLS: 'supabase-ui-cls',
  UI_PREVIEW_SQL_EDITOR_AI_ASSISTANT: 'supabase-ui-sql-editor-ai-assistant',

  DASHBOARD_HISTORY: (ref: string) => `dashboard-history-${ref}`,

  SQL_EDITOR_INTELLISENSE: 'supabase_sql-editor-intellisense-enabled',
  SQL_EDITOR_SPLIT_SIZE: 'supabase_sql-editor-split-size',
  SQL_EDITOR_AI_SCHEMA: 'supabase_sql-editor-ai-schema-enabled',
  LOG_EXPLORER_SPLIT_SIZE: 'supabase_log-explorer-split-size',
  GRAPHIQL_RLS_BYPASS_WARNING: 'graphiql-rls-bypass-warning-dismissed',
  CLS_DIFF_WARNING: 'cls-diff-warning-dismissed',
  CLS_SELECT_STAR_WARNING: 'cls-select-star-warning-dismissed',
  PGBOUNCER_IPV6_DEPRECATION_WARNING: 'pgbouncer-ipv6-deprecation-warning-dismissed',
  VERCEL_IPV6_DEPRECATION_WARNING: 'vercel-ipv6-deprecation-warning-dismissed',
  PGBOUNCER_DEPRECATION_WARNING: 'pgbouncer-deprecation-warning-dismissed',
  TABLE_EDITOR_SELECTED_SCHEMA: 'supabase_table-editor-selected-schema',
}

export const OPT_IN_TAGS = {
  AI_SQL: 'AI_SQL_GENERATOR_OPT_IN',
}

export const GB = 1024 * 1024 * 1024
