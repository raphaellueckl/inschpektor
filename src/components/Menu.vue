<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="logo">
      <router-link to="/" class="navbar-brand">
        <div class="logo-holder">
          <div class="logo-item">
            <img src="@/assets/logo_300.png" class="logo-img">
          </div>
          <div class="logo-item">
            <span>inschpektor</span>
          </div>
        </div>
      </router-link>
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': burgerOpen }"
        @click="burgerOpen = !burgerOpen"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': burgerOpen }">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Dashboard</router-link>
        <router-link to="/manage" class="navbar-item">Manage</router-link>
        <router-link to="/node" class="navbar-item">Node Info</router-link>
        <router-link to="/login" v-if="!authenticated" class="navbar-item">Login</router-link>
        <router-link to="/about" class="navbar-item">About</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <span
        v-if="nodeInfo"
        class="navbar-item node-state-badge __online"
        :class="{
          __offline:
            nodeInfo.latestSolidSubtangleMilestoneIndex <
            nodeInfo.latestMilestoneIndex - 1
        }"
      >
        {{ nodeInfo.latestSolidSubtangleMilestoneIndex }} /
        {{ nodeInfo.latestMilestoneIndex }}
      </span>
      <span v-else class="navbar-item node-state-badge __offline">Node seems offline!</span>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Menu',
  data() {
    return {
      burgerOpen: false
    };
  },
  computed: {
    ...mapGetters(['nodeInfo', 'authenticated'])
  }
};
</script>

<style scoped>
.__online {
  background: hsl(141, 71%, 60%);
}

.__offline {
  background: hsl(356, 100%, 72%);
}

.node-state-badge {
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

@media screen and (min-width: 1088px) {
  .node-state-badge {
    border-bottom-right-radius: 0 !important;
  }
}

.navbar-item {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

a.navbar-item.is-active {
  background-color: hsl(0, 0%, 96%);
}

.image.is-96x75 {
  height: 75px;
  width: 96px;
}

.logo-holder {
  display: flex;
  align-items: center;
  background: rgb(240, 240, 240);
  border-right-style: solid;
  border-bottom-style: solid;
  border-width: 3px;
  border-color: whitesmoke;
  border-bottom-right-radius: 20px;
}

.logo-item {
  margin: 5px;
  color: black;
  font-size: 18px;
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: monospace;
}

.logo-item:last-child {
  margin-right: 20px;
}

.logo-img {
  width: 40px;
  height: 40px;
  display: block;
}

.logo {
  display: flex;
  align-items: center;
}
</style>
