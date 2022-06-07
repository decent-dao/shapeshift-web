import { ChainAdapter } from '@shapeshiftoss/chain-adapters'
import { ChainTypes } from '@shapeshiftoss/types'
import { getConfig } from 'config'
import * as guarded from 'config/guarded'
import type { ScreamingSnakeCase } from 'type-fest'
import { logger } from 'lib/logger'
import { FeatureFlags } from 'state/slices/preferencesSlice/preferencesSlice'

import { Route } from '../Routes/helpers'

const moduleLogger = logger.child({ namespace: ['PluginManager'] })

async function getActivePlugins() {
  return await Promise.all([
    import('./bitcoin'),
    import('./cosmos'),
    import('./ethereum'),
    import('./foxPage'),
    import('./osmosis'),
    import('./pendo'),
  ])
}

export type Plugins = [chainId: string, chain: Plugin][]
export type RegistrablePlugin = {
  register: () => Plugins
  pluginName: string
}

export interface Plugin {
  name: string
  icon?: JSX.Element
  featureFlag?: keyof FeatureFlags
  providers?: {
    chainAdapters?: Array<[ChainTypes, () => ChainAdapter<ChainTypes>]>
  }
  routes?: Route[]
}

export class PluginManager {
  #pluginManager = new Map<string, Plugin>()

  clear(): void {
    this.#pluginManager.clear()
  }

  register<T extends RegistrablePlugin>(plugin: T): void {
    for (const [pluginId, pluginManifest] of plugin.register()) {
      if (this.#pluginManager.has(pluginId)) {
        throw new Error('PluginManager: Duplicate pluginId')
      }
      this.#pluginManager.set(pluginId, pluginManifest)
    }
  }

  keys(): string[] {
    return [...this.#pluginManager.keys()]
  }

  entries(): [string, Plugin][] {
    return [...this.#pluginManager.entries()]
  }
}

// @TODO - In the future we may want to create a Provider for this
// if we need to support features that require re-rendering. Currently we do not.
export const pluginManager = new PluginManager()

function toScreamingSnakeCase<T extends string>(x: T): ScreamingSnakeCase<T> {
  return x.replace(/[A-Z]/g, x => `_${x.toLowerCase()}`).toUpperCase() as ScreamingSnakeCase<T>
}

export async function registerPlugins() {
  pluginManager.clear()

  const activePlugins = await getActivePlugins()
  for (const plugin of activePlugins) {
    try {
      const pluginNameEnvVar = `REACT_APP_PLUGIN_${toScreamingSnakeCase(
        plugin.pluginName,
      )}` as const
      const pluginEnabled = getConfig({
        [pluginNameEnvVar]: guarded.bool({ default: false }),
      })
      if (pluginEnabled) {
        pluginManager.register(plugin)
        moduleLogger.trace({ fn: 'registerPlugins', pluginManager, plugin }, 'Registered Plugin')
      }
    } catch (e) {
      moduleLogger.error(e, { fn: 'registerPlugins', pluginManager }, 'Register Plugins')
    }
  }

  moduleLogger.debug(
    { pluginManager, plugins: pluginManager.keys() },
    'Plugins Registration Completed',
  )
}
