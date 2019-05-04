<template>
  <div>
    <div class="container">
      <h1 class="title">Login</h1>
      <h2 class="subtitle">
        To manage your neighbors or view the state of your node, you need to
        login first.
      </h2>
    </div>

    <br>

    <nav class="level">
      <div class="level-item">
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-right">
            <input
              v-model="password"
              v-on:keyup.13="loginClicked"
              class="input"
              :class="[
                authenticated === false && loginAttempted ? 'is-danger' : ''
              ]"
              type="password"
              placeholder="Enter Password..."
            >
            <span
              v-if="authenticated === false && loginAttempted"
              class="icon is-small is-right"
              :key="1"
            >
              <font-awesome-icon icon="exclamation-triangle"/>
            </span>
          </div>
          <p v-if="authenticated === false && loginAttempted" class="help is-danger">Wrong Password!</p>
        </div>
      </div>
    </nav>

    <RoundedButton type="success" :click="loginClicked" :disabled="!password" spin="2000">Login</RoundedButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import RoundedButton from './utility/RoundedButton';

export default {
  name: 'Login',
  components: {
    RoundedButton
  },
  methods: {
    ...mapActions(['login']),
    loginClicked: function() {
      if (this.password) {
        this.login(this.password);
        setTimeout(() => (this.loginAttempted = true), 2000);
      }
    }
  },
  data: () => {
    return {
      password: undefined,
      submitted: false,
      loginAttempted: false
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'USER_AUTHENTICATED' && mutation.payload === true) {
        this.$router.push('/');
      }
    });
  },
  computed: {
    ...mapGetters(['authenticated'])
  }
};
</script>

<style scoped></style>
