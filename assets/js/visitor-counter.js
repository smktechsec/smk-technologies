/**
 * SMK TECHNOLOGIES - LIVE VISITOR STATISTICS ENGINE
 * 
 * GitHub Pages Compatible | Vanilla JavaScript | Zero Build Dependencies
 * 
 * Supported Modes:
 *  - 'countapi' : Default zero-setup public tracking engine (No API keys or server required)
 *  - 'firebase' : Optional Firebase Realtime Database for synchronized cross-device presence & counters
 * 
 * Target Timezone:
 *  - Pakistan Standard Time (PKT, UTC+5 / 'Asia/Karachi')
 */

(function () {
  'use strict';

  // Retrieve configuration loaded from visitor-counter-config.js
  const config = window.VISITOR_COUNTER_CONFIG || {
    mode: 'countapi',
    countApi: {
      enabled: true,
      baseUrl: 'https://countapi.mileshilliard.com/api/v1',
      keys: {
        totalVisitors: 'smktech_sec_prod_total_visitors_v1',
        dailyVisitorsPrefix: 'smktech_sec_prod_daily_v1_',
        catalogPageViews: 'smktech_sec_prod_catalog_views_v1'
      }
    },
    firebase: {
      enabled: false,
      config: {}
    },
    settings: {
      timezone: 'Asia/Karachi',
      onlineWindowSeconds: 10,
      heartbeatIntervalSeconds: 5,
      activityTimeoutSeconds: 10,
      storageKey: 'visitor_uuid',
      updateIntervalSeconds: 5
    }
  };

  /* ==========================================================================
     STATE MANAGEMENT & CONSTANTS
     ========================================================================== */
  const TAB_ID = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const STORAGE_PREFIX = 'smk_vstats_';
  const ACTIVE_TABS_KEY = STORAGE_PREFIX + 'active_tabs';
  const TOTAL_RECORDED_KEY = STORAGE_PREFIX + 'total_counted';
  const DAILY_RECORDED_KEY = STORAGE_PREFIX + 'last_pkt_date';
  const CATALOG_RECORDED_KEY = STORAGE_PREFIX + 'catalog_viewed_session';

  // Live state cache
  let statsState = {
    totalVisitors: null,
    todayVisitors: null,
    onlineVisitors: 1,
    pageViews: null,
    status: 'connecting', // 'connecting', 'live', 'offline', 'error'
    statusMessage: 'Connecting...'
  };

  let lastUserActivityTime = Date.now();
  let heartbeatTimer = null;
  let pollTimer = null;
  let broadcastChannel = null;
  let isCatalogVisitPending = false;
  let isDestroyed = false;

  /* ==========================================================================
     1. UNIQUE VISITOR IDENTIFICATION (UUID)
     ========================================================================== */
  /**
   * Generates or retrieves an anonymous, persistent browser UUID.
   * Uses crypto.randomUUID() when available, with an RFC4122 v4 fallback.
   * Handles private browsing and disabled localStorage safely.
   */
  function getOrCreateVisitorUuid() {
    const storageKey = config.settings.storageKey || 'visitor_uuid';
    try {
      let uuid = localStorage.getItem(storageKey);
      if (!uuid) {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          uuid = crypto.randomUUID();
        } else {
          uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (typeof crypto !== 'undefined' && crypto.getRandomValues)
              ? (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
              : Math.floor(Math.random() * 16);
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        localStorage.setItem(storageKey, uuid);
      }
      return uuid;
    } catch (err) {
      // Storage unavailable / blocked (private mode): fallback to window session memory
      if (!window.__smk_fallback_uuid) {
        window.__smk_fallback_uuid = 'temp_' + Math.random().toString(36).substring(2, 11);
      }
      return window.__smk_fallback_uuid;
    }
  }

  const VISITOR_UUID = getOrCreateVisitorUuid();

  /* ==========================================================================
     2. TIMEZONE CALCULATOR (PAKISTAN STANDARD TIME - PKT / UTC+5)
     ========================================================================== */
  /**
   * Generates a date string in YYYY-MM-DD format strictly for Asia/Karachi (PKT, UTC+5).
   * Does not rely on visitor's local system timezone.
   */
  function getPakistanDateKey(dateObj = new Date()) {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: config.settings.timezone || 'Asia/Karachi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(dateObj); // Returns "YYYY-MM-DD"
    } catch (e) {
      // Safe fallback: PKT is strictly UTC+5 year-round (no DST)
      const pktOffsetMs = 5 * 60 * 60 * 1000;
      const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60 * 1000);
      const pktDate = new Date(utcTime + pktOffsetMs);
      const y = pktDate.getFullYear();
      const m = String(pktDate.getMonth() + 1).padStart(2, '0');
      const d = String(pktDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  /* ==========================================================================
     3. LOCAL PRESENCE & MULTI-TAB SYNCHRONIZATION
     ========================================================================== */
  /**
   * Manages local tab heartbeats and prunes tabs inactive for > 10 seconds.
   * Deduplicates by visitor_uuid so multiple open tabs do not inflate unique online counts.
   */
  function updateLocalPresenceHeartbeat() {
    if (isDestroyed) return;
    const now = Date.now();
    const isTabActive = document.visibilityState === 'visible' && (now - lastUserActivityTime < (config.settings.activityTimeoutSeconds * 1000));

    try {
      let tabsMap = {};
      const raw = localStorage.getItem(ACTIVE_TABS_KEY);
      if (raw) {
        try { tabsMap = JSON.parse(raw); } catch (e) { tabsMap = {}; }
      }

      if (isTabActive) {
        tabsMap[TAB_ID] = {
          uuid: VISITOR_UUID,
          lastSeen: now
        };
      } else {
        // Tab inactive or backgrounded
        delete tabsMap[TAB_ID];
      }

      // Prune stale records (> onlineWindowSeconds, default 10 seconds)
      const cutoff = now - (config.settings.onlineWindowSeconds * 1000);
      const uniqueUuids = new Set();

      for (const [id, data] of Object.entries(tabsMap)) {
        if (!data || !data.lastSeen || data.lastSeen < cutoff) {
          delete tabsMap[id];
        } else if (data.uuid) {
          uniqueUuids.add(data.uuid);
        }
      }

      localStorage.setItem(ACTIVE_TABS_KEY, JSON.stringify(tabsMap));

      // In CountAPI mode, online count represents verified active visitor sessions on this device
      if (config.mode === 'countapi') {
        const count = isTabActive ? Math.max(1, uniqueUuids.size) : 0;
        statsState.onlineVisitors = count;
        renderOnlineCount(count);
      }
    } catch (e) {
      // Storage access blocked or quota exceeded
      if (config.mode === 'countapi') {
        statsState.onlineVisitors = (document.visibilityState === 'visible') ? 1 : 0;
        renderOnlineCount(statsState.onlineVisitors);
      }
    }
  }

  /**
   * Cleanup tab from presence registry on close/unload
   */
  function cleanupTabPresence() {
    try {
      const raw = localStorage.getItem(ACTIVE_TABS_KEY);
      if (raw) {
        const tabsMap = JSON.parse(raw);
        delete tabsMap[TAB_ID];
        localStorage.setItem(ACTIVE_TABS_KEY, JSON.stringify(tabsMap));
      }
    } catch (e) {}
  }

  // User activity listeners to renew presence
  function registerActivityListeners() {
    let activityThrottled = false;
    const onActivity = function () {
      lastUserActivityTime = Date.now();
      if (!activityThrottled) {
        activityThrottled = true;
        updateLocalPresenceHeartbeat();
        setTimeout(function () {
          activityThrottled = false;
        }, 2000);
      }
    };

    ['pointermove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, onActivity, { passive: true });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        lastUserActivityTime = Date.now();
        updateLocalPresenceHeartbeat();
      } else {
        cleanupTabPresence();
        if (config.mode === 'countapi') {
          renderOnlineCount(0);
        }
      }
    });

    window.addEventListener('pagehide', cleanupTabPresence);
    window.addEventListener('beforeunload', cleanupTabPresence);

    // BroadcastChannel sync across tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannel = new BroadcastChannel('smk_visitor_sync');
        broadcastChannel.onmessage = function (ev) {
          if (ev.data && ev.data.type === 'stats_update') {
            if (ev.data.totalVisitors !== undefined) statsState.totalVisitors = ev.data.totalVisitors;
            if (ev.data.todayVisitors !== undefined) statsState.todayVisitors = ev.data.todayVisitors;
            if (ev.data.pageViews !== undefined) statsState.pageViews = ev.data.pageViews;
            renderAllStats();
          }
        };
      } catch (e) {}
    }
  }

  /* ==========================================================================
     4. COUNTAPI TRACKING ENGINE (DEFAULT ZERO-SETUP)
     ========================================================================== */
  const CountApiEngine = {
    baseUrl: function () {
      return (config.countApi && config.countApi.baseUrl) || 'https://countapi.mileshilliard.com/api/v1';
    },

    /**
     * Hit (increment) a key on CountAPI
     */
    hit: async function (key) {
      const url = `${this.baseUrl()}/hit/${encodeURIComponent(key)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (!resp.ok) {
        throw new Error(`CountAPI hit failed: HTTP ${resp.status}`);
      }
      const data = await resp.json();
      return typeof data.value === 'number' ? data.value : 0;
    },

    /**
     * Get (read-only) a key from CountAPI without incrementing
     */
    get: async function (key) {
      const url = `${this.baseUrl()}/get/${encodeURIComponent(key)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (resp.status === 404) {
        // Key not yet created
        return 0;
      }
      if (!resp.ok) {
        throw new Error(`CountAPI get failed: HTTP ${resp.status}`);
      }
      const data = await resp.json();
      return typeof data.value === 'number' ? data.value : 0;
    },

    /**
     * Verify CountAPI service health
     */
    checkStatus: async function () {
      try {
        const url = `${this.baseUrl()}/status`;
        const resp = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (resp.ok) {
          const data = await resp.json();
          return data.status === 'operational' || resp.status === 200;
        }
      } catch (e) {}
      return false;
    },

    /**
     * Main run loop for CountAPI
     */
    init: async function () {
      const keys = config.countApi.keys;
      const todayPktDate = getPakistanDateKey();
      const dailyKey = keys.dailyVisitorsPrefix + todayPktDate;

      try {
        updateSyncStatus('connecting', 'Synchronizing with CountAPI...');

        // 1. Process Total Visitors (deduplicated by UUID in localStorage)
        let totalVal;
        const totalAlreadyCounted = localStorage.getItem(TOTAL_RECORDED_KEY);
        if (totalAlreadyCounted === 'true') {
          // Returning visitor: read-only, DO NOT increment
          totalVal = await this.get(keys.totalVisitors);
        } else {
          // First-time unique visitor: increment
          try {
            totalVal = await this.hit(keys.totalVisitors);
            localStorage.setItem(TOTAL_RECORDED_KEY, 'true');
          } catch (hitErr) {
            totalVal = await this.get(keys.totalVisitors);
          }
        }
        statsState.totalVisitors = totalVal;

        // 2. Process Today's Visitors in Pakistan Standard Time (PKT)
        let todayVal;
        const lastPktDate = localStorage.getItem(DAILY_RECORDED_KEY);
        if (lastPktDate === todayPktDate) {
          // Already counted for this Pakistan calendar day: read-only
          todayVal = await this.get(dailyKey);
        } else {
          // New day or first daily visit: increment daily counter
          try {
            todayVal = await this.hit(dailyKey);
            localStorage.setItem(DAILY_RECORDED_KEY, todayPktDate);
          } catch (hitErr) {
            todayVal = await this.get(dailyKey);
          }
        }
        statsState.todayVisitors = todayVal;

        // 3. Process Total Page Views for Catalog
        let catalogVal;
        if (isCatalogVisitPending && !sessionStorage.getItem(CATALOG_RECORDED_KEY)) {
          try {
            catalogVal = await this.hit(keys.catalogPageViews);
            sessionStorage.setItem(CATALOG_RECORDED_KEY, 'true');
            isCatalogVisitPending = false;
          } catch (hitErr) {
            catalogVal = await this.get(keys.catalogPageViews);
          }
        } else {
          catalogVal = await this.get(keys.catalogPageViews);
        }
        statsState.pageViews = catalogVal;

        // Broadcast to other open tabs
        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage({
              type: 'stats_update',
              totalVisitors: statsState.totalVisitors,
              todayVisitors: statsState.todayVisitors,
              pageViews: statsState.pageViews
            });
          } catch (e) {}
        }

        updateSyncStatus('live', 'CountAPI Active');
        renderAllStats();

      } catch (err) {
        console.warn('[VisitorCounter] CountAPI communication issue:', err.message);
        updateSyncStatus('offline', 'Service Offline (CountAPI)');
        renderUnavailableState();
      }
    },

    /**
     * Periodic refresh for CountAPI (read-only polling)
     */
    refresh: async function () {
      const keys = config.countApi.keys;
      const todayPktDate = getPakistanDateKey();
      const dailyKey = keys.dailyVisitorsPrefix + todayPktDate;

      try {
        // If a catalog visit occurred since last poll, increment it now
        if (isCatalogVisitPending && !sessionStorage.getItem(CATALOG_RECORDED_KEY)) {
          statsState.pageViews = await this.hit(keys.catalogPageViews);
          sessionStorage.setItem(CATALOG_RECORDED_KEY, 'true');
          isCatalogVisitPending = false;
        } else {
          statsState.pageViews = await this.get(keys.catalogPageViews);
        }

        statsState.totalVisitors = await this.get(keys.totalVisitors);
        statsState.todayVisitors = await this.get(dailyKey);

        updateSyncStatus('live', 'CountAPI Active');
        renderAllStats();
      } catch (e) {
        // On transient error, maintain current values rather than flickering
        updateSyncStatus('offline', 'Service Temporarily Unavailable');
      }
    }
  };

  /* ==========================================================================
     5. FIREBASE REALTIME DATABASE ENGINE (GENUINE CROSS-DEVICE PRESENCE)
     ========================================================================== */
  const FirebaseEngine = {
    db: null,
    presenceRef: null,
    connectedRef: null,

    /**
     * Dynamically loads Firebase SDK if not already available in DOM
     */
    loadSdk: function () {
      return new Promise(function (resolve, reject) {
        if (window.firebase && window.firebase.database) {
          return resolve();
        }

        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        appScript.onload = function () {
          const dbScript = document.createElement('script');
          dbScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';
          dbScript.onload = resolve;
          dbScript.onerror = reject;
          document.head.appendChild(dbScript);
        };
        appScript.onerror = reject;
        document.head.appendChild(appScript);
      });
    },

    init: async function () {
      try {
        updateSyncStatus('connecting', 'Connecting to Firebase Realtime Database...');
        await this.loadSdk();

        const fbConfig = config.firebase.config;
        if (!fbConfig || !fbConfig.databaseURL) {
          throw new Error('Firebase configuration missing or databaseURL is empty');
        }

        // Initialize Firebase app if not already initialized
        let app;
        try {
          app = window.firebase.app();
        } catch (e) {
          app = window.firebase.initializeApp(fbConfig);
        }

        this.db = window.firebase.database(app);
        const paths = config.firebase.paths || {
          counters: 'smk_visitor_system/counters',
          daily: 'smk_visitor_system/daily_visitors',
          presence: 'smk_visitor_system/online_presence',
          uniqueVisitors: 'smk_visitor_system/unique_visitors'
        };

        const todayPktDate = getPakistanDateKey();

        // 1. Process Total Unique Visitors
        const uniqueVisitorRef = this.db.ref(`${paths.uniqueVisitors}/${VISITOR_UUID}`);
        const totalCounterRef = this.db.ref(`${paths.counters}/total_visitors`);

        uniqueVisitorRef.transaction(function (currentVal) {
          if (currentVal === null) {
            // First time this UUID is seen in database
            return {
              registeredAt: window.firebase.database.ServerValue.TIMESTAMP,
              initialPktDate: todayPktDate
            };
          }
          return; // Abort transaction without modifying
        }, function (error, committed) {
          if (!error && committed) {
            // Atomically increment total visitors counter
            totalCounterRef.transaction(function (val) {
              return (val || 0) + 1;
            });
          }
        });

        // 2. Process Today's Unique Visitors in PKT
        const dailyVisitorRef = this.db.ref(`${paths.daily}/${todayPktDate}/visitors/${VISITOR_UUID}`);
        const dailyCounterRef = this.db.ref(`${paths.daily}/${todayPktDate}/count`);

        dailyVisitorRef.transaction(function (currentVal) {
          if (currentVal === null) {
            return { visitedAt: window.firebase.database.ServerValue.TIMESTAMP };
          }
          return;
        }, function (error, committed) {
          if (!error && committed) {
            dailyCounterRef.transaction(function (val) {
              return (val || 0) + 1;
            });
          }
        });

        // 3. Process Wholesale Catalog Page Views
        const catalogCounterRef = this.db.ref(`${paths.counters}/catalog_page_views`);
        if (isCatalogVisitPending && !sessionStorage.getItem(CATALOG_RECORDED_KEY)) {
          catalogCounterRef.transaction(function (val) {
            return (val || 0) + 1;
          });
          sessionStorage.setItem(CATALOG_RECORDED_KEY, 'true');
          isCatalogVisitPending = false;
        }

        // 4. Live Presence & Disconnect Cleanup
        const presenceListRef = this.db.ref(paths.presence);
        this.presenceRef = this.db.ref(`${paths.presence}/${TAB_ID}`);
        this.connectedRef = this.db.ref('.info/connected');

        const self = this;
        this.connectedRef.on('value', function (snap) {
          if (snap.val() === true) {
            // Clean up upon unexpected disconnect or tab closure
            self.presenceRef.onDisconnect().remove();

            // Set current presence
            self.presenceRef.set({
              uuid: VISITOR_UUID,
              last_active: window.firebase.database.ServerValue.TIMESTAMP
            });

            updateSyncStatus('live', 'Firebase Live Connected');
          } else {
            updateSyncStatus('connecting', 'Reconnecting to Firebase...');
          }
        });

        // Listen for live presence changes and calculate active visitors within 10 seconds
        presenceListRef.on('value', function (snap) {
          const val = snap.val();
          if (!val) {
            statsState.onlineVisitors = 1;
            renderOnlineCount(1);
            return;
          }

          const now = Date.now();
          const activeWindowMs = config.settings.onlineWindowSeconds * 1000;
          const activeUuids = new Set();

          for (const [key, session] of Object.entries(val)) {
            if (session && session.last_active) {
              if (Math.abs(now - session.last_active) <= activeWindowMs) {
                if (session.uuid) activeUuids.add(session.uuid);
              }
            }
          }

          const onlineCount = Math.max(1, activeUuids.size);
          statsState.onlineVisitors = onlineCount;
          renderOnlineCount(onlineCount);
        });

        // 5. Real-time counter listeners
        totalCounterRef.on('value', function (snap) {
          statsState.totalVisitors = snap.val() || 0;
          renderStatElement('val-total-visitors', statsState.totalVisitors);
        });

        dailyCounterRef.on('value', function (snap) {
          statsState.todayVisitors = snap.val() || 0;
          renderStatElement('val-today-visitors', statsState.todayVisitors);
        });

        catalogCounterRef.on('value', function (snap) {
          statsState.pageViews = snap.val() || 0;
          renderStatElement('val-page-views', statsState.pageViews);
        });

      } catch (err) {
        console.error('[VisitorCounter] Firebase Engine initialization error:', err);
        updateSyncStatus('error', 'Firebase Config Required');
        renderUnavailableState();
      }
    },

    /**
     * Firebase heartbeat updates
     */
    refresh: function () {
      if (this.presenceRef && window.firebase && document.visibilityState === 'visible') {
        this.presenceRef.update({
          last_active: window.firebase.database.ServerValue.TIMESTAMP
        });
      }
    }
  };

  /* ==========================================================================
     6. WHOLESALE CATALOG VISIT DETECTOR
     ========================================================================== */
  /**
   * Tracks visits specifically targeting the wholesale catalog (#ax-hybrid-pro / .product-catalog-grid).
   * Avoids duplicate counting on repeated heartbeats or unrelated clicks.
   */
  function registerCatalogVisitTracker() {
    function markCatalogVisited() {
      if (sessionStorage.getItem(CATALOG_RECORDED_KEY)) {
        return; // Already counted this browser session
      }
      isCatalogVisitPending = true;

      if (config.mode === 'countapi') {
        CountApiEngine.hit(config.countApi.keys.catalogPageViews).then(function (val) {
          statsState.pageViews = val;
          sessionStorage.setItem(CATALOG_RECORDED_KEY, 'true');
          isCatalogVisitPending = false;
          renderStatElement('val-page-views', val);
        }).catch(function () {});
      } else if (config.mode === 'firebase' && FirebaseEngine.db) {
        const paths = config.firebase.paths;
        FirebaseEngine.db.ref(`${paths.counters}/catalog_page_views`).transaction(function (v) {
          return (v || 0) + 1;
        });
        sessionStorage.setItem(CATALOG_RECORDED_KEY, 'true');
        isCatalogVisitPending = false;
      }
    }

    // Check if initial URL lands directly on #ax-hybrid-pro
    if (window.location.hash === '#ax-hybrid-pro') {
      markCatalogVisited();
    }

    // Hash navigation changes
    window.addEventListener('hashchange', function () {
      if (window.location.hash === '#ax-hybrid-pro') {
        markCatalogVisited();
      }
    });

    // Clicks on catalog navigation links
    document.querySelectorAll('a[href="#ax-hybrid-pro"]').forEach(function (link) {
      link.addEventListener('click', function () {
        markCatalogVisited();
      });
    });

    // Product spec modal clicks (specifications modal is part of the catalog experience)
    document.querySelectorAll('[data-spec-product]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        markCatalogVisited();
      });
    });

    // IntersectionObserver detection when catalog is scrolled into viewport
    if ('IntersectionObserver' in window) {
      const catalogEl = document.getElementById('ax-hybrid-pro') || document.querySelector('.product-catalog-grid');
      if (catalogEl) {
        const observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              markCatalogVisited();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25 });
        observer.observe(catalogEl);
      }
    }
  }

  /* ==========================================================================
     7. DOM RENDERING & UI UPDATES
     ========================================================================== */
  function formatNumber(num) {
    if (num === null || num === undefined) return '--';
    if (typeof num !== 'number') return String(num);
    return new Intl.NumberFormat('en-US').format(num);
  }

  function renderStatElement(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = formatNumber(value);
    el.classList.remove('stat-loading');
  }

  function renderOnlineCount(count) {
    const el = document.getElementById('val-online-visitors');
    if (!el) return;
    el.textContent = formatNumber(count);
    el.classList.remove('stat-loading');
  }

  function renderAllStats() {
    renderStatElement('val-total-visitors', statsState.totalVisitors);
    renderStatElement('val-today-visitors', statsState.todayVisitors);
    renderOnlineCount(statsState.onlineVisitors);
    renderStatElement('val-page-views', statsState.pageViews);
  }

  function renderUnavailableState() {
    ['val-total-visitors', 'val-today-visitors', 'val-page-views'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el && (el.textContent === '--' || el.classList.contains('stat-loading'))) {
        el.textContent = 'Unavailable';
        el.classList.add('stat-unavailable');
      }
    });
  }

  function updateSyncStatus(status, text) {
    statsState.status = status;
    statsState.statusMessage = text;

    const statusEl = document.getElementById('visitor-stats-sync-status');
    if (statusEl) {
      statusEl.className = 'footer-stats-sync sync-' + status;
      statusEl.innerHTML = `<span class="sync-dot"></span><span>${text}</span>`;
    }

    const footnoteEl = document.getElementById('visitor-stats-footnote');
    if (footnoteEl) {
      if (config.mode === 'countapi') {
        footnoteEl.innerHTML = `Zero-setup live counter powered by CountAPI &amp; browser local storage. Synchronized in Pakistan Standard Time (PKT). <span class="footnote-note">Cross-device presence available via optional Firebase mode.</span>`;
      } else {
        footnoteEl.innerHTML = `Real-time synchronized across all devices via Firebase Realtime Database. Synchronized in Pakistan Standard Time (PKT).`;
      }
    }
  }

  /* ==========================================================================
     8. SYSTEM LIFECYCLE & INITIALIZATION
     ========================================================================== */
  function initVisitorCounter() {
    registerActivityListeners();
    registerCatalogVisitTracker();
    updateLocalPresenceHeartbeat();

    // Route to selected tracking engine
    if (config.mode === 'firebase' && config.firebase && config.firebase.enabled) {
      FirebaseEngine.init();
      heartbeatTimer = setInterval(function () {
        FirebaseEngine.refresh();
      }, (config.settings.heartbeatIntervalSeconds || 5) * 1000);
    } else {
      // Default CountAPI Zero-Setup Engine
      CountApiEngine.init();
      pollTimer = setInterval(function () {
        CountApiEngine.refresh();
      }, (config.settings.updateIntervalSeconds || 5) * 1000);

      heartbeatTimer = setInterval(function () {
        updateLocalPresenceHeartbeat();
      }, (config.settings.heartbeatIntervalSeconds || 5) * 1000);
    }
  }

  // Ensure DOM is ready before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorCounter);
  } else {
    initVisitorCounter();
  }

  // Expose inspection object for testing and verification
  window.SmkVisitorCounter = {
    getUuid: function () { return VISITOR_UUID; },
    getState: function () { return Object.assign({}, statsState); },
    getPktDate: function () { return getPakistanDateKey(); },
    getConfig: function () { return config; }
  };

})();
