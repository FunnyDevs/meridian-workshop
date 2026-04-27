<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ mode === 'view' ? 'Purchase Order' : 'Create Purchase Order' }}</h3>
            <button class="close-button" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Item</div>
                <div class="info-value">{{ backlogItem.item_name }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">SKU</div>
                <div class="info-value">{{ backlogItem.item_sku }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Warehouse</div>
                <div class="info-value">{{ backlogItem.warehouse }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Shortage</div>
                <div class="info-value">{{ backlogItem.shortage_amount }} units</div>
              </div>
            </div>

            <div v-if="mode !== 'view'" class="form-section">
              <label class="form-label">Quantity to Order</label>
              <input v-model.number="quantity" type="number" class="form-input" min="1" />
              <label class="form-label">Supplier</label>
              <input v-model="supplier" type="text" class="form-input" placeholder="Supplier name" />
              <label class="form-label">Estimated Cost (USD)</label>
              <input v-model.number="estimatedCost" type="number" class="form-input" min="0" step="0.01" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="$emit('close')">Cancel</button>
            <button v-if="mode !== 'view'" class="btn-primary" @click="submit">Create Order</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue'
import { api } from '../api'

export default {
  name: 'PurchaseOrderModal',
  props: {
    isOpen:     { type: Boolean, default: false },
    backlogItem:{ type: Object,  default: null  },
    mode:       { type: String,  default: 'create' }
  },
  emits: ['close', 'po-created'],
  setup(props, { emit }) {
    const quantity     = ref(0)
    const supplier     = ref('')
    const estimatedCost = ref(0)

    const submit = async () => {
      try {
        const po = await api.createPurchaseOrder({
          backlog_item_id: props.backlogItem.id,
          quantity: quantity.value,
          supplier: supplier.value,
          estimated_cost: estimatedCost.value
        })
        emit('po-created', po)
        emit('close')
      } catch (err) {
        console.error('Failed to create purchase order:', err)
      }
    }

    return { quantity, supplier, estimatedCost, submit }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}
.modal-title { font-size: 1.1rem; font-weight: 600; color: #0f172a; margin: 0; }
.close-button { background: none; border: none; color: #64748b; cursor: pointer; padding: 0.25rem; }
.modal-body { padding: 1.5rem; }
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.info-label { font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; }
.info-value { font-weight: 600; color: #0f172a; }
.form-section { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}
.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: white;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
