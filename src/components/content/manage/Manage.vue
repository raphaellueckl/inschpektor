<template>
  <div>
    <AddNeighbor />
    <NeighborTable />
    <DatabaseSync />
    <DangerZone />
  </div>
</template>

<script>
import AddNeighbor from './AddNeighbor';
import NeighborTable from './NeighborTable';
import DangerZone from './DangerZone';
import DatabaseSync from './DatabaseSync';

export default {
  name: 'Manage',
  components: {
    DangerZone,
    AddNeighbor,
    NeighborTable,
    DatabaseSync
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
