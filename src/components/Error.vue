<template>
  <div>
    <h1 v-if="code === 'NODE_NOT_SET'" class="title">Hi :)</h1>
    <h1 v-else class="title">Oops 😐</h1>
    <div v-if="code === 'NODE_NOT_SET'">
      <h2 class="subtitle">
        Looks like you didn't link your node yet. Please provide the IP / Domain
        below.
      </h2>
    </div>

    <div v-else>
      <h2 class="subtitle">
        There seem to be problems reaching your IOTA node. If you just restarted
        it, this message will disappear after the node is back up. If the IP of your node
        changed, please update it down below. Otherwise, you have to fix the
        node itself.
      </h2>
      <h2 class="subtitle">Currently set node IP: {{ iriIp }}</h2>
    </div>

    <br />

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="columns">
          <div class="column">
            <label class="label">IOTA-Node IP / Domain (Port only if non-default):</label>
            <div class="columns">
              <div class="column is-4">
                <input
                  id="switchRoundedSuccess"
                  v-model="isHttps"
                  type="checkbox"
                  class="switch is-rounded is-success"
                />
                <label for="switchRoundedSuccess">https?</label>
              </div>
              <div class="column is-8">
                <input
                  v-model="nodeIp"
                  v-on:keyup.13="setHostNode"
                  class="input"
                  type="text"
                  placeholder="E.g. 192.168.1.111 or my-domain.com:12345"
                  @keyup="checkAddressCorrectness"
                  :class="[
                    portValidation === true
                      ? 'is-success'
                      : portValidation === false
                      ? 'is-danger'
                      : ''
                  ]"
                />
                <p v-if="this.validationMessage" class="help is-danger">{{this.validationMessage}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nav v-if="code === 'NODE_NOT_SET'" class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Define a Password (for node interactions):</label>
          <div class="control">
            <input
              v-model="password"
              v-on:keyup.13="setHostNode"
              class="input"
              type="password"
              placeholder="Choose wisely..."
            />
          </div>
        </div>
      </div>
    </nav>
    <nav v-if="code === 'NODE_NOT_SET'" class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Path to iri config (optional, but recommended):</label>
          <div class="control">
            <input
              v-model="iriFileLocation"
              v-on:keyup.13="setHostNode"
              class="input"
              type="text"
              placeholder="E.g. /home/user/iri.txt"
            />
          </div>
        </div>
      </div>
    </nav>
    <nav v-if="code === 'NODE_NOT_SET'" class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Command to restart node (optional):</label>
          <div class="control">
            <input
              v-model="restartNodeCommand"
              v-on:keyup.13="setHostNode"
              class="input"
              type="text"
              placeholder="E.g. systemctl restart iota"
            />
          </div>
        </div>
      </div>
    </nav>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="control">
          <RoundedButton
            :click="setHostNode"
            type="success"
            spin="20000"
            :disabled="code === 'NODE_NOT_SET' ? !password || !nodeIp : !nodeIp"
          >Submit</RoundedButton>
        </div>
      </div>
    </nav>

    <div v-if="code !== 'NODE_NOT_SET' && restartNodeCommandAvailable">
      <div class="is-divider"></div>

      <h2
        class="subtitle"
      >You can restart your iota node, if you are logged in, which could solve the issue.</h2>

      <Login v-if="!authenticated"></Login>

      <nav v-if="authenticated">
        <RoundedButton
          class="centered"
          :click="restartNode"
          type="danger"
          spin="20000"
          modal-text="This action will restart your node. This will cause some connection issues from INSCHPEKTOR, but they will resolve automatically after the node is restarted."
        >Restart Node</RoundedButton>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RoundedButton from './content/utility/RoundedButton';
import Login from './content/Login';

export default {
  name: 'Error',
  components: {
    RoundedButton,
    Login
  },
  props: ['code'],
  data: () => {
    return {
      isHttps: false,
      nodeIp: undefined,
      password: undefined,
      iriFileLocation: undefined,
      restartNodeCommand: undefined,
      submitted: false,
      validationMessage: ''
    };
  },
  methods: {
    restartNode() {
      this.$store.dispatch('restartNode');
    },
    setHostNode() {
      if (
        this.code === 'NODE_NOT_SET'
          ? this.password && this.nodeIp
          : this.nodeIp
      ) {
        this.$store.dispatch('setHostNodeIp', {
          isHttps: this.isHttps,
          nodeIp: this.nodeIp,
          password: this.password,
          iriFileLocation: this.iriFileLocation,
          restartNodeCommand: this.restartNodeCommand
        });
      }
    },
    checkAddressCorrectness: function() {
      this.validationMessage = '';
      if (!this.nodeIp) return true;

      const portRegex = new RegExp(`:[0-9]{2,5}$`);
      if (/[a-zA-Z]/.test(this.nodeIp)) {
        if (this.nodeIp.split(':').length >= 3) {
          this.validationMessage = 'Do not include the protocol (http://)';
        } else if (
          this.nodeIp.split('.').length < 2 ||
          this.nodeIp.split('.')[1].length < 2
        ) {
          this.validationMessage = "Must include extension (e.g. '.com')";
        } else if (this.nodeIp.includes('/')) {
          this.validationMessage = 'Slashes (/) not allowed in hostnames';
        }
      } else {
        if (this.nodeIp.split('.').length !== 4) {
          this.validationMessage = 'An IP address must have 4 dots';
        } else if (this.nodeIp.split(':').length > 2) {
          this.validationMessage = 'Do not include the protocol (http://)';
        } else if (
          this.nodeIp
            .split(':')[0]
            .split('.')
            .filter(fragment => fragment.length > 3).length !== 0
        ) {
          this.validationMessage =
            'IPv4 address fragment cannot exceed 3 digits';
        }
      }

      if (this.nodeIp.includes(':')) {
        if (!new RegExp(`:[0-9]{2,5}$`).test(this.nodeIp)) {
          this.validationMessage =
            'Must include port information, e.g. :15600, 2-5 digits';
        } else if (
          this.nodeIp.split(':')[1].startsWith('0') ||
          Number(this.nodeIp.split(':')[1]) > 65535 ||
          Number(this.nodeIp.split(':')[1]) < 1
        ) {
          this.validationMessage = 'The port is out of range (1 - 65535)';
        }
      }
    }
  },
  computed: {
    ...mapGetters(['iriIp', 'authenticated', 'restartNodeCommandAvailable'])
  },
  created() {
    this.$store.dispatch('fetchIriDetails');
  }
};
</script>

<style scoped>
input {
  max-width: 400px;
}

button {
  margin-top: 20px;
}

.is-4 {
  display: flex;
  align-items: center;
}

.limit {
  width: 60%;
}
</style>
