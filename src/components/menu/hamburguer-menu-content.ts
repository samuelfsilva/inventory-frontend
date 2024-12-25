import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import MenuIcon from '@mui/icons-material/Menu'

interface Link {
  icon: typeof MenuIcon | typeof CategoryIcon
  label: string
  href: string
}

const links: Link[] = [
  { icon: MenuIcon, label: 'Menu', href: '/menu' },
  { icon: Inventory2Icon, label: 'Batch', href: '/batch' },
  { icon: CategoryIcon, label: 'Category', href: '/category' },
]

export default links
