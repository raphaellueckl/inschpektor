<template>
  <article
    @click="swapCard()"
    class="tile is-child notification"
    :class="{
      'is-faulty':
        !neighbor.isFriendlyNode ||
        neighbor.isActive === false || neighbor.isActive === -1 || 
        neighbor.isSynced === false,
      'is-premium': neighbor.iriVersion
    }"
    ref="cardToAnimate"
  >
    <h2 class="title">
      <span v-if="neighbor.iriVersion">👑</span>
      <span v-if="isUnpersistedNeighbor">👽</span>
      {{ neighbor.name ? neighbor.name : neighbor.domain ? neighbor.domain : neighbor.address }}
    </h2>

    <div class="media-content">
      <div v-if="showContent" class="content">
        <p>
          <strong>Active:</strong>
          <span class="align__right">
            {{
            neighbor.isActive === null ? 'N/A' : neighbor.isActive && neighbor.isActive !== -1 ? '✔️' : '❌'
            }}
          </span>
        </p>
        <p v-if="neighbor.isActive">
          <strong>Healthy:</strong>
          <span class="align__right">
            {{
            neighbor.isFriendlyNode ? '✔️' : '❌'
            }}
          </span>
        </p>
        <!-- ## Premium neighbor information-->
        <p v-if="neighbor.isSynced === true || neighbor.isSynced === false">
          <strong>Synced:</strong>
          <span class="align__right">{{ neighbor.isSynced ? '✔' : '❌' }}️</span>
        </p>
        <p v-if="neighbor.iriVersion">
          <strong>IRI Version:</strong>
          <span class="align__right">{{ neighbor.iriVersion }}</span>
        </p>
        <p v-if="neighbor.ping">
          <strong>Ping:</strong>
          <span class="align__right">{{ neighbor.ping }} ms</span>
        </p>
        <!-- ## -->
      </div>
      <div v-if="!showContent" class="content">
        <!-- ## Premium neighbor information-->
        <p>
          <strong>Milestone:</strong>
          <span>
            {{
            neighbor.milestone === null ? 'N/A' : neighbor.milestone
            }}
          </span>
        </p>
        <!-- ## -->
        <p>
          <strong>Domain:</strong>
          <span>
            {{
            neighbor.domain === null
            ? 'N/A'
            : neighbor.domain
            }}
          </span>
        </p>
        <p>
          <strong>IP:</strong>
          <span>
            {{
            neighbor.address === null
            ? 'N/A'
            : neighbor.address
            }}
          </span>
        </p>
        <p>
          <strong>Connected:</strong>
          <span>
            {{
            neighbor.connected === null
            ? 'N/A'
            : neighbor.connected
            }}
          </span>
        </p>
        <p>
          <strong>All Transactions:</strong>
          <span>
            {{
            neighbor.numberOfAllTransactions === null
            ? 'N/A'
            : neighbor.numberOfAllTransactions
            }}
          </span>
        </p>
        <p>
          <strong>Random Transaction Requests:</strong>
          <span>
            {{
            neighbor.numberOfRandomTransactionRequests === null
            ? 'N/A'
            : neighbor.numberOfRandomTransactionRequests
            }}
          </span>
        </p>
        <p>
          <strong>New Transactions:</strong>
          <span>
            {{
            neighbor.numberOfNewTransactions === null
            ? 'N/A'
            : neighbor.numberOfNewTransactions
            }}
          </span>
        </p>
        <p>
          <strong>Invalid Transactions:</strong>
          <span>
            {{
            neighbor.numberOfInvalidTransactions === null
            ? 'N/A'
            : neighbor.numberOfInvalidTransactions
            }}
          </span>
        </p>
        <p>
          <strong>Stale Transactions:</strong>
          <span>
            {{
            neighbor.numberOfStaleTransactions === null
            ? 'N/A'
            : neighbor.numberOfStaleTransactions
            }}
          </span>
        </p>
        <p>
          <strong>Sent Transactions:</strong>
          <span>
            {{
            neighbor.numberOfSentTransactions === null
            ? 'N/A'
            : neighbor.numberOfSentTransactions
            }}
          </span>
        </p>
        <p>
          <strong>Dropped Sent Packets:</strong>
          <span>
            {{
            neighbor.numberOfDroppedSentPackets === null
            ? 'N/A'
            : neighbor.numberOfDroppedSentPackets
            }}
          </span>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Neighbor',
  data: () => {
    return {
      showContent: true
    };
  },
  props: ['neighbor'],
  computed: {
    ...mapGetters(['persistedNeighbors']),
    isUnpersistedNeighbor: function() {
      return (
        this.$store.getters.persistedNeighbors &&
        !this.$store.getters.persistedNeighbors.includes(
          `tcp://${this.neighbor.address}`
        )
      );
    }
  },
  methods: {
    swapCard() {
      this.$refs.cardToAnimate.classList.add('animated');
      setTimeout(
        () => this.$refs.cardToAnimate.classList.remove('animated'),
        300
      );
      setTimeout(() => (this.showContent = !this.showContent), 150);
    }
  }
};
</script>

<style scoped>
.align__right {
  float: right;
}

.is-premium {
  background-color: hsl(141, 71%, 70%);
}

.is-faulty {
  background-color: hsl(356, 100%, 72%);
}

.tile.is-child.notification {
  flex-basis: 30%;
  margin: 5px !important;
  word-wrap: break-word;
}

.animated {
  animation: swap 0.3s;
}

@keyframes swap {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
