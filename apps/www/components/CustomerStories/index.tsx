import Link from 'next/link'
import { GlassPanel } from 'ui'

import SectionContainer from '../Layouts/SectionContainer'
import TextLink from '../TextLink'
import SectionHeader from 'components/UI/SectionHeader'
import customerStories from '~/data/CustomerStories'

const CustomerStories = () => {
  const selection = ['Pebblely', 'Chatbase', 'Mendable.ai']
  const customers = customerStories.filter((story: any) => selection.includes(story.organization))

  const caseStudyThumbs = customers.map((customer: any, idx: number) => {
    return {
      logo: customer.logo_inverse,
      title: customer.title,
      link: customer.url,
    }
  })

  return (
    <SectionContainer>
      <div className="mb-12">
        <SectionHeader
          title={'Infrastructure'}
          title_alt={' to innovate and scale with ease.'}
          subtitle={'Customer Stories'}
          paragraph={
            'See how Supabase empowers companies of all sizes to accelerate their growth and streamline their work.'
          }
          className="xl:w-1/2"
        />
      </div>
      <div className="mx-auto mt-5 grid grid-cols-12 gap-8 lg:gap-12">
        {caseStudyThumbs.map((caseStudy: any, i: number) => (
          <Link
            href={`${caseStudy.link}`}
            key={caseStudy.title}
            className="col-span-12 md:col-span-4"
          >
            <GlassPanel {...caseStudy} background={true} showIconBg={true} showLink={true}>
              {caseStudy.description}
            </GlassPanel>
          </Link>
        ))}
      </div>
      <div className="mt-12">
        <TextLink url="/customers" label="Explore more" />
      </div>
    </SectionContainer>
  )
}

export default CustomerStories
