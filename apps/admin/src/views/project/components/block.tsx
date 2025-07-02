import { NH2, NSpace, NTable, NTag } from 'naive-ui'

import AppCard from '@/components/app-card/index.vue'
import { ProjectEntity } from '@/service/project.entity'

interface Props {
  project: ProjectEntity
}

export function ProjectBlock(props: Props) {
  const item = ProjectEntity.statusMap.get(props.project.status)!

  return (
    <AppCard>
      <NSpace vertical>
        <NH2>项目信息</NH2>
        <NTable>
          <tbody>
            <tr>
              <td>项目名称</td>
              <td>{props.project.name}</td>
            </tr>
            <tr>
              <td>委托单位</td>
              <td>{props.project.client}</td>
            </tr>
            <tr>
              <td>项目所在地</td>
              <td>{props.project.location}</td>
            </tr>
            <tr>
              <td>进度状态</td>
              <td>
                <NTag type={item.type}>{item.text}</NTag>
              </td>
            </tr>
            <tr>
              <td>调查人员</td>
              <td>{props.project.members.map(item => item.nickname).join(',')}</td>
            </tr>
          </tbody>
        </NTable>
      </NSpace>
    </AppCard>
  )
}
