import { promises as fs } from 'fs'
import * as common from './common'
import bluebird from 'bluebird'
import execa from 'execa'
import path from 'path'

const LOG_PREFIX = 'informed-citizen-builder ::'
const log = (...args: any[]) => console.log(LOG_PREFIX, ...args)
const readJson = (filename: string) =>
  fs.readFile(filename).then(buf => JSON.parse(buf.toString()))

class BuildTask {
  name: string
  dependencies: BuildTask[]
  dirname: string
  _building?: Promise<any>
  constructor (opts: {
    dependencies: BuildTask[]
    dirname: string
    name: string
  }) {
    this.name = opts.name
    this.dependencies = opts.dependencies
    this.dirname = opts.dirname
  }
  async build () {
    if (this._building) return this._building
    log(`[${this.name}] starting ${this.dependencies.length} dependent builds`)
    this._building = this.buildDependenciesAndSelf()
    await this._building
    return this._building
  }
  async buildDependenciesAndSelf () {
    await Promise.all(this.dependencies.map(dep => dep.build()))
    log(`[${this.name}] starting self build @ ${this.dirname}`)
    await execa('yarn', ['build'], { cwd: this.dirname, stdio: 'inherit' })
    log(`[${this.name}] complete`)
  }
}

async function build () {
  const filenames = (await fs.readdir(common.PROJECT_PACKAGES_DIRNAME)).map(
    basename => path.resolve(common.PROJECT_PACKAGES_DIRNAME, basename)
  )
  const packageDirnames = await bluebird.filter(filenames, async filename => {
    const isDir = await fs.stat(filename).then(stat => stat.isDirectory())
    if (!isDir) return false
    const packageJsonFilename = path.resolve(filename, 'package.json')
    return !!(await fs.stat(packageJsonFilename).catch(() => false))
  })
  const pkgJsonsByProjectName: { [name: string]: any } = await bluebird.reduce(
    packageDirnames,
    async (agg, dirname) => ({
      ...agg,
      ...{
        [path.basename(dirname)]: {
          dirname: dirname,
          package: await readJson(path.resolve(dirname, 'package.json'))
        }
      }
    }),
    {}
  )
  const commonIC = new BuildTask({
    name: pkgJsonsByProjectName.common.package.name,
    dependencies: [],
    dirname: pkgJsonsByProjectName.common.dirname
  })
  const cronkite = new BuildTask({
    dependencies: [commonIC],
    name: pkgJsonsByProjectName.cronkite.package.name,
    dirname: pkgJsonsByProjectName.cronkite.dirname
  })

  // build root project
  await cronkite.build()
}
build()
