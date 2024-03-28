import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, cn } from 'ui'
import { LOCAL_STORAGE_KEYS, isBrowser } from 'common'
import PromoBg from './PromoBg'
import CountdownComponent from '../../layout/banners/LW11CountdownBanner/Countdown'
import announcement from '../../layout/banners/data/Announcement.json'

const LW11bg =
  'https://obuldanrptloktxcffvn.supabase.co/storage/v1/object/public/images/lw11/assets/backgrounds/regular/001.png'

const PromoToast = () => {
  const [visible, setVisible] = useState(false)
  const siteUrl = isBrowser && window.location.origin

  useEffect(() => {
    const shouldHide =
      !localStorage?.getItem(LOCAL_STORAGE_KEYS.TELEMETRY_CONSENT) ||
      localStorage?.getItem(LOCAL_STORAGE_KEYS.HIDE_PROMO_TOAST) === 'true'

    if (!shouldHide) {
      setVisible(true)
    }
  }, [])

  const handleHide = () => {
    setVisible(false)
    localStorage?.setItem(LOCAL_STORAGE_KEYS.HIDE_PROMO_TOAST, 'true')
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className={cn(
        'opacity-0 translate-y-3 transition-all grid gap-2 fixed z-50 bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100vw-2rem)] sm:w-[320px] bg-alternative hover:bg-alternative border border-default rounded p-6 shadow-lg overflow-hidden',
        visible && 'opacity-100 translate-y-0'
      )}
    >
      <div className="relative z-10 text-foreground flex flex-col text-base w-full font-mono">
        <p>Supabase GA Week</p>
        <span className="text-sm leading-4 text-foreground-lighter uppercase">15-19 April</span>
      </div>
      <CountdownComponent date={new Date(announcement.launchDate)} showCard={false} />

      <div className="relative z-10 flex items-center space-x-2">
        <Button asChild type="secondary">
          <Link target="_blank" rel="noreferrer" href={`${siteUrl}/launch-week`}>
            Claim your ticket
          </Link>
        </Button>
        <Button type="default" onClick={handleHide}>
          Dismiss
        </Button>
      </div>
      <Image
        src={LW11bg}
        alt=""
        fill
        sizes="100%"
        aria-hidden
        className="absolute not-sr-only object-cover z-0 inset-0 w-full h-auto"
      />
    </div>
  )
}

export default PromoToast
