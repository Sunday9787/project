import { type MenuOption, NIcon, NLayoutSider, NMenu } from 'naive-ui'
import { h } from 'vue'
import { type RouteRecordRaw, RouterLink, useRoute, useRouter } from 'vue-router'

import { useSystemModule } from '@/store/modules/system'

import LayoutSiderLogo from './layout-sider-logo.vue'

function renderIcon(icon: Component) {
  return h(NIcon, null, { default: () => h(icon) })
}

function serializePath(path: string, base?: string) {
  return base ? [base, path].join('/') : path
}

function buildMenu(data: ReadonlyArray<RouteRecordRaw>, baseKey?: string): MenuOption[] {
  const result: MenuOption[] = []

  for (const item of data) {
    if (!item.meta) continue
    if (item.meta.hidden) continue

    const key = serializePath(item.path, baseKey)

    const menu: MenuOption = {
      label() {
        if (item.meta!.noShowingChildren || !item.children || !item.children.length) {
          return <RouterLink to={key}>{item.meta?.title}</RouterLink>
        }

        return item.meta?.title
      },
      icon() {
        if (item.meta?.icon) {
          return renderIcon(item.meta.icon)
        }
      },
      key
    }

    result.push(menu)

    if (item.meta.noShowingChildren) continue
    if (item.children) {
      const children = buildMenu(item.children, menu.key as string)
      if (children.length) menu.children = children
    }
  }

  return result
}

export default defineComponent({
  name: 'PageLayoutSider',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const systemModule = useSystemModule()
    const menuOptions = computed(() => {
      return buildMenu(router.options.routes)
    })

    const activeMenu = computed(() => {
      return route.meta.activeMenu!
    })

    const collapse = computed(() => systemModule.sidebar.collapse)
    const theme = computed(() => systemModule.theme.mode)

    return { activeMenu, menuOptions, collapse, theme }
  },
  render() {
    return (
      <NLayoutSider
        collapsed={this.collapse}
        collapseMode='width'
        nativeScrollbar={false}
        collapsedWidth={64}
        width={240}
        bordered>
        <LayoutSiderLogo collapse={this.collapse} theme={this.theme} />
        <NMenu value={this.activeMenu} options={this.menuOptions} collapsedWidth={64} collapsedIconSize={22} />
      </NLayoutSider>
    )
  }
})
