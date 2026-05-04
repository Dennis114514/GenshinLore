import { useData } from 'vitepress'
import { computed } from 'vue'
import { FilePageParams } from '../../types/params'

export default function useFilePage() {
  const { params } = useData()

  return computed(() => (params.value?.file ? (params.value as FilePageParams) : undefined))
}
