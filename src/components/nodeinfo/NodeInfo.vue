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
                  <strong>IRI Version: </strong>{{nodeInfo.appVersion}}
                </p>
                <p>
                  <strong>Cores: </strong>{{nodeInfo.jreAvailableProcessors}}
                </p>
                <p>
                  <strong>Ram: </strong>{{nodeInfo.jreMaxMemory}}
                </p>
                <p>
                  <strong>Java Version: </strong>{{nodeInfo.jreVersion}}
                </p>
                <p>
                  <strong>Neighbors: </strong>{{nodeInfo.neighbors}}
                </p>
                <p>
                  <strong>Timestamp: </strong>{{nodeInfo.time === null ? null : nodeInfo.time | timespan}}
                </p>
                <p>
                  <strong>RAM Usage: </strong>
                  <progress class="progress is-success"
                            :value="nodeInfo.jreFreeMemory"
                            :max="nodeInfo.jreMaxMemory">
                  </progress>
                  <span> {{Math.round(nodeInfo.jreFreeMemory / 1000000)}} / {{Math.round(nodeInfo.jreMaxMemory / 1000000)}} MB</span>
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
  import moment from 'moment';

  export default {
    name: 'NodeInfo',

    computed: {
      ...mapGetters(['nodeInfo', 'hostNode'])
    },
    filters: {
      timespan: function (unixTimestampNum) {
        return unixTimestampNum ? moment(unixTimestampNum).format('MM-DD-YYYY hh:mm A') : 'N/A';
      }
    }
  };
</script>

<style scoped>
  progress {
    max-width: 300px;
    display: inline-flex;
  }
</style>