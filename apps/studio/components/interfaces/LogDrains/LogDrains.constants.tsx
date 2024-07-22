import { Computer, DogIcon, WebhookIcon } from 'lucide-react'

const iconProps = { size: 24, strokeWidth: 1.5, className: 'text-foreground-light' }

export const LOG_DRAIN_SOURCES = [
  {
    value: 'webhook',
    name: 'Webhook',
    description: 'Forward logs to a custom HTTP endpoint',
    icon: <WebhookIcon {...iconProps} />,
  },
  {
    value: 'datadog',
    name: 'Data dog',
    description: 'Datadog is a monitoring service for cloud-scale applications',
    icon: <DogIcon {...iconProps} />,
  },
  {
    value: 'elasticfilebeat',
    name: 'Elastic Filebeat',
    description: 'Filebeat is a lightweight shipper for forwarding and centralizing log data',
    icon: <Computer {...iconProps} />,
  },
] as const

export const LOG_DRAIN_SOURCE_VALUES = LOG_DRAIN_SOURCES.map((source) => source.value)
export type LogDrainSource = (typeof LOG_DRAIN_SOURCES)[number]['value']

export const DATADOG_REGIONS = [
  {
    label: 'AP1',
    value: 'ap1',
  },
  {
    label: 'EU',
    value: 'eu',
  },
  {
    label: 'US1',
    value: 'us1',
  },
  {
    label: 'US1-FED',
    value: 'us1-fed',
  },
  {
    label: 'US3',
    value: 'us3',
  },
  {
    label: 'US5',
    value: 'us5',
  },
] as const
