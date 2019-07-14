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
                  <label class="label">Domain or IP-Address with TCP port*</label>
                  <div class="control has-icons-right">
                    <input
                      v-model="ipAddress"
                      class="input"
                      v-on:keyup.13="addNeighborAndClearFields"
                      @keyup="checkAddressCorrectness"
                      :class="[
                        ipAddress
                          ? this.validationMessage
                            ? 'is-danger'
                            : 'is-success'
                          : ''
                      ]"
                      type="text"
                      placeholder="E.g. neighbor-domain.net:15600"
                    />
                    <span
                      v-if="this.ipAddress && !this.validationMessage"
                      class="icon is-small is-right"
                      :key="0"
                    >
                      <font-awesome-icon icon="check" />
                    </span>
                    <span
                      v-if="this.ipAddress && this.validationMessage"
                      class="icon is-small is-right"
                      :key="1"
                    >
                      <font-awesome-icon icon="exclamation-triangle" />
                    </span>
                  </div>
                  <p v-if="this.validationMessage" class="help is-danger">{{this.validationMessage}}</p>
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
                      <span v-if="portValidation" class="icon is-small is-right" :key="0">
                        <font-awesome-icon icon="check" />
                      </span>
                      <span v-if="portValidation === false" class="icon is-small is-right" :key="1">
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
                          !this.ipAddress || !!this.validationMessage ||
                            portValidation === false
                        "
                        :click="addNeighborAndClearFields"
                        type="ok"
                        spin="10000"
                      >Submit</RoundedButton>
                    </div>
                    <div class="control">
                      <RoundedButton :click="clearFields">Cancel</RoundedButton>
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
      port: '14265',
      validationMessage: ''
    };
  },
  created() {
    this.$store.dispatch('fetchIriDetails');
  },
  computed: {
    ...mapGetters(['iriFileLocation']),

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
        !this.validationMessage &&
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
    },
    checkAddressCorrectness: function() {
      this.validationMessage = '';
      if (!this.ipAddress) return true;

      const portRegex = new RegExp(`:[0-9]{2,5}$`);
      if (/[a-zA-Z]/.test(this.ipAddress)) {
        if (this.ipAddress.split(':').length === 3) {
          this.validationMessage = 'Do not include the protocol (tcp://)';
        } else if (this.ipAddress.split('.').length < 2) {
          this.validationMessage = "Must include extension (e.g. '.com')";
        } else if (this.ipAddress.includes('/')) {
          this.validationMessage = 'Slashes (/) not allowed in hostnames';
        } else if (!new RegExp(`:[0-9]{2,5}$`).test(this.ipAddress)) {
          this.validationMessage =
            'Must include port information, e.g. :15600, 2-5 digits';
        }
      } else {
        if (this.ipAddress.split('.').length !== 4) {
          this.validationMessage = 'An IPv4 address must have 4 dots';
        } else if (this.ipAddress.split(':').length > 2) {
          this.validationMessage = 'Do not include the protocol (tcp://)';
        } else if (
          this.ipAddress
            .split(':')[0]
            .split('.')
            .filter(fragment => fragment.length > 3).length !== 0
        ) {
          this.validationMessage =
            'IPv4 address fragment cannot exceed 3 digits';
        } else if (!new RegExp(`:[0-9]{2,5}$`).test(this.ipAddress)) {
          this.validationMessage =
            'Must include port information, e.g. :15600, 2-5 digits';
        }
      }
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
