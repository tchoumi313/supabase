import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

import {
  Tabs_Shadcn_,
  TabsContent_Shadcn_,
  TabsList_Shadcn_,
  TabsTrigger_Shadcn_,
  cn,
  Collapsible_Shadcn_,
  CollapsibleTrigger_Shadcn_,
  CollapsibleContent_Shadcn_,
} from 'ui'

import { getRefMarkdown, MDXRemoteRefs } from '~/features/docs/Reference.mdx'
import type { MethodTypes } from '~/features/docs/Reference.typeSpec'
import { getTypeSpec } from '~/features/docs/Reference.typeSpec'
import {
  CollapsibleDetails,
  FnParameterDetails,
  RefSubLayout,
  ReturnTypeDetails,
  StickyHeader,
} from '~/features/docs/Reference.ui'
import type { AbbrevCommonClientLibSection } from '~/features/docs/Reference.utils'
import {
  flattenCommonClientLibSections,
  genClientSdkSectionTree,
  getSpecFnsCached,
  normalizeMarkdown,
} from '~/features/docs/Reference.utils'

interface ClientLibRefSectionsProps {
  libPath: string
  specFile: string
  excludeName: string
  useTypeSpec: boolean
}

async function ClientLibRefSections({
  libPath,
  specFile,
  excludeName,
  useTypeSpec,
}: ClientLibRefSectionsProps) {
  const sectionTree = await genClientSdkSectionTree(specFile, excludeName)
  const flattenedSections = flattenCommonClientLibSections(sectionTree)

  trimIntro(flattenedSections)

  return (
    <div className="flex flex-col my-16 gap-16">
      {flattenedSections
        .filter((section) => section.type !== 'category')
        .map((section, idx) => (
          <Fragment key={`${section.id}-${idx}`}>
            <SectionDivider />
            <SectionSwitch
              libPath={libPath}
              section={section}
              specFile={specFile}
              useTypeSpec={useTypeSpec}
            />
          </Fragment>
        ))}
    </div>
  )
}

function trimIntro(sections: Array<AbbrevCommonClientLibSection>) {
  const hasIntro = sections[0]?.type === 'markdown' && sections[0]?.slug === 'introduction'
  if (hasIntro) {
    sections.shift()
  }
}

function SectionDivider() {
  return <hr />
}

interface SectionSwitchProps {
  libPath: string
  section: AbbrevCommonClientLibSection
  specFile: string
  useTypeSpec: boolean
}

function SectionSwitch({ libPath, section, specFile, useTypeSpec }: SectionSwitchProps) {
  const sectionLink = `/docs/reference/${libPath}/${section.slug}`

  switch (section.type) {
    case 'markdown':
      return <MarkdownSection libPath={libPath} link={sectionLink} section={section} />
    case 'function':
      return (
        <FunctionSection
          link={sectionLink}
          section={section}
          specFile={specFile}
          useTypeSpec={useTypeSpec}
        />
      )
    default:
      console.error(`Unhandled type in reference sections: ${section.type}`)
      return null
  }
}

interface MarkdownSectionProps {
  libPath: string
  link: string
  section: AbbrevCommonClientLibSection
}

async function MarkdownSection({ libPath, link, section }: MarkdownSectionProps) {
  const content = await getRefMarkdown(
    section.meta?.shared ? `shared/${section.id}` : `${libPath}/${section.id}`
  )

  return (
    <RefSubLayout.EducationSection link={link} {...section}>
      <StickyHeader {...section} />
      <MDXRemoteRefs source={content} />
    </RefSubLayout.EducationSection>
  )
}

interface FunctionSectionProps {
  link: string
  section: AbbrevCommonClientLibSection
  specFile: string
  useTypeSpec: boolean
}

async function FunctionSection({ link, section, specFile, useTypeSpec }: FunctionSectionProps) {
  const fns = await getSpecFnsCached(specFile)

  const fn = fns.find((fn) => fn.id === section.id)
  if (!fn) return null

  let types: MethodTypes | undefined
  if (useTypeSpec && '$ref' in fn) {
    types = await getTypeSpec(fn['$ref'] as string)
  }

  const fullDescription = [
    types?.comment?.shortText,
    'description' in fn && (fn.description as string),
    'notes' in fn && (fn.notes as string),
  ]
    .filter(Boolean)
    .map(normalizeMarkdown)
    .join('\n\n')

  return (
    <RefSubLayout.Section columns="double" link={link} {...section}>
      <StickyHeader {...section} className="col-[1_/_-1]" />
      <div className="overflow-hidden flex flex-col gap-8">
        <div className="prose break-words text-sm">
          <MDXRemoteRefs source={fullDescription} />
        </div>
        <FnParameterDetails
          parameters={
            'overwriteParams' in fn
              ? (fn.overwriteParams as Array<object>).map((overwrittenParams) => ({
                  ...overwrittenParams,
                  __overwritten: true,
                }))
              : types?.params
          }
          altParameters={types?.altSignatures?.map(({ params }) => params)}
          className="max-w-[80ch]"
        />
        {!!types?.ret && <ReturnTypeDetails returnType={types.ret} />}
      </div>
      <div className="overflow-auto">
        {'examples' in fn && Array.isArray(fn.examples) && fn.examples.length > 0 && (
          <Tabs_Shadcn_ defaultValue={fn.examples[0].id}>
            <TabsList_Shadcn_ className="flex-wrap gap-2 border-0">
              {fn.examples.map((example) => (
                <TabsTrigger_Shadcn_
                  key={example.id}
                  value={example.id}
                  className={cn(
                    'px-2.5 py-1 rounded-full',
                    'border-0 bg-surface-200 hover:bg-surface-300',
                    'text-xs text-foreground-lighter',
                    // Undoing styles from primitive component
                    'data-[state=active]:border-0 data-[state=active]:shadow-0',
                    'data-[state=active]:bg-foreground data-[state=active]:text-background',
                    'transition'
                  )}
                >
                  {example.name}
                </TabsTrigger_Shadcn_>
              ))}
            </TabsList_Shadcn_>
            {'examples' in fn &&
              Array.isArray(fn.examples) &&
              fn.examples.map((example) => (
                <TabsContent_Shadcn_ key={example.id} value={example.id}>
                  <MDXRemoteRefs source={example.code} />
                  <div className="flex flex-col gap-2">
                    {!!example.data?.sql && (
                      <CollapsibleDetails title="Data source" content={example.data.sql} />
                    )}
                    {!!example.response && (
                      <CollapsibleDetails title="Response" content={example.response} />
                    )}
                    {!!example.description && (
                      <CollapsibleDetails
                        title="Notes"
                        content={normalizeMarkdown(example.description)}
                      />
                    )}
                  </div>
                </TabsContent_Shadcn_>
              ))}
          </Tabs_Shadcn_>
        )}
      </div>
    </RefSubLayout.Section>
  )
}

export { ClientLibRefSections }
