import defaultSettings from '@/settings'

const title = defaultSettings.title || 'RESIM@PKU'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
