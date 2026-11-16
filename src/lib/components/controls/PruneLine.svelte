<!--
  The prune line at the bottom of the controls side ("Old history is pruned on request"). Its room is kept so nothing
  above moves when it appears; the line and its offer show only when there is something to offer, three years after
  the first install.
-->
<script lang="ts">
  // === State ===

  // TODO: Profiles builds pruning; then true while the record holds a whole month more than three years old
  let offering = false
</script>

<footer class="prune" class:offering>
  <!-- TODO: the offer to prune, when pruning is built -->
</footer>

<style>
  /* === Layout === */

  .prune {
    height: var(--prune-height);
    margin: var(--prune-margin);
    padding: var(--prune-padding);
  }

  /* === States === */

  .offering {
    border-top: 1px solid var(--controls-line);
  }
</style>
