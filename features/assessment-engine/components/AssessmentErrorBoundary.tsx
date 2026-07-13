'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AssessmentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Assessment Engine uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="w-full max-w-xl mx-auto p-6 md:p-10 my-12 bg-bg-surface border border-border/10 rounded-[2.5rem] shadow-lg paper-texture text-center space-y-6">
          <div className="w-16 h-16 bg-error/10 border border-error/20 rounded-full flex items-center justify-center text-error mx-auto shadow-inner">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-text-primary">Terjadi Kesalahan Kuis</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
              Sistem mendeteksi adanya gangguan saat memproses kuis ini. Silakan coba atur ulang komponen kuis atau hubungi bantuan.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-3 bg-bg-bone/80 border border-border/10 rounded-xl text-[10px] text-error font-mono overflow-x-auto text-left max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-xl font-bold text-xs shadow-md shadow-glow mx-auto active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Ulangi Kuis
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
