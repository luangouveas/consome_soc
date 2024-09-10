import { Either } from '@/utils/Either'
import { AppType } from '@/main/app'

export type Job = {
  name: string
  frequence: string
  active: boolean
  handle: (app: AppType) => Promise<void>
}
