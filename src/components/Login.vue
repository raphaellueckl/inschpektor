<template>
  <div>
    <div class="container">
      <h1 class="title">Login</h1>
      <h2 class="subtitle">
        To manage your neighbors, you need to login first.
      </h2>
    </div>

    <br>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Password:</label>
          <div class="control">
            <input v-model="password" class="input" type="text" placeholder="Choose wisely...">
          </div>
        </div>
      </div>
    </nav>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="control">
          <button class="button is-success"
            @click="login(password); submitted = true"
            :class="{'is-loading': submitted}"
            :disabled="!password">
            Submit
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "Login",
  methods: {
    login() {
      // axios.get('/api/iri/getNeighbors').then(response => {console.log(response)});
    },
    ...mapActions(["login"])
  },
  data: () => {
    return {
      password: undefined,
      submitted: false
    };
  },
  computed: {
    // ...mapGetters([
    // 'nodeInfo'
    // ])
  },
  created() {
    this.$store.subscribe( (mutation, state) => {
      if (mutation.type === 'USER_AUTHENTICATED') {
        this.$router.push('/');
      }
    })
  }
};
</script>

<style scoped>
</style>