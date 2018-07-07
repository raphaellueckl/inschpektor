<template>
  <!--<article class="tile is-child notification" :class="colors[id % colors.length]">-->
  <article class="tile is-child notification">
    <h1 class="title">{{neighbor.address}}</h1>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>Protocol:</strong><span class="align__right">{{neighbor.protocol === null ? 'N/A' : neighbor.protocol}}</span>
        </p>
        <p>
          <strong>Friendly Node:</strong><span class="align__right">{{neighbor.isFriendlyNode ? '✔️' : '❌'}}</span>
        </p>
        <p>
          <strong>Active:</strong><span class="align__right">{{neighbor.active === null ? 'N/A' : neighbor.active ? '✔️' : '❌' }}</span>
        </p>
        <p>
          <strong>Synced:</strong><span class="align__right">
          {{neighbor.synced === null ? 'N/A'
          : neighbor.synced ? '✔' : '❌'}}️</span>
        </p>
        <p>
          <strong>Iri-version:</strong><span class="align__right">{{neighbor.iriVersion === null ? 'N/A' : neighbor.iriVersion}}</span>
        </p>
        <p>
          <!-- Probably useless information, since timestamp will be the same for all nodes that did not mess up their time settings -->
          <strong>Node time:</strong><span class="align__right">{{neighbor.onlineTime === null ? null : neighbor.onlineTime | timespan}}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'Neighbor',
    props: ['neighbor'],
    data() {
      return {
        colors: ['is-primary', 'is-link', 'is-info', 'is-success', 'is-warning', 'is-danger']
      }
    },
    filters: {
      timespan: function (unixTimestampNum) {
        return unixTimestampNum ? moment(unixTimestampNum).format("MM-DD-YYYY hh:mm") : 'N/A';
      }
    }
  }
</script>

<style scoped>
  .align__right {
    float: right
  }
</style>