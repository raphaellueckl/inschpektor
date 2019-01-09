<template>
  <div>
    <div class="container">
      <h1 class="title">Login</h1>
      <h2 class="subtitle">
        To manage your neighbors or view the state of your node, you need to login first.
      </h2>
    </div>

    <br>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Password:</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="Choose wisely...">
          </div>
        </div>
      </div>
    </nav>

    <RoundedButton type="ok" :click="loginClicked" :disabled="!password">
      Login
    </RoundedButton>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import RoundedButton from './utility/RoundedButton';

  export default {
    name: 'Login',
    components: {
      RoundedButton
    },
    methods: {
      ...mapActions(['login']),
      loginClicked: function () {
        this.login(this.password);
      }
    },
    data: () => {
      return {
        password: undefined,
        submitted: false
      };
    },
    created() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'USER_AUTHENTICATED') {
          this.$router.push('/');
        }
      });
    }
  };
</script>

<style scoped>
</style>