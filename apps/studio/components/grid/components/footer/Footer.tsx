import { Pagination } from './pagination'
import useTable from 'hooks/misc/useTable'
import { useParams } from 'common'
import TwoOptionToggle from 'components/ui/TwoOptionToggle'
import { useUrlState } from 'hooks'
import RefreshButton from '../header/RefreshButton'
import { GridFooter } from 'components/ui/GridFooter'

export interface FooterProps {
  isLoading?: boolean
  isRefetching?: boolean
}

const Footer = ({ isLoading, isRefetching }: FooterProps) => {
  const { id: _id } = useParams()
  const id = _id ? Number(_id) : undefined
  const { data: selectedTable } = useTable(id)

  const [{ view: selectedView = 'data' }, setUrlState] = useUrlState()

  const setSelectedView = (view: string) => {
    if (view === 'data') {
      setUrlState({ view: undefined })
    } else {
      setUrlState({ view })
    }
  }

  return (
    <GridFooter>
      {selectedView === 'data' && <Pagination />}

      <div className="ml-auto flex items-center gap-x-2">
        {selectedTable && selectedView === 'data' && (
          <RefreshButton table={selectedTable} isRefetching={isRefetching} />
        )}

        <TwoOptionToggle
          width={75}
          options={['definition', 'data']}
          activeOption={selectedView}
          borderOverride="border"
          onClickOption={setSelectedView}
        />
      </div>
    </GridFooter>
  )
}

export default Footer
