import LoadingOpacity from 'components/ui/LoadingOpacity'
import ShimmerLine from 'components/ui/ShimmerLine'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from 'ui'
import { LogTable } from '../Settings/Logs'
import {
  useWarehouseQueryQuery,
  useWarehouseCollectionsQuery,
  useWarehouseAccessTokensQuery,
} from 'data/analytics'
import Link from 'next/link'
import { TestCollectionDialog } from './TestCollectionDialog'
import { HardDriveUpload, RefreshCcw, Rewind } from 'lucide-react'
import toast from 'react-hot-toast'

export const WarehouseCollectionDetail = () => {
  const router = useRouter()
  const collectionToken = router.query.collectionToken as string
  const projectRef = router.query.ref as string
  const accessTokens = useWarehouseAccessTokensQuery({ projectRef })
  const [testDialogOpen, setTestDialogOpen] = useState(false)

  const { data: collections, isLoading: collectionsLoading } = useWarehouseCollectionsQuery(
    { projectRef },
    { enabled: true }
  )
  const collection = (collections || []).find((c) => c.token === collectionToken)
  const [params, setParams] = useState({
    sql: `select current_timestamp() as 'time'`,
  })

  const [pagination, setPagination] = useState({
    limit: 100,
    offset: 0,
  })

  useEffect(() => {
    if (collection) {
      setParams((prevParams) => ({
        ...prevParams,
        sql: `
        select id, timestamp, event_message from \`${collection.name}\`
        where timestamp > timestamp_sub(current_timestamp(), interval 7 day)
        order by timestamp desc limit ${pagination.limit} offset ${pagination.offset}
        `,
      }))
    }
  }, [collection, pagination])

  const {
    isLoading: queryLoading,
    data: queryData,
    isError,
    refetch,
    isRefetching,
  } = useWarehouseQueryQuery(
    { ref: projectRef, sql: params.sql },
    {
      enabled: !!params.sql,
    }
  )

  useEffect(() => {
    if (isError) {
      toast.error('Error loading collection data')
    }
  }, [isError])

  const formatResults = (results: any) => {
    if (!results || !results.length) {
      return []
    }

    const r = results.map(({ timestamp, ...r }: any) => {
      return {
        timestamp: new Date(timestamp / 1000).toLocaleString(),
        ...r,
      }
    })

    return r
  }

  const results = formatResults(queryData?.data?.result)

  function loadOlder() {
    setPagination({ ...pagination, offset: pagination.offset + pagination.limit })
  }

  const isLoading = queryLoading || collectionsLoading || isRefetching

  return (
    <>
      <div className="relative flex flex-col flex-grow h-full">
        <ShimmerLine active={isLoading} />
        <LoadingOpacity active={isLoading}>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center pr-3">
              <h2 className="p-3">{collection?.name}</h2>
              <div className="flex items-center gap-2">
                <Button asChild type={'text'}>
                  <Link href={`/project/${projectRef}/logs/collections/access-tokens`}>
                    Access tokens
                  </Link>
                </Button>

                <TestCollectionDialog
                  accessTokens={accessTokens.data?.data || []}
                  collectionToken={collectionToken}
                  projectRef={projectRef}
                  collections={collections || []}
                  open={testDialogOpen}
                  onOpenChange={setTestDialogOpen}
                />
              </div>
            </div>
            <LogTable
              collectionName={collection?.name}
              queryType="warehouse"
              hasEditorValue={false}
              projectRef={projectRef}
              isLoading={isLoading}
              data={results}
              params={params}
              error={isError ? 'Error loading data' : undefined}
              maxHeight="calc(100vh - 139px)"
              hideHeader={true}
              emptyState={
                <div className="text-left space-y-4">
                  <HardDriveUpload className="text-brand" />
                  <div>
                    <h1 className="text-lg text-foreground">Send your first event</h1>
                    <p className="text-sm text-foreground-lighter">
                      Events sent to this collection will appear here
                    </p>
                  </div>
                  <Button onClick={() => setTestDialogOpen(true)}>Send your first event</Button>
                </div>
              }
            />
          </div>
        </LoadingOpacity>

        {!isError && (
          <div className="border-t flex flex-row justify-between p-2">
            <div className="flex items-center gap-2">
              {results.length > 0 && (
                <>
                  <Button
                    onClick={loadOlder}
                    icon={<Rewind />}
                    type="default"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Load older
                  </Button>
                </>
              )}
              {pagination.offset !== 0 && (
                <>
                  <Button
                    onClick={() => setPagination({ ...pagination, offset: 0 })}
                    type="default"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Load latest
                  </Button>
                </>
              )}
            </div>
            <Button
              onClick={() => refetch()}
              icon={<RefreshCcw />}
              type="default"
              loading={isLoading}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
