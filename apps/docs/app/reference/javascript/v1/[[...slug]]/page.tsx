import {
  ClientSdkReferencePage,
  generateReferenceStaticParams,
  redirectNonexistentReferenceSection,
} from '~/features/docs/Reference.sdkPage'

const LIB_ID = 'reference_javascript_v1'
const LIB_PATH = 'javascript'
const LIB_VERSION = 'v1'
const SPEC_FILE = 'supabase_js_v1'

export default async function JsReferenceV1({
  params: { slug },
}: {
  params: { slug?: Array<string> }
}) {
  await redirectNonexistentReferenceSection(slug, SPEC_FILE, LIB_ID)

  return (
    <ClientSdkReferencePage
      libId={LIB_ID}
      libPath={LIB_PATH}
      libVersion={LIB_VERSION}
      specFile={SPEC_FILE}
      useTypeSpec
    />
  )
}

export const generateStaticParams = generateReferenceStaticParams(SPEC_FILE, LIB_ID)
