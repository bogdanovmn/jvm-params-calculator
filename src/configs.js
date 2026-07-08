import common from './presets/_common.js'

const modules = import.meta.glob('./presets/*.js', { eager: true, import: 'default' })

function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
      && target[key] && typeof target[key] === 'object'
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

function resolveParameter(entry) {
  if (typeof entry === 'string') {
    return { key: entry, ...common[entry] }
  }
  if (entry.ref) {
    return deepMerge({ key: entry.ref, ...common[entry.ref] }, entry)
  }
  return entry
}

export const configs = Object.entries(modules)
  .filter(([path]) => !path.includes('_common'))
  .map(([path, config]) => {
    const id = path.match(/\/presets\/(.+)\.js$/)[1]
    return {
      id,
      ...config,
      parameters: config.parameters.map(resolveParameter),
    }
  })
