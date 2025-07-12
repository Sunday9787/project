<template lang="pug">
app-view
  transition(name="fade" mode="out-in")
    app-skeleton(v-if="loading")
    project-block(:project="entity" v-else)
</template>

<script setup lang="ts">
import { ProjectBlock } from '../components/block'
import { useProject } from './hooks'

defineOptions({ name: 'AppProjectDetail' })

interface Props {
  id: number
}

const props = defineProps<Props>()
const { entity, loading } = useProject({ id: props.id, type: 'detail' })
</script>
