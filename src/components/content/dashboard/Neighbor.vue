<template>
    <article class="tile is-child notification"
             :class="{'is-faulty' : !neighbor.isFriendlyNode || neighbor.isActive === false || neighbor.isSynced === false, 'is-premium': neighbor.iriVersion}">
        <h2 class="title"><span v-if="neighbor.iriVersion">👑</span><span v-if="isUnpersistedNeighbor">👽</span>
            {{neighbor.name ? neighbor.name : neighbor.address}}</h2>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong>Protocol:</strong><span class="align__right">{{neighbor.protocol === null ? 'N/A' : neighbor.protocol.toUpperCase()}}</span>
                </p>
                <p>
                    <strong>Active:</strong><span class="align__right">{{neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}</span>
                </p>
                <p>
                    <strong>Healthy:</strong><span
                        class="align__right">{{neighbor.isFriendlyNode ? '✔️' : '❌'}}</span>
                </p>
                <!-- ## Premium neighbor information-->
                <p v-if="neighbor.isSynced">
                    <strong>Synced:</strong><span class="align__right">{{neighbor.isSynced ? '✔' : '❌'}}️</span>
                </p>
                <p v-if="neighbor.iriVersion">
                    <strong>Iri-version:</strong><span class="align__right">{{neighbor.iriVersion}}</span>
                </p>
                <p v-if="neighbor.ping">
                    <strong>Ping:</strong><span class="align__right">{{neighbor.ping}} ms</span>
                </p>
                <!-- ## -->
            </div>
        </div>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Neighbor',
        props: ['neighbor'],
        computed: {
            ...mapGetters(['persistedNeighbors']),
            isUnpersistedNeighbor: function () {
                return this.$store.getters.persistedNeighbors && !this.$store.getters.persistedNeighbors.includes(`${this.neighbor.protocol}://${this.neighbor.address}`);
            }
        }
    };
</script>

<style scoped>
    .align__right {
        float: right
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
</style>