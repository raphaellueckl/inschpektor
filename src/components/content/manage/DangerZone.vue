<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification is-dark">
            <h1 class="title">Danger Zone</h1>

            <div class="flex-container">
              <RoundedButton
                class="centered"
                :click="restartNode"
                type="danger"
                spin="10000"
                modal-text="This action will restart your node. This will cause some connection issues from INSCHPEKTOR, but they will resolve automatically after the node is restarted."
              >
                Restart Node
              </RoundedButton>
              <RoundedButton
                class="centered"
                :click="resetDatabase"
                type="danger"
                spin="10000"
                modal-text="Reset inschpektor to factory default mode. This will not affect your IOTA node, but INSCHPEKTOR needs to be reconfigured and the internal data will vanish. Do not forget to do a backup of your nicknames ('Save Nicknames') first!"
              >
                Reset Inschpektor
              </RoundedButton>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoundedButton from '../utility/RoundedButton';

export default {
  name: 'DangerZone',
  components: {
    RoundedButton
  },
  methods: {
    restartNode() {
      this.$store.dispatch('restartNode');
    },
    resetDatabase() {
      this.$store.dispatch('resetDatabase');
    }
  }
};
</script>

<style scoped>
.centered {
  margin: 5px;
}

.flex-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
