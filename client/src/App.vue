<template>
  <div class="app">
    <header class="top-nav">
      <div class="nav-container">
        <div class="logo">
          <h1>{{ t('nav.companyName') }}</h1>
          <span class="subtitle">{{ t('nav.subtitle') }}</span>
        </div>
        <nav class="nav-tabs">
          <router-link to="/" :class="{ active: $route.path === '/' }">
            {{ t('nav.overview') }}
          </router-link>
          <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }">
            {{ t('nav.inventory') }}
          </router-link>
          <router-link to="/orders" :class="{ active: $route.path === '/orders' }">
            {{ t('nav.orders') }}
          </router-link>
          <router-link to="/spending" :class="{ active: $route.path === '/spending' }">
            {{ t('nav.finance') }}
          </router-link>
          <router-link to="/demand" :class="{ active: $route.path === '/demand' }">
            {{ t('nav.demandForecast') }}
          </router-link>
          <router-link to="/reports" :class="{ active: $route.path === '/reports' }">
            Reports
          </router-link>
          <router-link to="/restocking" :class="{ active: $route.path === '/restocking' }">
            {{ t('nav.restocking') }}
          </router-link>
        </nav>
        <LanguageSwitcher />
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </header>
    <FilterBar />
    <main class="main-content">
      <router-view />
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    const isDark = ref(localStorage.getItem('theme') === 'dark')
    const applyTheme = (dark) => {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
    const toggleTheme = () => {
      isDark.value = !isDark.value
      applyTheme(isDark.value)
    }
    applyTheme(isDark.value)

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      isDark,
      toggleTheme
    }
  }
}
</script>

<style>
/* ── Tokens ─────────────────────────────────────────────── */

:root {
  --bg-page:    #fafafa;
  --bg-surface: #ffffff;
  --bg-subtle:  #f4f4f5;
  --border:     #e5e5e5;
  --text-1:     #18181b;
  --text-2:     #71717a;
  --text-3:     #a1a1aa;
  --accent:     #2563eb;
  --accent-bg:  #eff6ff;
  --shadow:     0 1px 2px rgba(0,0,0,0.04);
}

[data-theme="dark"] {
  --bg-page:    #09090b;
  --bg-surface: #18181b;
  --bg-subtle:  #27272a;
  --border:     #3f3f46;
  --text-1:     #fafafa;
  --text-2:     #a1a1aa;
  --text-3:     #71717a;
  --accent:     #60a5fa;
  --accent-bg:  #1e3a5f;
  --shadow:     0 1px 2px rgba(0,0,0,0.3);
}

/* ── Reset ──────────────────────────────────────────────── */

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-page);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  transition: background 0.2s ease, color 0.2s ease;
}

.app { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Nav ────────────────────────────────────────────────── */

.top-nav {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 64px;
  gap: 0;
}

.nav-container > .nav-tabs  { margin-left: auto; margin-right: 1rem; }
.nav-container > .language-switcher { margin-right: 0.75rem; }
.nav-container > .theme-toggle { margin-right: 0.75rem; }

.logo { display: flex; align-items: baseline; gap: 0.75rem; }

.logo h1 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-1);
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.8125rem;
  color: var(--text-3);
  font-weight: 400;
}

.nav-tabs { display: flex; gap: 0.125rem; align-items: center; height: 64px; }

.nav-tabs a {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 1rem;
  color: var(--text-2);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8125rem;
  position: relative;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.nav-tabs a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: transparent;
  transition: background 0.15s ease;
}

.nav-tabs a:hover { color: var(--text-1); }
.nav-tabs a.active { color: var(--accent); font-weight: 600; }
.nav-tabs a.active::after { background: var(--accent); }

/* ── Theme toggle ───────────────────────────────────────── */

.theme-toggle {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;
}

.theme-toggle:hover { background: var(--bg-subtle); }

/* ── Layout ─────────────────────────────────────────────── */

.main-content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem 2.5rem;
}

.page-header { margin-bottom: 2rem; }

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p { color: var(--text-2); font-size: 0.9375rem; }

/* ── Stat cards ─────────────────────────────────────────── */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: border-color 0.15s ease;
}

.stat-card:hover { border-color: var(--text-3); }

.stat-label {
  color: var(--text-2);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-card.warning .stat-value { color: #f97316; }
.stat-card.success .stat-value { color: #22c55e; }
.stat-card.danger  .stat-value { color: #ef4444; }
.stat-card.info    .stat-value { color: var(--accent); }

/* ── Cards ──────────────────────────────────────────────── */

.card {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -1.5rem -1.5rem 1.25rem;
  padding: 1rem 1.5rem;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-1);
}

.table-container { overflow-x: auto; margin: 0 -1.5rem -1.5rem; }

/* ── Tables ─────────────────────────────────────────────── */

table { width: 100%; border-collapse: collapse; }

thead { background: var(--bg-subtle); border-bottom: 1px solid var(--border); }

th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-2);
  font-size: 0.75rem;
}

td {
  padding: 0.6875rem 1rem;
  border-top: 1px solid var(--bg-subtle);
  color: var(--text-1);
  font-size: 0.875rem;
}

tbody tr { transition: background-color 0.12s ease; }
tbody tr:hover { background: var(--bg-subtle); }

/* ── Badges ─────────────────────────────────────────────── */

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.badge.success    { background: rgba(34,197,94,0.15);  color: #22c55e; }
.badge.warning    { background: rgba(249,115,22,0.15); color: #f97316; }
.badge.danger     { background: rgba(239,68,68,0.15);  color: #ef4444; }
.badge.info       { background: var(--accent-bg);      color: var(--accent); }
.badge.increasing { background: rgba(34,197,94,0.15);  color: #22c55e; }
.badge.decreasing { background: rgba(239,68,68,0.15);  color: #ef4444; }
.badge.stable     { background: rgba(99,102,241,0.15); color: #818cf8; }
.badge.high       { background: rgba(239,68,68,0.15);  color: #ef4444; }
.badge.medium     { background: rgba(249,115,22,0.15); color: #f97316; }
.badge.low        { background: var(--accent-bg);      color: var(--accent); }

/* ── Utility ─────────────────────────────────────────────── */

.loading { text-align: center; padding: 4rem; color: var(--text-2); }

.error {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
