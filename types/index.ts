// ================================
// DATABASE TYPES
// ================================

export type Plan = 'free' | 'pro' | 'team'

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  stripe_customer_id: string | null
  created_at: string
}

export type WorkflowStatus = 'active' | 'paused' | 'error'

export type TriggerType =
  | 'new_email'
  | 'new_stripe_payment'
  | 'new_form_submission'
  | 'scheduled'
  | 'webhook'

export type ActionType =
  | 'send_email'
  | 'add_to_sheet'
  | 'create_notion_page'
  | 'send_slack_message'
  | 'http_request'

export type Workflow = {
  id: string
  user_id: string
  name: string
  description: string | null
  trigger: TriggerType
  trigger_config: Record<string, unknown>
  actions: WorkflowAction[]
  status: WorkflowStatus
  run_count: number
  last_run_at: string | null
  created_at: string
  updated_at: string
}

export type WorkflowAction = {
  id: string
  type: ActionType
  config: Record<string, unknown>
  order: number
}

export type ExecutionStatus = 'success' | 'failed' | 'running'

export type Execution = {
  id: string
  workflow_id: string
  status: ExecutionStatus
  duration_ms: number | null
  error_message: string | null
  logs: ExecutionLog[]
  created_at: string
}

export type ExecutionLog = {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

export type Integration = {
  id: string
  user_id: string
  provider: string
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ================================
// API TYPES
// ================================

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  per_page: number
}

// ================================
// PLAN LIMITS
// ================================

export const PLAN_LIMITS: Record<Plan, { workflows: number; executions_per_month: number; integrations: number }> = {
  free: { workflows: 3, executions_per_month: 100, integrations: 2 },
  pro: { workflows: 50, executions_per_month: 10000, integrations: 20 },
  team: { workflows: 999, executions_per_month: 100000, integrations: 999 },
}
