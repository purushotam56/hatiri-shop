import { UAParser } from 'ua-parser-js'

export default function getUserAgentInfo(userAgent: string, platform: string) {
  const parsedUserAgent = UAParser(userAgent)

  const { device } = parsedUserAgent

  return {
    isMobile: device.is('mobile') || platform === 'ios' || platform === 'android',
  }
}
