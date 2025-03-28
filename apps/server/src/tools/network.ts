import os from 'node:os'

export function getIpAddress() {
  let v4 = 'localhost'
  let v6 = '::'

  const interfaces = os.networkInterfaces()
  for (const iface of Object.values(interfaces)) {
    for (const details of iface || []) {
      if (details.family === 'IPv6' && !details.internal) {
        v6 = details.address
      }

      if (details.family === 'IPv4' && !details.internal) {
        v4 = details.address
      }
    }
  }

  return {
    v4,
    v6
  }
}
