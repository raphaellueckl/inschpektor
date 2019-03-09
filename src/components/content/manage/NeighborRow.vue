<template>
  <div class="columns">
    <div class="column is-4">
      <strong class="mobile-only">IP-Address:</strong>
      {{ neighbor.address }}
    </div>
    <div class="column is-one-fifth">
      <strong class="mobile-only">Nickname:</strong>
      <input
        v-model="neighbor.name"
        placeholder="Enter nickname..."
        class="input"
        type="text"
        @input="setNeighborName(neighbor)"
      >
    </div>
    <div class="column is-2">
      <strong class="mobile-only">Node Port:</strong>
      <input
        v-model="neighbor.port"
        placeholder="Enter port..."
        class="input"
        type="text"
        @input="setNeighborPort(neighbor)"
      >
    </div>
    <div class="column">
      <strong class="mobile-only">Active:</strong>
      {{ neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}
    </div>
    <div class="column">
      <strong class="mobile-only">Synced:</strong>
      {{ neighbor.isSynced === null ? 'N/A' : neighbor.isSynced ? '✔' : '❌' }}️
    </div>
    <div class="column">
      <RoundedButton
        :click="remove"
        type="danger"
        spin="2000"
        modal-text="This action will remove the selected neighbor from your node."
      >
        <font-awesome-icon icon="trash-alt"/>
      </RoundedButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import RoundedButton from '../utility/RoundedButton';

export default {
  name: 'NeighborRow',
  components: {
    RoundedButton
  },
  props: ['neighbor'],
  data: () => {
    return {
      submitted: false
    };
  },
  methods: {
    ...mapActions(['setNeighborName', 'setNeighborPort']),
    remove() {
      this.submitted = true;
      this.$store.dispatch('removeNeighbor', this.neighbor);
    }
  }
};
</script>

<style scoped>
.columns {
  background-color: hsl(0, 0%, 85%);
  margin-top: 4px;
  border-radius: 4px;
}

.mobile-only {
  display: none;
}

@media screen and (max-width: 768px) {
  .mobile-only {
    display: unset;
  }
}
</style>
