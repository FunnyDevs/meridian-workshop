<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on stock levels, demand forecast, and budget</p>
    </div>

    <!-- Controls -->
    <div class="controls-bar">
      <select v-model="selectedLocation" @change="loadData">
        <option value="all">All Warehouses</option>
        <option value="San Francisco">San Francisco</option>
        <option value="London">London</option>
        <option value="Tokyo">Tokyo</option>
      </select>
      <select v-model="selectedCategory" @change="loadData">
        <option value="all">All Categories</option>
        <option value="sensors">Sensors</option>
        <option value="actuators">Actuators</option>
        <option value="controllers">Controllers</option>
        <option value="circuit boards">Circuit Boards</option>
        <option value="power supplies">Power Supplies</option>
      </select>
      <div class="budget-input">
        <span class="budget-label">Budget ceiling</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="100"
          placeholder="No limit"
          @keydown.enter="applyBudget"
        />
        <button class="apply-btn" @click="applyBudget">Apply</button>
        <button v-if="budgetCeiling !== null" class="reset-btn" @click="clearBudget">Clear</button>
      </div>
    </div>

    <!-- Budget Summary -->
    <div v-if="!loading && !error" class="budget-card" :class="budgetStatus">
      <div class="budget-stat">
        <div class="budget-stat-label">Recommendations shown</div>
        <div class="budget-stat-value">{{ recommendations.length }}</div>
      </div>
      <div class="budget-stat">
        <div class="budget-stat-label">Total estimated cost</div>
        <div class="budget-stat-value">{{ formatCurrency(totalCost) }}</div>
      </div>
      <div v-if="budgetCeiling !== null" class="budget-stat">
        <div class="budget-stat-label">Budget ceiling</div>
        <div class="budget-stat-value">{{ formatCurrency(budgetCeiling) }}</div>
      </div>
      <div v-if="budgetCeiling !== null" class="budget-stat">
        <div class="budget-stat-label">Remaining budget</div>
        <div class="budget-stat-value">{{ formatCurrency(budgetCeiling - totalCost) }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="recommendations.length === 0" class="empty-state">
        <div class="empty-icon">✓</div>
        <div class="empty-title">No restocking needed</div>
        <div class="empty-desc">All items are above their reorder point for the selected filters.</div>
      </div>

      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">Purchase Order Recommendations</h3>
          <span class="item-count">{{ recommendations.length }} item{{ recommendations.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item</th>
                <th>Warehouse</th>
                <th>Stock / Reorder</th>
                <th>Demand Forecast</th>
                <th>Recommended Qty</th>
                <th>Est. Cost</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku + item.warehouse">
                <td><code class="sku">{{ item.sku }}</code></td>
                <td>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-category">{{ item.category }}</div>
                </td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <div class="stock-bar">
                    <span class="stock-current danger">{{ item.current_quantity }}</span>
                    <span class="stock-sep">/</span>
                    <span class="stock-reorder">{{ item.reorder_point }}</span>
                  </div>
                </td>
                <td>
                  <div class="forecast-cell">
                    <span v-if="item.forecasted_demand > 0">{{ item.forecasted_demand }} units</span>
                    <span v-else class="no-data">No data</span>
                    <span :class="getTrendClass(item.trend)" class="trend-badge">{{ item.trend }}</span>
                  </div>
                </td>
                <td><strong>{{ item.recommended_quantity }}</strong> units</td>
                <td><strong>{{ formatCurrency(item.estimated_cost) }}</strong></td>
                <td>
                  <div>
                    <span :class="getPriorityClass(item.priority)" class="priority-badge">{{ item.priority }}</span>
                    <div class="reason-text">{{ item.reason }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'

export default {
  name: 'Restocking',
  setup() {
    const { selectedLocation, selectedCategory } = useFilters()

    const recommendations = ref([])
    const loading = ref(true)
    const error = ref(null)
    const budgetInput = ref(null)
    const budgetCeiling = ref(null)

    const totalCost = computed(() => recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0))

    const budgetStatus = computed(() => {
      if (budgetCeiling.value === null) return 'neutral'
      return totalCost.value <= budgetCeiling.value ? 'within-budget' : 'over-budget'
    })

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: selectedLocation.value,
          category: selectedCategory.value,
          budgetCeiling: budgetCeiling.value
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      budgetCeiling.value = budgetInput.value || null
      loadData()
    }

    const clearBudget = () => {
      budgetInput.value = null
      budgetCeiling.value = null
      loadData()
    }

    const formatCurrency = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    const getTrendClass = (trend) => {
      if (trend === 'increasing') return 'trend-up'
      if (trend === 'decreasing') return 'trend-down'
      return 'trend-stable'
    }

    const getPriorityClass = (priority) => {
      if (priority === 'high') return 'priority-high'
      if (priority === 'low') return 'priority-low'
      return 'priority-medium'
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    return {
      selectedLocation, selectedCategory,
      recommendations, loading, error,
      budgetInput, budgetCeiling,
      totalCost, budgetStatus,
      loadData, applyBudget, clearBudget,
      formatCurrency, getTrendClass, getPriorityClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.controls-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  align-items: center;
  flex-wrap: wrap;
}

.controls-bar select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  cursor: pointer;
}

.budget-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.budget-label { font-size: 0.875rem; color: #64748b; white-space: nowrap; }

.budget-input input {
  width: 130px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
}

.apply-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.apply-btn:hover { background: #2563eb; }

.reset-btn {
  padding: 0.5rem 0.75rem;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Budget card */
.budget-card {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.budget-card.within-budget { border-left: 4px solid #16a34a; }
.budget-card.over-budget   { border-left: 4px solid #dc2626; }
.budget-card.neutral       { border-left: 4px solid #3b82f6; }

.budget-stat {
  flex: 1;
  padding: 1.25rem 1.5rem;
  border-right: 1px solid #f1f5f9;
}
.budget-stat:last-child { border-right: none; }
.budget-stat-label { font-size: 0.8rem; color: #64748b; margin-bottom: 0.35rem; }
.budget-stat-value { font-size: 1.4rem; font-weight: 700; color: #0f172a; }

/* Card */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title { font-size: 1.1rem; font-weight: 600; color: #0f172a; }
.item-count { font-size: 0.82rem; color: #64748b; }

/* Table */
.restocking-table { width: 100%; border-collapse: collapse; }

.restocking-table th {
  background: #f8fafc;
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
}

.restocking-table td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.restocking-table tr:last-child td { border-bottom: none; }
.restocking-table tr:hover td { background: #f8fafc; }

.sku { font-family: monospace; font-size: 0.8rem; background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 3px; }

.item-name { font-weight: 500; color: #0f172a; font-size: 0.875rem; }
.item-category { font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem; }

.stock-bar { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; }
.stock-current.danger { color: #dc2626; font-weight: 700; }
.stock-sep { color: #94a3b8; }
.stock-reorder { color: #64748b; }

.forecast-cell { display: flex; flex-direction: column; gap: 0.3rem; }
.no-data { font-size: 0.75rem; color: #94a3b8; }

.trend-badge {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  width: fit-content;
}
.trend-up     { background: #dcfce7; color: #166534; }
.trend-down   { background: #fee2e2; color: #991b1b; }
.trend-stable { background: #dbeafe; color: #1d4ed8; }

.priority-badge {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.priority-high   { background: #fee2e2; color: #991b1b; }
.priority-medium { background: #ffedd5; color: #9a3412; }
.priority-low    { background: #f1f5f9; color: #475569; }

.reason-text { font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.empty-title { font-size: 1.1rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
.empty-desc { color: #64748b; font-size: 0.875rem; }

.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; }
</style>
