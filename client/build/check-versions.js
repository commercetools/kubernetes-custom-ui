'use strict'

const chalk = require('chalk')
const semver = require('semver')
const packageConfig = require('../package.json')
const shell = require('shelljs')

function exec (cmd) {
  return require('child_process')
    .execSync(cmd)
    .toString()
    .trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node,
  },
]

if (shell.which('npm'))
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm,
  })

/**
 * Checks the version of your node/npm, and compare them to the ones set in the engines section within the package.json.
 *
 * If it's not met, logs out a warning
 */
module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement))
      warnings.push(`${mod.name
      }: ${
        chalk.red(mod.currentVersion)
      } should be ${
        chalk.green(mod.versionRequirement)}`)
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log(`  ${warning}`)
    }

    console.log()
    process.exit(1)
  }
}
