import { cn } from 'ui'
import useConfData from '~/components/LaunchWeek/hooks/use-conf-data'

export default function TicketProfile({ className }: { className?: string }) {
  const { userData: user } = useConfData()
  const { username, name, metadata, platinum, secret: hasSecretTicket } = user
  const hasLightTicket = platinum

  const HAS_ROLE = !!metadata?.role
  const HAS_COMPANY = !!metadata?.company
  const HAS_NO_META = !HAS_ROLE && !HAS_COMPANY

  return (
    <div className={cn('relative z-10 flex gap-4', className)}>
      <div
        className={cn(
          'text-foreground-light flex flex-col gap-1 text-left text-xl md:max-w-[300px] mb-8',
          hasLightTicket ? 'text-[#1c1c1c]' : 'text-white',
          hasSecretTicket && '!text-white'
        )}
      >
        <p className={cn('text-4xl leading-[105%]')}>{name || username || 'Your Name'}</p>
        {HAS_NO_META && username && (
          <p className={cn('text-foreground-lighter', hasSecretTicket && '!text-white')}>
            @{username}
          </p>
        )}
        <div className={cn('text-foreground-lighter', hasSecretTicket && '!text-white')}>
          {HAS_ROLE && <span>{metadata?.role}</span>}
          {HAS_COMPANY && (
            <span>
              {HAS_ROLE && <span> at </span>}
              {metadata?.company}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
