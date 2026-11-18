import { mount } from 'svelte'
import './styles/design-tokens.css'
import './styles/base.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
