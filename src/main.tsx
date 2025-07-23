import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { Toaster } from 'sonner'

render(<><App /><Toaster /></>, document.getElementById('app')!)
