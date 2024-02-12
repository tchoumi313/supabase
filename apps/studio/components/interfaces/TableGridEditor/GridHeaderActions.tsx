import * as Tooltip from '@radix-ui/react-tooltip'
import type { PostgresTable } from '@supabase/postgres-meta'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { useParams } from 'common'
import { MousePointer2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Button,
  IconLock,
  IconPlusCircle,
  Modal,
  PopoverContent_Shadcn_,
  PopoverTrigger_Shadcn_,
  Popover_Shadcn_,
} from 'ui'

import { rlsAcknowledgedKey } from 'components/grid/constants'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import APIDocsButton from 'components/ui/APIDocsButton'
import ConfirmationModal from 'components/ui/ConfirmationModal'
import { useDatabasePoliciesQuery } from 'data/database-policies/database-policies-query'
import { useDatabasePublicationsQuery } from 'data/database-publications/database-publications-query'
import { useDatabasePublicationUpdateMutation } from 'data/database-publications/database-publications-update-mutation'
import { useCheckPermissions, useIsFeatureEnabled, useStore } from 'hooks'
import { RoleImpersonationPopover } from '../RoleImpersonationSelector'

import ConfirmModal from 'components/ui/Dialogs/ConfirmDialog'
import { useQueryClient } from '@tanstack/react-query'

import { useTableUpdateMutation } from 'data/tables/table-update-mutation'

export interface GridHeaderActionsProps {
  table: PostgresTable
}

