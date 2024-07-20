import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { handleError, post } from 'data/fetchers'
import type { ResponseError } from 'types'
import { integrationsDirectoryKeys } from './keys'

type IntegrationDirectoryEntryCreateVariables = {
  params: Record<string, any>
}

export async function createIntegrationDirectoryEntry({
  params,
}: IntegrationDirectoryEntryCreateVariables) {
  const { data, error } = await post('/platform/integrations-directory', {
    body: params as any,
  })

  if (error) handleError(error)
  return data
}

export type IntegrationDirectoryEntryCreateData = Awaited<
  ReturnType<typeof createIntegrationDirectoryEntry>
>

export const useIntegrationDirectoryEntryCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<
    IntegrationDirectoryEntryCreateData,
    ResponseError,
    IntegrationDirectoryEntryCreateVariables
  >,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()
  return useMutation<
    IntegrationDirectoryEntryCreateData,
    ResponseError,
    IntegrationDirectoryEntryCreateVariables
  >((vars) => createIntegrationDirectoryEntry(vars), {
    async onSuccess(data, variables, context) {
      await Promise.all([
        queryClient.invalidateQueries(integrationsDirectoryKeys.integrationsDirectoryList()),
      ])
      await onSuccess?.(data, variables, context)
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to add an entry to Integrations Directory: ${data.message}`)
      } else {
        onError(data, variables, context)
      }
    },
    ...options,
  })
}
