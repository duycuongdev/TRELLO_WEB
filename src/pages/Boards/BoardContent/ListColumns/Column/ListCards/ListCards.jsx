import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { selectCardFilter } from '~/redux/activeBoard/activeBoardSlice'

function ListCards({ cards }) {
  const cardFilter = useSelector(selectCardFilter)

  const filteredCards = useMemo(() => {
    if (!cards) return []
    const search = cardFilter?.search?.trim().toLowerCase()
    const filterColors = cardFilter?.labelColors || []

    if (!search && filterColors.length === 0) return cards

    return cards.filter(card => {
      // Giữ lại placeholder card để SortableContext và DndKit hoạt động ổn định
      if (card?.FE_PlaceholderCard) return true

      if (search) {
        const matchTitle = card.title?.toLowerCase().includes(search)
        const matchDesc = card.description?.toLowerCase().includes(search)
        if (!matchTitle && !matchDesc) return false
      }

      if (filterColors.length > 0) {
        const cardColors = card.labels?.map(l => l.color) || []
        const hasMatchingColor = filterColors.some(color => cardColors.includes(color))
        if (!hasMatchingColor) return false
      }

      return true
    })
  }, [cards, cardFilter])

  return (
    <SortableContext items={filteredCards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px 5px 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        // thanh scroll
        overflowY: 'auto',
        maxHeight: (theme) => `calc(
                  ${theme.trello.boardContentHeight} - 
                  ${theme.spacing(5)} -
                  ${theme.trello.columnHeaderheight} -
                  ${theme.trello.columnFooterHeight}
                )`,
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
      }}>
        {filteredCards?.map(card => <Card key={card._id} card={card} />)}
      </Box >
    </SortableContext>
  )
}

export default ListCards
