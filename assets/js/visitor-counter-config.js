/**
 * SMK TECHNOLOGIES - LIVE VISITOR STATISTICS CONFIGURATION
 * 
 * Centralized settings for the Live Visitor Statistics System.
 * Supports:
 *  1. 'countapi' : Default zero-setup public counter (No API key, no backend required).
 *  2. 'firebase' : Optional Firebase Realtime Database for synchronized cross-device presence & counters.
 * 
 * Target Timezone: Pakistan Standard Time (PKT, UTC+5 / 'Asia/Karachi')
 */

(function (root) {
  'use strict';

  const VISITOR_COUNTER_CONFIG = {
    // Active tracking engine: 'countapi' (default zero-setup) or 'firebase'
    mode: 'countapi',

    // CountAPI Configuration (Zero-Setup Tracking)
    countApi: {
      enabled: true,
      baseUrl: 'https://countapi.mileshilliard.com/api/v1',
      // High-entropy unique key identifiers to prevent collisions on public CountAPI instance
      keys: {
        totalVisitors: 'smktech_sec_prod_total_visitors_v1',
        dailyVisitorsPrefix: 'smktech_sec_prod_daily_v1_', // Appends YYYY-MM-DD (PKT)
        catalogPageViews: 'smktech_sec_prod_catalog_views_v1'
      }
    },

    // Optional Firebase Realtime Database Configuration
    // To enable: set mode: 'firebase', firebase.enabled: true, and supply your Firebase project config below.
    firebase: {
      enabled: false,
      config: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      },
      paths: {
        counters: 'smk_visitor_system/counters',
        daily: 'smk_visitor_system/daily_visitors',
        presence: 'smk_visitor_system/online_presence',
        uniqueVisitors: 'smk_visitor_system/unique_visitors'
      }
    },

    // Common Tracking & Presence Settings
    settings: {
      // Calendar day boundary based on Pakistan Standard Time (PKT, UTC+5)
      timezone: 'Asia/Karachi',

      // Online presence window: visitor considered online if active within past 10 seconds
      onlineWindowSeconds: 10,

      // Periodic heartbeat interval while browser tab is active
      heartbeatIntervalSeconds: 5,

      // User inactivity timeout (marks presence idle after inactivity)
      activityTimeoutSeconds: 10,

      // LocalStorage key for anonymous, persistent browser UUID
      storageKey: 'visitor_uuid',

      // Periodic UI refresh interval for statistics
      updateIntervalSeconds: 5
    }
  };

  // Expose configuration globally
  root.VISITOR_COUNTER_CONFIG = VISITOR_COUNTER_CONFIG;

})(typeof window !== 'undefined' ? window : this);
