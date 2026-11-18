<!--
  The screen for a record that cannot be read ("A record that cannot be read offers the newest copy"), in the menu's
  panel locked open: what happened, what is offered, the choices and a quiet note, centred. A broken file with a copy
  offers "Använd kopian", the dashboard showing the copy meanwhile; one without a copy offers "Starta nytt", the
  onboarding from its balance; a newer record offers "Hämta senaste", which opens the releases page and closes the app.
  "Importera" is greyed out until Handover. "Använd kopian" saves the copy, and the panel turns to frost and folds.
-->
<script lang="ts" module>
  /** The window width under which the sides stack, as App.svelte's media query has it; CSS cannot read a token there */
  const NARROW = '(max-width: 640px)'

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
  import ChoiceButton from './ChoiceButton.svelte'

  // === State ===

  let main: ChoiceButton | undefined = $state()
  let fading = $state(false)
  /** Whether the window is narrow, where the dashboard sits on top instead of to the right */
  let narrow = $state(matchMedia(NARROW).matches)

  let words = $derived.by(() => {
    if (app.recovery === 'newer') return NEWER
    if (app.recovery === 'bare') return BARE
    const where = narrow ? 'ovanför' : 'till höger'
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

  $effect(() => {
    const query = matchMedia(NARROW)
    const follow = (): void => {
      narrow = query.matches
    }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
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
    // "Använd kopian": the words fade, the copy is saved, the panel turns to frost and folds, as the onboarding's ends
    fading = true
    await app.useCopy()
    const fade = time('--speed-ui')
    const frostIn = time('--onboarding-frost-in')
    setTimeout(() => app.stepPanel({ frosted: true }), fade)
    setTimeout(() => app.stepPanel({ folded: true }), fade + frostIn)
    setTimeout(() => app.unlock(), fade + frostIn + fade)
  }

  /** A time token in milliseconds. Used by `choose` */
  function time(name: string): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) * 1000 || 0
  }
</script>

<div class="recovery" class:fading>
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
    gap: var(--recovery-gap);
    padding: 0 var(--menu-inset);
    text-align: center;
    letter-spacing: normal;
    transition: opacity var(--speed-ui) ease;
  }

  .words {
    display: grid;
    justify-items: center;
    gap: var(--block-gap);
  }

  h2 {
    margin: 0;
    color: var(--menu-text);
    font-size: var(--onboarding-prompt-size);
    font-weight: var(--onboarding-prompt-weight);
  }

  .line,
  .note {
    max-width: var(--recovery-width);
    margin: 0;
    line-height: 1.45;
    text-wrap: balance;
  }

  .line {
    color: var(--menu-text);
    font-size: var(--recovery-line-size);
  }

  .note {
    color: var(--menu-text-muted);
    font-size: var(--text-size-note);
  }

  .choices {
    display: flex;
    justify-content: center;
    gap: var(--block-gap);
  }

  /* === States === */

  .fading {
    opacity: 0;
  }
</style>
