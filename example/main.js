import Sippycup from '@travisdoesmath/sippycup'
import { htmlSrc, pythonSrc, cssSrc } from './src.js'

const stdout = (msg) => {
  console.debug('STDOUT: ', msg)
};

const sippycup = new Sippycup(stdout)
await sippycup.initialize()

Promise.all([
  sippycup.addFile('index.html', 'templates', htmlSrc),
  sippycup.addFile('app.py', '', pythonSrc),
  sippycup.addFile('style.css', 'static', cssSrc)
])
  .then(() => {
    sippycup.startApp()
  })
  .then(() => {
    return sippycup.request('/')
  })
  .then((response) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('srcdoc', response.content)
    document.querySelector('body').append(iframe)
  })
