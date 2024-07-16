import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button, PopoverContent_Shadcn_, PopoverTrigger_Shadcn_, Popover_Shadcn_, cn } from 'ui'

import { useProjectLintsQuery } from 'data/lint/lint-query'
import { useSelectedProject } from 'hooks'
import Link from 'next/link'
import { WarningIcon } from 'ui-patterns/Icons/StatusIcons'

export const SecurityStatus = () => {
  const project = useSelectedProject()
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useProjectLintsQuery({
    projectRef: project?.ref,
  })

  const securityLints = (data ?? []).filter(
    (lint) =>
      lint.categories.includes('SECURITY') && (lint.level === 'ERROR' || lint.level === 'WARN')
  )

  const noIssuesFound = securityLints.length === 0

  return (
    <Popover_Shadcn_ modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger_Shadcn_ asChild>
        <Button
          type="default"
          icon={
            isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div
                className={cn(
                  `w-2 h-2 rounded-full`,
                  noIssuesFound ? 'bg-brand' : 'bg-destructive-600'
                )}
              />
            )
          }
        >
          Security Issues
        </Button>
      </PopoverTrigger_Shadcn_>
      <PopoverContent_Shadcn_
        className={`py-1.5 px-0 ${noIssuesFound ? 'w-64' : 'w-84'}`}
        side="bottom"
        align="center"
      >
        <div className="px-4 py-2 text-sm flex gap-3">
          {noIssuesFound ? (
            <CheckCircle2 className="text-brand shrink-0" size={18} strokeWidth={1.5} />
          ) : (
            <WarningIcon className="shrink-0" />
          )}

          <div className="flex flex-col gap-y-3 -mt-1">
            {noIssuesFound ? (
              <div className="flex flex-col gap-y-1">
                <p className="text-xs">No security issues found</p>
                <p className="text-xs text-foreground-light">
                  Keep monitoring Security Advisor for updates as your project grows.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-y-1">
                <p className="text-xs">
                  {securityLints.length} security issues requiring urgent attention
                </p>
                <p className="text-xs text-foreground-light">
                  Check the Security Advisor to address them
                </p>
              </div>
            )}

            <Button asChild type="default" className="w-min">
              <Link href={`/project/${project?.ref}/database/security-advisor`}>
                Head to Security Advisor
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent_Shadcn_>
    </Popover_Shadcn_>
  )
}
