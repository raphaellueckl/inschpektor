<template>
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

              <div v-if="systemInfo_cpu">
                <strong>CPU Usage: {{this.currentCpuUsage}} %</strong>
              </div>
              <div v-if="systemInfo_cpu">
                <trend-chart
                  class="chart"
                  :datasets="systemInfo_cpu"
                  :grid="grid_"
                  :labels="labels_"
                  :min="min"
                  :max="max"
                ></trend-chart>
              </div>

              <div v-if="systemInfo_networkIO">
                <strong>Network I/O - Upload: {{this.currentUpload}} MB/s - Download: {{this.currentDownload}} MB/s</strong>
              </div>
              <div v-if="systemInfo_networkIO">
                <trend-chart
                  class="chart multi"
                  :datasets="systemInfo_networkIO"
                  :grid="grid_"
                  :labels="labels_"
                  :min="0"
                  :max="10"
                ></trend-chart>
              </div>

              <div v-if="systemInfo_diskIO">
                <strong>Disk I/O: {{this.currentDiskIO}} MB/s</strong>
              </div>
              <div v-if="systemInfo_diskIO">
                <trend-chart
                  class="chart"
                  :datasets="systemInfo_diskIO"
                  :grid="grid_"
                  :labels="labels_"
                  :min="min"
                  :max="10"
                ></trend-chart>
              </div>

              <div v-if="systemInfo_runningProcesses">
                <strong>Running Processes: {{this.currentRunningProcess}}</strong>
              </div>
              <div v-if="systemInfo_runningProcesses">
                <trend-chart
                  class="chart"
                  :datasets="systemInfo_runningProcesses"
                  :grid="grid_"
                  :labels="labels_"
                  :min="min"
                ></trend-chart>
              </div>
            </div>
          </div>
        </article>
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
      labels_: {
        yLabels: 2
      }
    };
  },
  computed: {
    ...mapGetters([
      'nodeInfo',
      'hostNode',
      'systemInfo_cpu',
      'systemInfo_runningProcesses',
      'systemInfo_diskIO',
      'systemInfo_networkIO',
      'currentCpuUsage',
      'currentUpload',
      'currentDownload',
      'currentDiskIO',
      'currentRunningProcess'
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

<style>
progress.progress.is-success {
  max-width: 300px;
  display: inline-block;
  margin-bottom: 0px;
}

.chart {
  max-width: 400px;
}

.fill {
  fill: #51e183;
}

.stroke {
  stroke: #348c53;
}

.multi g:nth-of-type(4) path:first-of-type {
  fill: #ffe88a;
  opacity: 0.5;
}

.multi g:nth-of-type(4) path:last-of-type {
  stroke: #ffd943;
}
</style>
