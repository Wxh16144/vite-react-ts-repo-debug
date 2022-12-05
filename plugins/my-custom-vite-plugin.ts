import { Plugin, build as vite } from 'vite'
import path from 'path'
import vm from 'vm'
import fs from 'fs-extra'

const resolveCwd = (...arg) => path.resolve(process.cwd(), ...arg);
const globalName = '__value__';

const build = async () => {
  const result = await vite({
    configFile: false,
    mode: 'custom',
    build: {
      write: false,
      lib: {
        entry: resolveCwd('src/global/index.ts'),
        name: globalName,
        formats: ['iife']
      }
    }
  })
  return result?.[0]?.output?.[0]?.code;
}

const transform = async (code) => {
  let sandbox = { [globalName]: { hello: 'default' } }
  const script = new vm.Script(code);
  script.runInNewContext(sandbox)
  return sandbox[globalName];
}

const write = async () => {
  const code = await build();
  const content = await transform(code);
  const output = resolveCwd('dist');

  !fs.existsSync(output) && await fs.mkdirSync(output);
  fs.writeJSON(
    `${output}/globalValue.json`,
    content,
    { spaces: 2 }
  )
}

export default function myCustomVitePlugin(): Plugin {
  return {
    name: 'my-custom-vite-plugin',
    configResolved() {
      write()
    }
  }
}