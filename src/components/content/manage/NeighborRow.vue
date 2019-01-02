<template>
  <div class="columns">
    <div class="column is-one-fifth">
      <input v-model="neighbor.name" placeholder="Enter nickname..." class="input" type="text"
             @input="addNeighborNick(neighbor)">
    </div>
    <div class="column is-two-fifths">
      {{neighbor.address}}
    </div>
    <div class="column">
      {{neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}
    </div>
    <div class="column">
      {{neighbor.isSynced === null ? 'N/A'
      : neighbor.isSynced ? '✔' : '❌'}}️
    </div>
    <div class="column">
      <RoundedButton :click="remove" type="danger" spin="2000"
                     modal-text="This action will remove the selected neighbor from your node.">
        <font-awesome-icon icon="trash-alt"/>
      </RoundedButton>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
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
      ...mapActions(['addNeighborNick']),
      remove() {
        this.submitted = true;
        this.$store.dispatch('removeNeighbor', this.neighbor);
      }
    }
  };
</script>

<style scoped>
  .columns {
    background-color: rgb(0, 159, 255, 0.85);
    color: #fff;
    margin-top: 4px;
    border-radius: 4px;
  }

  .horizontal-grid {
    display: grid;
    grid-template-columns: 10fr 1fr;
    grid-gap: 10px;
  }

  .center-checkmark {
    padding-top: 100%;
  }
</style>