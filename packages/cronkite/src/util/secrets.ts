export function pruneEnv () {
  Object.keys(process.env).forEach(key => {
    if (key.match(/cronkite|postgres|mb_key/i)) delete process.env[key]
  })
}
