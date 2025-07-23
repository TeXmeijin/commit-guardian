import type { Comment, GitDiffData } from './git'

export interface ApproveRequest {
  message: string
  fileComments: Comment[]
}

export interface RejectRequest {
  rejectReason: string
  fileComments: Comment[]
}

export interface ApproveResponse {
  success: boolean
  error?: string
  autoClose?: boolean
}

export interface RejectResponse {
  success: boolean
  error?: string
}

export interface DiffResponse extends GitDiffData {
  defaultMessage?: string
}

export interface ApiError {
  error: string
  message: string
}