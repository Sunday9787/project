import { useRouter } from 'vue-router'
type StepInst = { validate(): Promise<void>; save(): void }

export interface StepComponent<C> {
  component: C
  hidden?: boolean
  title: string
}

export function useStep<C extends string, T = StepComponent<C>>(
  componentMap: Map<number, T>,
  onSave: (...args: unknown[]) => unknown
) {
  const step = ref(1)
  const nextStepLoading = ref(false)
  const stepInst = shallowRef<StepInst>()
  const router = useRouter()

  const current = computed<T>({
    get() {
      return componentMap.get(step.value)!
    },
    set(val) {
      console.log('current set', val)
    }
  })

  async function nextStep() {
    nextStepLoading.value = true

    if (!stepInst.value) {
      throw new Error('stepInst 未找到')
    }

    try {
      await stepInst.value.validate()
      stepInst.value.save()
      step.value += 1
    } finally {
      nextStepLoading.value = false
    }
  }

  function prevStep() {
    step.value -= 1
  }

  async function save(...args: unknown[]) {
    if (!stepInst.value) {
      throw new Error('stepInst 未找到')
    }

    await stepInst.value.validate()
    stepInst.value.save()
    await onSave(...args)
    router.back()
  }

  return {
    step,
    nextStepLoading,
    nextStep,
    stepInst,
    current,
    prevStep,
    save
  }
}
