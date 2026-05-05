/**
 * 导航栏标签
 * @param label 名称
 * @param secondaryClass 内部标识名称，在.md文件的frontmatter处写相同的字段，导航栏游标将固定到该标签下
 */
export interface NavData {
  label: string
  secondaryClass: string
}

export const navData: NavData[] = [
  { label: '首页', secondaryClass: '/home' },
  { label: '前言', secondaryClass: '/preface' },
  { label: '基本设定', secondaryClass: '/basiclore' },
  { label: '提瓦特历史', secondaryClass: '/teyvathis' },
  { label: '各国历史', secondaryClass: '/nations' },
  { label: '时间线', secondaryClass: '/timeline' },
  { label: '关于手册', secondaryClass: '/about' },
  { label: '关于本站', secondaryClass: '/aboutsite' },
]