const GridHeaderActions = ({ table }: GridHeaderActionsProps) => {
  const { ref } = useParams()
  const { project } = useProjectContext()
  const realtimeEnabled = useIsFeatureEnabled('realtime:all')

  const { mutate: updateTable } = useTableUpdateMutation({
    onError: (error) => {
      toast.error(`Failed to toggle RLS: ${error.message}`)
    },
    onSettled: () => {
      closeConfirmModal()
    },
  })

  const { ui, meta } = useStore()
  const queryClient = useQueryClient()

  const [showEnableRealtime, setShowEnableRealtime] = useState(false)
  const [open, setOpen] = useState(false)
  const [rlsConfirmModalOpen, setRlsConfirmModalOpen] = useState(false)

  const projectRef = project?.ref
  const { data } = useDatabasePoliciesQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const policies = (data ?? []).filter(
    (policy) => policy.schema === table.schema && policy.table === table.name
  )

  const { data: publications } = useDatabasePublicationsQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const realtimePublication = (publications ?? []).find(
    (publication) => publication.name === 'supabase_realtime'
  )
  const realtimeEnabledTables = realtimePublication?.tables ?? []
  const isRealtimeEnabled = realtimeEnabledTables.some((t: any) => t.id === table?.id)

  const { mutate: updatePublications, isLoading: isTogglingRealtime } =
    useDatabasePublicationUpdateMutation({
      onSuccess: () => {
        setShowEnableRealtime(false)
      },
      onError: (error) => {
        toast.error(`Failed to toggle realtime for ${table.name}: ${error.message}`)
      },
    })

  const canSqlWriteTables = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
  const canSqlWriteColumns = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'columns')
  const isReadOnly = !canSqlWriteTables && !canSqlWriteColumns
  // This will change when we allow autogenerated API docs for schemas other than `public`
  const doesHaveAutoGeneratedAPIDocs = table.schema === 'public'

  const toggleRealtime = async () => {
    if (!project) return console.error('Project is required')
    if (!realtimePublication) return console.error('Unable to find realtime publication')

    const exists = realtimeEnabledTables.some((x: any) => x.id == table.id)
    const tables = !exists
      ? [`${table.schema}.${table.name}`].concat(
          realtimeEnabledTables.map((t: any) => `${t.schema}.${t.name}`)
        )
      : realtimeEnabledTables
          .filter((x: any) => x.id != table.id)
          .map((x: any) => `${x.schema}.${x.name}`)

    updatePublications({
      projectRef: project?.ref,
      connectionString: project?.connectionString,
      id: realtimePublication.id,
      tables,
    })
  }

  const closeConfirmModal = () => {
    setRlsConfirmModalOpen(false)
  }
  const onToggleRLS = async () => {
    const payload = {
      id: table.id,
      rls_enabled: !table.rls_enabled,
    }

    updateTable({
      projectRef: project?.ref!,
      connectionString: project?.connectionString,
      id: payload.id,
      schema: table.schema,
      payload: payload,
    })
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        {isReadOnly && (
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger className="w-full">
              <div className="border border-strong rounded bg-overlay-hover px-3 py-1 text-xs">
                Viewing as read-only
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-alternative py-1 px-2 leading-none shadow',
                    'border border-background',
                  ].join(' ')}
                >
                  <span className="text-xs text-foreground">
                    You need additional permissions to manage your project's data
                  </span>
                </div>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        )}
        {table.rls_enabled ? (
          <div className="flex items-center gap-1">
            {policies.length < 1 ? (
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger className="w-full">
                  <Link passHref href={`/project/${projectRef}/auth/policies?search=${table.id}`}>
                    <Button
                      type="default"
                      className="group !h-[28px] !py-0"
                      icon={<IconPlusCircle size={12} />}
                    >
                      Add RLS policy
                    </Button>
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="bottom">
                    <Tooltip.Arrow className="radix-tooltip-arrow" />
                    <div
                      className={[
                        'rounded bg-alternative py-1 px-2 leading-none shadow',
                        'border border-background',
                      ].join(' ')}
                    >
                      <div className="text-xs text-foreground p-1 leading-relaxed">
                        <p>RLS is enabled for this table, but no policies are set. </p>
                        <p>
                          Select queries will return an <u>empty array</u> of results.
                        </p>
                      </div>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ) : (
              <Link passHref href={`/project/${projectRef}/auth/policies?search=${table.id}`}>
                <Button
                  type={policies.length < 1 ? 'warning' : 'default'}
                  className="group !h-[28px] !py-0"
                  icon={
                    policies.length > 0 ? (
                      <span className="text-right text-xs rounded-xl px-2 py-0.5 bg-surface-200 dark:bg-surface-100 text-brand-1100">
                        {policies.length}
                      </span>
                    ) : (
                      <IconPlusCircle size={12} />
                    )
                  }
                >
                  Auth {policies.length > 1 ? 'policies' : 'policy'}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <Popover_Shadcn_ open={open} onOpenChange={() => setOpen(!open)} modal={false}>
            <PopoverTrigger_Shadcn_ asChild>
              <Button type="warning" icon={<IconLock size={15} />}>
                RLS disabled
              </Button>
            </PopoverTrigger_Shadcn_>
            <PopoverContent_Shadcn_ className="min-w-[395px] text-sm" align="end">
              <h3 className="flex items-center gap-2">
                <IconLock size={14} /> Row Level Security (RLS)
              </h3>
              <div className="grid gap-2 mt-4">
                <p>
                  You can restrict and control who can read, write and update data in this table
                  using Row Level Security.
                </p>
                <p>
                  With RLS enabled, anonymous users will not be able to read/write data in the
                  table.
                </p>
                <div className="mt-2">
                  <Button
                    type="default"
                    onClick={() => setRlsConfirmModalOpen(!rlsConfirmModalOpen)}
                  >
                    Enable RLS for this table{' '}
                  </Button>
                </div>
              </div>
            </PopoverContent_Shadcn_>
          </Popover_Shadcn_>
        )}

        <RoleImpersonationPopover serviceRoleLabel="postgres" />

        {realtimeEnabled && (
          <Button
            type="default"
            icon={
              <MousePointer2
                size={14}
                className={isRealtimeEnabled ? 'text-brand' : 'text-lighter'}
              />
            }
            onClick={() => setShowEnableRealtime(true)}
          >
            Realtime {isRealtimeEnabled ? 'on' : 'off'}
          </Button>
        )}

        {doesHaveAutoGeneratedAPIDocs && (
          <div className="mt-[1px]">
            <APIDocsButton section={['entities', table.name]} />
          </div>
        )}
      </div>

      <ConfirmationModal
        visible={showEnableRealtime}
        loading={isTogglingRealtime}
        header={`${isRealtimeEnabled ? 'Disable' : 'Enable'} realtime for ${table.name}`}
        buttonLabel={`${isRealtimeEnabled ? 'Disable' : 'Enable'} realtime`}
        buttonLoadingLabel={`${isRealtimeEnabled ? 'Disabling' : 'Enabling'} realtime`}
        onSelectCancel={() => setShowEnableRealtime(false)}
        onSelectConfirm={() => toggleRealtime()}
      >
        <Modal.Content className="py-4 space-y-2">
          <p className="text-sm">
            Once realtime has been {isRealtimeEnabled ? 'disabled' : 'enabled'}, the table will{' '}
            {isRealtimeEnabled ? 'no longer ' : ''}broadcast any changes to authorized subscribers.
          </p>
          {!isRealtimeEnabled && (
            <p className="text-sm">
              You may also select which events to broadcast to subscribers on the{' '}
              <Link href={`/project/${ref}/database/replication`} className="text-brand">
                database replication
              </Link>{' '}
              settings.
            </p>
          )}
        </Modal.Content>
      </ConfirmationModal>

      <ConfirmModal
        danger={table.rls_enabled}
        visible={rlsConfirmModalOpen}
        title="Confirm to enable Row Level Security"
        description="Are you sure you want to enable Row Level Security for this table?"
        buttonLabel="Enable RLS"
        buttonLoadingLabel="Updating"
        onSelectCancel={closeConfirmModal}
        onSelectConfirm={onToggleRLS}
      />
    </>
  )
}

export default GridHeaderActions
