<template>
  <div>
    <!-- <img src="../../../assets/logo.png" /> -->
    <div class="logo-holder">
      <div class="logo-item">
        <img src="@/assets/logo_300.png" style="width:150px; height:150px;">
      </div>
      <div class="logo-item">
        <span>inschpektor</span>
      </div>
    </div>

    <p>
      <strong>Installed Version:</strong>
      {{ installedVersion }}
    </p>
    <p v-if="latestInschpektorVersion > installedVersion" class="update-available">
      <strong>🌟 Update available!</strong>
      Version
      {{ latestInschpektorVersion }} is ready to download! See here how to
      update:
      <a
        href="https://github.com/codepleb/inschpektor/blob/master/readme.md"
        target="_blank"
      >Update manual</a>
      🌟
    </p>
    <br>
    <p>
      This is an open source app, that can be found @
      <a
        href="https://github.com/codepleb/inschpektor"
      >Github</a>.
    </p>
    <p>The application is based on Vuejs.</p>
    <br>
    <p>If you would like to contribute: I'd love to get your pullrequests. :)</p>
    <p>Hit me up on telegram: @codepleb</p>
    <br>
    <br>
    <h3 class="title is-3">Donations</h3>
    <p>
      If you like this app and you want to support me, use the following IOTA
      address:
    </p>

    <Donation
      address="IZ99FQWJUQJCDLBSUOEDZIVROSARFYLXJWPZNAXQPCCGAHCUWKRE9RNHMGNHZTAIZHPUDV9HMSPNJLYSXPNEPTRHUW"
    />

    <br>
    <p>
      If you prefer another coin, you can have a look at the other options over
      @
      <a
        target="_blank"
        href="https://codepleb.net/donations"
      >codepleb.net</a>
    </p>
  </div>
</template>

<script>
import Donation from './Donation';
import { mapGetters } from 'vuex';

export default {
  name: 'About',
  data: () => {
    return {
      installedVersion: VERSION
    };
  },
  computed: {
    ...mapGetters(['latestInschpektorVersion'])
  },
  components: {
    Donation
  }
};
</script>

<style scoped>
.update-available {
  background: hsl(141, 71%, 70%);
  border-radius: 1vh;
}

.logo-holder {
  /* display: flex; */
  /* align-items: center; */
}

.logo-item {
  margin: 5px;
  color: black;
  font-size: 40px;
  font-family: monospace;
}

.logo-item:last-child {
  margin-bottom: 20px;
}
</style>
