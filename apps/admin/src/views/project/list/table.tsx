import { type DataTableColumn, NButton, NSpace, NTag } from 'naive-ui'
import { RouterLink } from 'vue-router'

import { ProjectEntity } from '@/service/project.entity'

interface ColumnAction {
  del(row: ProjectEntity, rowIndex: number): void
}

export function createTableColumns(action: ColumnAction) {
  const columns: DataTableColumn<ProjectEntity>[] = [
    {
      title: 'No',
      width: 50,
      key: 'no',
      render(row, index) {
        return <span>{index + 1}</span>
      }
    },
    {
      title: '项目名称',
      key: 'name'
    },
    {
      title: '项目状态',
      key: 'status',
      render(row) {
        const item = ProjectEntity.statusMap.get(row.status)!
        return <NTag type={item.type}>{item.text}</NTag>
      }
    },
    {
      title: '创建时间',
      key: 'create_at'
    },
    {
      title: '创建时间',
      key: 'update_at'
    },
    {
      title: '操作',
      width: 120,
      key: 'operation',
      render(row, rowIndex) {
        return (
          <NSpace>
            <RouterLink to={`/project/detail/${row.id}`}>
              <NButton>查看</NButton>
            </RouterLink>
            <RouterLink to={`/project/action?type=edit&id=${row.id}`}>
              <NButton type='primary'>编辑</NButton>
            </RouterLink>
            <NButton type='warning' onClick={() => action.del(row, rowIndex)}>
              删除
            </NButton>
          </NSpace>
        )
      }
    }
  ]

  return columns
}
