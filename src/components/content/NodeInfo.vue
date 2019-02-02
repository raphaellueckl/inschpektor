<template>
    <div class="tile is-ancestor">
        <div class="tile is-vertical">
            <div class="tile">
                <div class="tile is-parent is-vertical">
                    <article class="tile is-child notification">
                        <p class="title">{{hostNode}}</p>
                        <div class="media-content">
                            <div class="content" v-if="nodeInfo">
                                <p class="subtitle">Host-Server:</p>
                                <p>
                                    <strong>Ping: </strong>{{nodeInfo.ping === null ? null : nodeInfo.ping}} ms
                                </p>
                                <p>
                                    <strong>Cores: </strong>{{nodeInfo.jreAvailableProcessors}}
                                </p>
                                <strong>RAM Usage: </strong>
                                <span>{{Math.round(nodeInfo.jreFreeMemory / 1000000)}} / {{Math.round(nodeInfo.jreMaxMemory / 1000000)}} MB</span>
                                <div>
                                    <progress class="progress is-success"
                                              :value="nodeInfo.jreFreeMemory"
                                              :max="nodeInfo.jreMaxMemory">
                                    </progress>
                                </div>
                                <p>
                                    <strong>Java Version: </strong>{{nodeInfo.jreVersion}}
                                </p>

                                <br>
                                <p class="subtitle">IRI:</p>
                                <p>
                                    <strong>IRI Version: </strong>{{nodeInfo.appVersion}}
                                </p>
                                <p>
                                    <strong>Neighbors: </strong>{{nodeInfo.neighbors}}
                                </p>
                                <p>
                                    <strong>Timestamp: </strong>{{nodeInfo.time === null ? null : nodeInfo.time |
                                    timespan}}
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
		created() {
			this.$store.dispatch('fetchIriDetails');
		},
		filters: {
			timespan: function (unixTimestampNum) {
				return unixTimestampNum ? moment(unixTimestampNum).format('MM-DD-YYYY hh:mm A') : 'N/A';
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