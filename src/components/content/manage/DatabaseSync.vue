<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <h1 class="title">Settings</h1>
            <div class="field button-container">
              <div class="file is-link">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="resume"
                    ref="loadPath"
                    @change="loadDatabase"
                  >
                  <span class="file-cta">
                    <span class="file-icon">
                      <font-awesome-icon icon="upload"/>
                    </span>
                    <span class="file-label">Restore Nicknames</span>
                  </span>
                </label>
              </div>

              <div class="file is-link">
                <label class="file-label">
                  <input class="file-input" type="button" @click="saveDatabase">
                  <span class="file-cta">
                    <span class="file-icon">
                      <font-awesome-icon icon="download"/>
                    </span>
                    <span class="file-label">Save Nicknames</span>
                  </span>
                </label>
              </div>

              <RoundedButton
                class="aligned-button"
                type="success"
                :click="enableNotifications"
                :disabled="notificationButtonDisabled"
              >Enable Notifications</RoundedButton>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import RoundedButton from '../utility/RoundedButton';

export default {
  name: 'DatabaseSync',
  components: {
    RoundedButton
  },
  methods: {
    ...mapActions(['enableNotifications']),
    saveDatabase() {
      this.$store.dispatch('saveDatabase');
    },
    loadDatabase() {
      const file = this.$refs.loadPath.files[0];
      const reader = new FileReader();

      const store = this.$store;

      reader.addEventListener(
        'load',
        function() {
          const fileContent = JSON.parse(reader.result);
          store.dispatch('loadDatabase', fileContent);
        },
        false
      );

      if (file) {
        reader.readAsText(file);
      }
    }
  },
  computed: {
    notificationButtonDisabled: () => {
      return (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost'
      );
    }
  }
};
</script>

<style scoped>
.file-label {
  margin: 5px;
}

.button.is-link.is-rounded > input[type='file'] {
  display: none;
}

.file-label {
  border-radius: 290486px; /* bulma default */
}

.button-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.aligned-button {
  margin: 5px;
}
</style>
