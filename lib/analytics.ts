/**
 * Analytics utilities for tracking user interactions
 * Uses Vercel Analytics for page views and custom events
 */

import { track } from '@vercel/analytics'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

/**
 * Track a custom analytics event
 */
export function trackEvent(event: AnalyticsEvent) {
  try {
    track(event.name, event.properties)
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

/**
 * Track admin login
 */
export function trackAdminLogin(success: boolean) {
  trackEvent({
    name: 'admin_login',
    properties: {
      success,
      timestamp: Date.now(),
    },
  })
}
