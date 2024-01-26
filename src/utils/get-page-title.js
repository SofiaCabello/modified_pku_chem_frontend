import defaultSettings from '@/settings'

const title = defaultSettings.title || '医药商店数据管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
