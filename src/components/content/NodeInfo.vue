<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <p class="title">{{ hostNode ? hostNode : 'N/A' }}</p>
            <div class="media-content">
              <div class="content" v-if="nodeInfo">
                <p class="subtitle">Host-Server:</p>
                <p>
                  <strong>Ping:</strong>
                  {{ nodeInfo.ping === null ? null : nodeInfo.ping }} ms
                </p>
                <p>
                  <strong>Cores:</strong>
                  {{ nodeInfo.jreAvailableProcessors }}
                </p>
                <strong>RAM Usage:</strong>
                <span>
                  {{ Math.round(nodeInfo.jreFreeMemory / 1000000) }} /
                  {{ Math.round(nodeInfo.jreMaxMemory / 1000000) }} MB
                </span>
                <div>
                  <progress
                    class="progress is-success"
                    :value="nodeInfo.jreFreeMemory"
                    :max="nodeInfo.jreMaxMemory"
                  ></progress>
                </div>
                <p>
                  <strong>Java Version:</strong>
                  {{ nodeInfo.jreVersion }}
                </p>

                <br />
                <p class="subtitle">IRI:</p>
                <p>
                  <strong>IRI Version:</strong>
                  {{ nodeInfo.appVersion }}
                </p>
                <p>
                  <strong>Neighbors:</strong>
                  {{ nodeInfo.neighbors }}
                </p>
                <p>
                  <strong>Timestamp:</strong>
                  {{
                  nodeInfo.time === null ? null : nodeInfo.time | timespan
                  }}
                </p>

                <div>
                  <strong>CPU Usage:</strong>
                </div>
                <trend-chart
                  :datasets="systemInfo_cpu"
                  :grid="grid_"
                  :labels="labels_"
                  :min="min"
                  :max="max"
                  style="max-width:400px;"
                ></trend-chart>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'NodeInfo',
  data: () => {
    return {
      min: 0,
      max: 100,
      grid_: {
        verticalLines: false,
        horizontalLines: true
      },
      datasets_: [
        {
          data: [10, 50, 20, 100, 40, 60, 80],
          smooth: true,
          fill: true
        }
      ],
      labels_: {
        yLabels: 5
      }
    };
  },
  computed: {
    ...mapGetters([
      'nodeInfo',
      'hostNode',
      'systemInfo_cpu'
      // 'systemInfo_allProcesses',
      // 'systemInfo_diskIO',
      // 'systemInfo_networkIO_upload',
      // 'systemInfo_networkIO_download'
    ])
  },
  created() {
    this.$store.dispatch('fetchIriDetails');
  },
  filters: {
    timespan: function(unixTimestampNum) {
      return unixTimestampNum
        ? moment(unixTimestampNum).format('MM-DD-YYYY hh:mm A')
        : 'N/A';
    }
  }
};
</script>

<style scoped>
progress.progress.is-success {
  max-width: 300px;
  display: inline-block;
  margin-bottom: 0px;
}
</style>
