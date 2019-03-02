<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <h1 class="title">Add a neighbor</h1>
            <div class="media-content">
              <div class="content">
                <div class="field">
                  <label class="label">IP-Address*</label>
                  <div class="control has-icons-right">
                    <input
                      v-model="ipAddress"
                      class="input"
                      v-on:keyup.13="addNeighborAndClearFields"
                      :class="[
                        ipAddress
                          ? isCorrectAddress
                            ? 'is-success'
                            : 'is-danger'
                          : ''
                      ]"
                      type="text"
                      placeholder="E.g. udp://123.32.123.123:14600 or tcp://neighbor-domain.net:15600"
                    />
                    <span
                      v-if="this.ipAddress && isCorrectAddress"
                      class="icon is-small is-right"
                      :key="0"
                    >
                      <font-awesome-icon icon="check" />
                    </span>
                    <span
                      v-if="this.ipAddress && !isCorrectAddress"
                      class="icon is-small is-right"
                      :key="1"
                    >
                      <font-awesome-icon icon="exclamation-triangle" />
                    </span>
                  </div>
                  <p v-if="!isCorrectAddress" class="help is-danger">
                    Wrong node address format!
                  </p>
                </div>

                <div>
                  <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                      <input
                        v-model="name"
                        v-on:keyup.enter="addNeighborAndClearFields"
                        class="input"
                        type="text"
                        placeholder="Custom name for this neighbor"
                      />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Node Port</label>
                    <div class="control has-icons-right">
                      <input
                        v-model="port"
                        class="input"
                        v-on:keyup.enter="addNeighborAndClearFields"
                        :class="[
                          portValidation === true
                            ? 'is-success'
                            : portValidation === false
                            ? 'is-danger'
                            : ''
                        ]"
                        type="text"
                        placeholder="E.g. 14267"
                      />
                      <span
                        v-if="portValidation"
                        class="icon is-small is-right"
                        :key="0"
                      >
                        <font-awesome-icon icon="check" />
                      </span>
                      <span
                        v-if="portValidation === false"
                        class="icon is-small is-right"
                        :key="1"
                      >
                        <font-awesome-icon icon="exclamation-triangle" />
                      </span>
                    </div>
                    <p v-if="portValidation === false" class="help is-danger">
                      Wrong format! Just write a plain number between 0 and
                      65535
                    </p>
                  </div>

                  <div class="field" v-if="iriFileLocation">
                    <label class="checkbox">
                      <input type="checkbox" v-model="writeToIriConfig" />
                      Write neighbor to iri config
                    </label>
                  </div>

                  <label class="info">* required field</label>

                  <div class="field is-grouped">
                    <div class="control">
                      <RoundedButton
                        :disabled="
                          (ipAddress && !isCorrectAddress) ||
                            portValidation === false
                        "
                        :click="addNeighborAndClearFields"
                        type="ok"
                        spin="2000"
                      >
                        Submit
                      </RoundedButton>
                    </div>
                    <div class="control">
                      <RoundedButton :click="clearFields">
                        Cancel
                      </RoundedButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import RoundedButton from '../utility/RoundedButton';

export default {
  name: 'AddNeighbor',
  data: () => {
    return {
      name: '',
      ipAddress: '',
      writeToIriConfig: true,
      port: '14265'
    };
  },
  created() {
    this.$store.dispatch('fetchIriDetails');
  },
  computed: {
    ...mapGetters(['iriFileLocation']),
    isCorrectAddress: function() {
      if (!this.ipAddress) return true;
      const startRegex = new RegExp(`^(udp|tcp):\\/\\/`);
      const endRegex = new RegExp(`:[0-9]{2,5}$`);
      return startRegex.test(this.ipAddress) && endRegex.test(this.ipAddress);
    },
    portValidation: function() {
      if (this.port === '') return null;
      else if (
        !isNaN(this.port) &&
        parseInt(this.port, 10) >= 0 &&
        parseInt(this.port, 10) <= 65535
      )
        return true;
      else return false;
    }
  },
  methods: {
    ...mapActions(['addNeighbor']),
    addNeighborAndClearFields: function() {
      if (
        this.ipAddress &&
        this.isCorrectAddress &&
        (this.portValidation === true || this.portValidation === null)
      ) {
        this.addNeighbor({
          name: this.name,
          address: this.ipAddress,
          writeToIriConfig: this.writeToIriConfig && !!this.iriFileLocation,
          port: this.port
        });
        this.clearFields();
      }
    },
    clearFields: function() {
      this.name = '';
      this.ipAddress = '';
      this.port = '14265';
    }
  },
  components: {
    RoundedButton
  }
};
</script>

<style scoped>
.field.is-grouped {
  margin-top: 10px;
}
</style>
