import { useParams } from 'common'
import {
  EmptyIntegrationConnection,
  IntegrationConnection,
} from 'components/interfaces/Integrations/IntegrationPanels'
import { GitHubConnection } from 'data/integrations/github-connections-query'
import { useSelectedOrganization } from 'hooks'
import { useSidePanelsStateSnapshot } from 'state/side-panels'
import {
  Badge,
  Button,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  FormItem_Shadcn_,
  FormMessage_Shadcn_,
  IconCheck,
  IconLoader,
  Input_Shadcn_,
  Modal,
  cn,
} from 'ui'

interface GithubRepositorySelectionProps {
  form: any
  isChecking: boolean
  isValid: boolean
  githubConnection?: GitHubConnection
}

const GithubRepositorySelection = ({
  form,
  isChecking,
  isValid,
  githubConnection,
}: GithubRepositorySelectionProps) => {
  const { ref } = useParams()
  const org = useSelectedOrganization()

  const sidePanels = useSidePanelsStateSnapshot()
  const githubIntegrationAppUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
      ? `https://github.com/apps/supabase/installations/new?state=${ref}`
      : process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'
        ? `https://github.com/apps/supabase-staging/installations/new?state=${ref}`
        : `https://github.com/apps/supabase-local-testing/installations/new?state=${ref}`

  function onSelectConnectRepo() {
    sidePanels.setGithubConnectionsOpen(true)
  }

  return (
    <div className="border-t border-b">
      <Modal.Content className="px-7">
        <div className="py-6">
          <div className="flex items-center space-x-2">
            <p>Git Connection</p>
            <Badge color="amber">Required</Badge>
          </div>
          <p className="text-sm text-foreground-light !mb-4">
            {githubConnection !== undefined
              ? 'Your database preview branches will be based on the branches in the following repository that your project is connected with:'
              : 'Your database preview branches will be based on the branches in the Git repository that your project is connected with.'}
          </p>

          {githubConnection ? (
            <>
              <ul className="mb-3">
                <IntegrationConnection
                  type={'GitHub'}
                  connection={{
                    id: String(githubConnection.id),
                    added_by: {
                      id: String(githubConnection.user?.id),
                      primary_email: githubConnection.user?.primary_email ?? '',
                      username: githubConnection.user?.username ?? '',
                    },
                    foreign_project_id: String(githubConnection.repository.id),
                    supabase_project_ref: githubConnection.project.ref,
                    organization_integration_id: 'unused',
                    inserted_at: githubConnection.inserted_at,
                    updated_at: githubConnection.updated_at,
                    metadata: {
                      name: githubConnection.repository.name,
                    } as any,
                  }}
                  showNode={false}
                  actions={
                    <Button type="default" onClick={() => onSelectConnectRepo()}>
                      Configure connection
                    </Button>
                  }
                  orientation="vertical"
                />
              </ul>

              <FormField_Shadcn_
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem_Shadcn_ className="relative">
                    <label className="text-sm text-foreground-light">
                      Choose your production branch
                    </label>
                    <FormControl_Shadcn_>
                      <Input_Shadcn_ {...field} placeholder="e.g main" />
                    </FormControl_Shadcn_>
                    <div className="absolute top-9 right-3">
                      {isChecking ? (
                        <IconLoader className="animate-spin" />
                      ) : isValid ? (
                        <IconCheck className="text-brand" strokeWidth={2} />
                      ) : null}
                    </div>

                    <FormMessage_Shadcn_ />
                  </FormItem_Shadcn_>
                )}
              />
            </>
          ) : (
            <EmptyIntegrationConnection
              showNode={false}
              onClick={() => onSelectConnectRepo()}
              orgSlug={org?.slug}
            />
          )}
        </div>
      </Modal.Content>
    </div>
  )
}

export default GithubRepositorySelection
