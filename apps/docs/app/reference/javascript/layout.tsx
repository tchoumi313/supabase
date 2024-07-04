import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import * as NavItems from '~/components/Navigation/NavigationMenu/NavigationMenu.constants'
import { ClientSdkNavigation } from '~/features/docs/Reference.navigation'
import { MainSkeleton } from '~/layouts/MainSkeleton'

const LIB_ID = 'reference_javascript_v2'
const LIB_PATH = 'javascript'
const LIB_VERSION = 'v2'
const SPEC_FILE = 'supabase_js_v2'

function JsLayout({ children }) {
  const menuData = NavItems[LIB_ID]

  return (
    <MainSkeleton
      menuId={MenuId.RefJavaScriptV2}
      NavigationMenu={
        <ClientSdkNavigation
          name="JavaScript"
          menuId={MenuId.RefJavaScriptV2}
          menuData={menuData}
          libPath={LIB_PATH}
          version={LIB_VERSION}
          specFile={SPEC_FILE}
          excludeName={LIB_ID}
        />
      }
    >
      {children}
    </MainSkeleton>
  )
}

export default JsLayout
