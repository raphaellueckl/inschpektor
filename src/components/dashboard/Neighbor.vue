<template>
  <!--<article class="tile is-child notification" :class="colors[id % colors.length]">-->
  <article class="tile is-child notification">
    <h1 class="title">{{neighbor.address}}</h1>
    <div class="media-content">
      <div class="content">
        {{neighbor}}
        <p>
          <strong>Active:</strong><span class="align__right">{{neighbor.active === null ? 'N/A' : neighbor.active ? '✔️' : '❌' }}</span>
        </p>
        <p>
          <strong>Synced:</strong><span class="align__right">
          {{neighbor.synced === null ? 'N/A'
          : neighbor.synced ? '✔' : '❌'}}️</span>
        </p>
        <p>
          <strong>Iri-version:</strong><span class="align__right">{{neighbor.iriVersion}}</span>
        </p>
        <p>
          <strong>Online since:</strong><span class="align__right">{{neighbor.onlineTime | timespan}}</span>
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
      timespan: function (date) {
        // return moment(date).format('MMMM Do YYYY, h:mm:ss a').diff(new Date());
        // return moment(date).diff(new Date());
        return moment(date);
      }
    }
  }
</script>

<style scoped>
  .align__right {
    float: right
  }
</style>