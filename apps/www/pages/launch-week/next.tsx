import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { Session } from '@supabase/supabase-js'
import { SITE_ORIGIN, SITE_URL } from '~/lib/constants'
import supabase from '~/lib/supabaseMisc'

import FaviconImports from '~/components/LaunchWeek/11/FaviconImports'
import DefaultLayout from '~/components/Layouts/Default'
import { TicketState, ConfDataContext, UserData } from '~/components/LaunchWeek/hooks/use-conf-data'
import SectionContainer from '~/components/Layouts/SectionContainer'
import { Meetup } from '~/components/LaunchWeek/11/LW11Meetups'
import LW11StickyNav from '~/components/LaunchWeek/11/Releases/LW11StickyNav'
import LW11Header from '~/components/LaunchWeek/11/Releases/LW11Header'
import MainStage from '~/components/LaunchWeek/11/Releases/MainStage'

const BuildStage = dynamic(() => import('~/components/LaunchWeek/11/Releases/BuildStage'))
const LW11Meetups = dynamic(() => import('~/components/LaunchWeek/11/LW11Meetups'))
const LaunchWeekPrizeSection = dynamic(
  () => import('~/components/LaunchWeek/11/LaunchWeekPrizeSection')
)

interface Props {
  meetups?: Meetup[]
}

export default function LaunchWeekIndex({ meetups }: Props) {
  const { query } = useRouter()

  const TITLE = 'Supabase GA week | 11-15 April 2024'
  const DESCRIPTION = 'Join us for a week of announcing new features, every day at 8 AM PT.'
  const OG_IMAGE = `${SITE_ORIGIN}/images/launchweek/lw11/lw11-og.jpg`

  const ticketNumber = query.ticketNumber?.toString()
  const bgImageId = query.bgImageId?.toString()
  const [session, setSession] = useState<Session | null>(null)
  const [showCustomizationForm, setShowCustomizationForm] = useState<boolean>(false)

  const defaultUserData = {
    id: query.id?.toString(),
    ticketNumber: ticketNumber ? parseInt(ticketNumber, 10) : undefined,
    name: query.name?.toString(),
    username: query.username?.toString(),
    golden: !!query.golden,
    bgImageId: bgImageId ? parseInt(bgImageId, 10) : undefined,
  }

  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [ticketState, setTicketState] = useState<TicketState>('loading')

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    document.body.classList.add('bg-[#060809]')

    return () => {
      if (document.body.classList.contains('bg-[#060809]')) {
        document.body.classList.remove('bg-[#060809]')
      }
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      if (userData?.id) {
        return setTicketState('ticket')
      }
      return setTicketState('loading')
    }
    if (!session) return setTicketState('registration')
  }, [session, userData])

  return (
    <>
      <NextSeo
        title={TITLE}
        description={DESCRIPTION}
        openGraph={{
          title: TITLE,
          description: DESCRIPTION,
          url: SITE_URL,
          images: [
            {
              url: OG_IMAGE,
            },
          ],
        }}
      />
      <FaviconImports />
      <ConfDataContext.Provider
        value={{
          supabase,
          session,
          userData,
          setUserData,
          ticketState,
          setTicketState,
          showCustomizationForm,
          setShowCustomizationForm,
        }}
      >
        <DefaultLayout>
          <LW11StickyNav />
          <LW11Header className="pb-20 z-0" />
          <MainStage className="relative -mt-20 z-10" />
          <BuildStage />
          <SectionContainer id="meetups" className="scroll-mt-[66px]">
            <LW11Meetups meetups={meetups} />
          </SectionContainer>
          <SectionContainer className="lg:pb-40">
            <LaunchWeekPrizeSection />
          </SectionContainer>
        </DefaultLayout>
      </ConfDataContext.Provider>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: meetups } = await supabase!
    .from('lw11_meetups')
    .select('*')
    .neq('isPublished', false)

  return {
    props: {
      meetups: meetups?.sort((a, b) => (new Date(a.start_at) > new Date(b.start_at) ? 1 : -1)),
    },
  }
}
