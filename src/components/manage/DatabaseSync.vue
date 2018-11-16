<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification">
              <h1 class="title">Save & Load</h1>
              <div class="field" style="display: flex; justify-content: center">
                <div class="file is-link">

                  <label class="file-label">
                    <input class="file-input" type="file" name="resume" ref="loadPath" @change="loadDatabase">
                    <span class="file-cta">
                      <span class="file-icon">
                        <font-awesome-icon icon="upload"/>
                      </span>
                      <span class="file-label">
                        Restore database
                      </span>
                    </span>
                  </label>

                  <label class="file-label">
                    <input class="file-input" type="file" name="resume" @change="saveDatabase">
                    <span class="file-cta">
                      <span class="file-icon">
                        <font-awesome-icon icon="download"/>
                      </span>
                      <span class="file-label">
                        Save database
                      </span>
                    </span>
                  </label>

                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'DatabaseSync',
    methods: {
      saveDatabase() {
        this.$store.dispatch('saveDatabase');
      },
      loadDatabase() {
        const file = this.$refs.loadPath.files[0];
        const reader = new FileReader();

        const store = this.$store;

        reader.addEventListener('load', function () {
          const fileContent = JSON.parse(reader.result);
          store.dispatch('loadDatabase', fileContent);
        }, false);

        if (file) {
          reader.readAsText(file);
        }
      }
    }
  };
</script>

<style scoped>
  .file-label {
    margin: 5px;
  }

  .button.is-link.is-rounded > input[type="file"] {
    display: none;
  }

  .file-label {
    border-radius: 290486px; /* bulma default */
  }
</style>