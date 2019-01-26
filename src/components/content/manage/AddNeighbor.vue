<template>
    <div class="tile is-ancestor">
        <div class="tile is-vertical">
            <div class="tile">
                <div class="tile is-parent is-vertical">
                    <article class="tile is-child notification">
                        <h1 class="title">Add a neighbor</h1>
                        <div class="media-content">
                            <div class="content">

                                <div class="field">
                                    <label class="label">IP-Address*</label>
                                    <div class="control has-icons-right">
                                        <input v-model="ipAddress" class="input"
                                               :class="[ipAddress ? isCorrectAddress ? 'is-success' : 'is-danger' : '']"
                                               type="text"
                                               placeholder="E.g. udp://123.32.123.123:14600 or tcp://neighbor-domain.net:15600">
                                        <span v-if="this.ipAddress && isCorrectAddress" class="icon is-small is-right"
                                              :key="0">
                      <font-awesome-icon icon="check"/>
                    </span>
                                        <span v-if="this.ipAddress && !isCorrectAddress" class="icon is-small is-right"
                                              :key="1">
                      <font-awesome-icon icon="exclamation-triangle"/>
                    </span>
                                    </div>
                                    <p v-if="!isCorrectAddress" class="help is-danger">Wrong node address format!</p>
                                </div>

                                <div>
                                    <div class="field">
                                        <label class="label">Name</label>
                                        <div class="control">
                                            <input v-model="name" class="input" type="text"
                                                   placeholder="Custom name for this neighbor">
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">Node Port (Optional)</label>
                                        <div class="control has-icons-right">
                                            <input v-model="ipAddress" class="input"
                                                   :class="[ipAddress ? isCorrectAddress ? 'is-success' : 'is-danger' : '']"
                                                   type="text"
                                                   placeholder="E.g. udp://123.32.123.123:14600 or tcp://neighbor-domain.net:15600">
                                            <span v-if="this.ipAddress && isCorrectAddress"
                                                  class="icon is-small is-right" :key="0">
                        <font-awesome-icon icon="check"/>
                      </span>
                                            <span v-if="this.ipAddress && !isCorrectAddress"
                                                  class="icon is-small is-right" :key="1">
                        <font-awesome-icon icon="exclamation-triangle"/>
                      </span>
                                        </div>
                                        <p v-if="!isCorrectAddress" class="help is-danger">Wrong node address
                                            format!</p>
                                    </div>

                                    <div class="field" v-if="iriFileLocation">
                                        <label class="checkbox">
                                            <input type="checkbox" v-model="writeToIriConfig">
                                            Write neighbor to iri config
                                        </label>
                                    </div>

                                    <label class="info">* required field</label>

                                    <div class="field is-grouped">
                                        <div class="control">
                                            <RoundedButton :disabled="ipAddress && !isCorrectAddress"
                                                           :click="addNeighborAndClearFields" type="ok" spin="2000">
                                                Submit
                                            </RoundedButton>
                                        </div>
                                        <div class="control">
                                            <RoundedButton :click="clearFields">
                                                Cancel
                                            </RoundedButton>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </article>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import RoundedButton from '../utility/RoundedButton'

    export default {
        name: 'AddNeighbor',
        data: () => {
            return {
                name: '',
                ipAddress: '',
                writeToIriConfig: true
            };
        },
        created() {
            this.$store.dispatch('fetchIriDetails');
        },
        computed: {
            ...mapGetters(['iriFileLocation']),
            isCorrectAddress: function () {
                if (!this.ipAddress) return true;
                const startRegex = new RegExp(`^(udp|tcp):\\/\\/`);
                const endRegex = new RegExp(`:[0-9]{2,5}$`);
                return startRegex.test(this.ipAddress) && endRegex.test(this.ipAddress);
            }
        },
        methods: {
            ...mapActions(['addNeighbor']),
            addNeighborAndClearFields: function () {
                this.addNeighbor({
                    name,
                    address: this.ipAddress,
                    writeToIriConfig: this.writeToIriConfig && !!this.iriFileLocation
                });
                this.clearFields();
            },
            clearFields: function () {
                this.name = '';
                this.ipAddress = '';
            },
        },
        components: {
            RoundedButton
        }
    };
</script>

<style scoped>
    .field.is-grouped {
        margin-top: 10px;
    }
</style>