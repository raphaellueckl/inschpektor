<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <router-link to="/" class="navbar-brand">
      <figure class="image is-128x128" style="margin-left: 6px; margin-right: 6px">
        <img src="@/assets/logo.png">
      </figure>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </router-link>

    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">
          Dashboard
        </router-link>
        <router-link to="/manage" class="navbar-item">
          Manage
        </router-link>
        <router-link to="/node" class="navbar-item">
          Node Info
        </router-link>
        <router-link to="/login" v-if="!authenticated" class="navbar-item">
          Login
        </router-link>
        <router-link to="/about" class="navbar-item">
          About
        </router-link>
      </div>
    </div>
    <div class="navbar-end">
        <span v-if="nodeInfo" class="navbar-item __online"
              :class="{__offline: nodeInfo.latestSolidSubtangleMilestoneIndex < nodeInfo.latestMilestoneIndex - 1}">
            {{nodeInfo.latestSolidSubtangleMilestoneIndex}} / {{nodeInfo.latestMilestoneIndex}}
        </span>
      <span v-else>
          Node seems offline!
        </span>
    </div>
  </nav>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'Menu',
    computed: {
      ...mapGetters(['nodeInfo', 'authenticated'])
    }
  };
</script>

<style scoped>
  .__online {
    background: hsl(141, 71%, 48%);
  }

  .__offline {
    background: hsl(348, 100%, 61%);
  }

  .navbar-item {
    border-bottom-left-radius: 20px;
  }
</style>