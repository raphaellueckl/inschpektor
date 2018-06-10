<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">

        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <h1 class="title">{{hostNode}}</h1>
            <div class="media-content">
              <div class="content" v-if="nodeInfo">
                <p>
                  <strong>Iri version: </strong>{{nodeInfo.appVersion}}
                </p>
                <p>
                  <strong>Cores: </strong>{{nodeInfo.jreAvailableProcessors}}
                </p>
                <p>
                  <strong>Ram: </strong>{{nodeInfo.jreMaxMemory}}
                </p>
                <p>
                  <strong>Java version: </strong>{{nodeInfo.jreVersion}}
                </p>
                <p>
                  <strong>Neighbors: </strong>{{nodeInfo.neighbors}}
                </p>

              </div>
            </div>
          </article>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'NodeInfo',
    computed: {
      ...mapGetters(['nodeInfo', 'hostNode'])
    }
  };
</script>

<style scoped>

</style>