<!--
  The screen for a record that cannot be read ("A record that cannot be read offers the newest copy"), in the menu's
  panel locked open: what happened, what is offered, the choices and a quiet note, centred. A broken file with a copy
  offers "Använd kopian", the dashboard showing the copy meanwhile; one without a copy offers "Starta nytt", the
  onboarding from its balance; a newer record offers "Hämta senaste", which opens the releases page and closes the app.
  "Importera" is greyed out until Handover. "Använd kopian" saves the copy, and the panel closes as the menu closes.
-->
<script lang="ts" module>
  /** The repo's releases page, where every version's installers are */
  const RELEASES = 'https://github.com/J-manLans/TimeFold/releases'

  const COPY = {
    title: 'Programmet kunde ej startas.',
    main: 'Använd kopian',
    importable: true,
    note: 'Inget ändras förrän du väljer.',
  }

  const BARE = {
    title: 'Programmet kunde ej startas.',
    line:
      'Din data är korrupt, och appen hann aldrig spara någon kopia, men det hände tidigt: ladda bara om filen du ' +
      'importerade, eller starta om och fyll i för hand om något försvann.',
    main: 'Starta nytt',
    importable: true,
    note: 'Den skadade filen ersätts när du är klar.',
  }

  const NEWER = {
    title: 'Din fil kommer från en nyare version.',
    line: 'Den här versionen av TimeFold kan inte öppna den. Hämta den senaste versionen och starta appen igen.',
    main: 'Hämta senaste',
    importable: false,
    note: 'Appen stängs när du klickar på knappen, så att du kan installera om.',
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { getCurrentWindow } from '@tauri-apps/api/window'
  import { openUrl } from '@tauri-apps/plugin-opener'
  import { app } from '$lib/app.svelte'
  import { dayInWords } from '$lib/modules/shared/dates'
  import ChoiceButton from '$lib/components/shared/ChoiceButton.svelte'

  // === State ===

  let main: ChoiceButton | undefined = $state()
  let words = $derived.by(() => {
    if (app.recovery === 'newer') return NEWER
    if (app.recovery === 'bare') return BARE
    const where = app.stacked ? 'ovanför' : 'till höger'
    const day = app.copyDay ? dayInWords(app.copyDay) : ''
    return {
      ...COPY,
      line: `Din data är korrupt. Dashboarden ${where} visar senaste bra kopian, från ${day}.`,
    }
  })

  // === Logic ===

  onMount(() => {
    main?.focus()
  })

  // === Helpers ===

  /** The main button pressed: the copy taken, the onboarding begun, or the update fetched. Used by the main button */
  async function choose(): Promise<void> {
    if (app.recovery === 'bare') {
      app.startFresh()
      return
    }
    if (app.recovery === 'newer') {
      await openUrl(RELEASES)
      await getCurrentWindow().close()
      return
    }
    // "Använd kopian": a repair, not a welcome. The copy is saved and the panel closes as the menu closes, the screen
    // ready once it has folded
    await app.useCopy()
    app.stepPanel({ folded: true })
    setTimeout(() => app.unlock(), time('--speed-ui'))
  }

  /** A time token in milliseconds; 0 in Stilla, so the ending's steps all land at once, in order. Used by `choose` */
  function time(name: string): number {
    if (app.still) return 0
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) * 1000 || 0
  }
</script>

<div class="recovery">
  <div class="words">
    <h2>{words.title}</h2>
    <p class="line">{words.line}</p>
  </div>
  <div class="choices">
    <ChoiceButton label={words.main} onclick={choose} bind:this={main} />
    {#if words.importable}
      <!-- TODO: Importera works in Handover; until then greyed out, its tip still showing -->
      <ChoiceButton label="Importera" greyed tip="från fil" />
    {/if}
  </div>
  <p class="note">{words.note}</p>
</div>

<style>
  /* === Layout === */

  .recovery {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: var(--spacing-xl);
    padding: 0 var(--spacing-lg);
    text-align: center;
    letter-spacing: normal;
  }

  .words {
    display: grid;
    justify-items: center;
    gap: var(--spacing-md);
  }

  h2 {
    margin: 0;
    color: var(--menu-text);
    font-size: var(--text-size-heading);
    font-weight: var(--text-weight-heading);
  }

  .line,
  .note {
    max-width: 34ch; /* the most the words and the note take before they wrap */
    margin: 0;
    line-height: var(--leading-normal);
    text-wrap: balance;
  }

  .line {
    color: var(--menu-text);
    font-size: var(--text-size-body);
  }

  .note {
    color: var(--menu-text-muted);
    font-size: var(--text-size-label);
  }

  .choices {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }
</style>
