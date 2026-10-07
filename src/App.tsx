import './App.css'
import { useHashRoute } from './useHashRoute'
import TopPage from './pages/TopPage'
import NewMemoPage from './pages/NewMemoPage'
import DetailPage from './pages/DetailPage'

export default function App() {
  const route = useHashRoute()
  switch (route.name) {
    case 'new':
      return <NewMemoPage />
    case 'detail':
      return <DetailPage id={route.id} />
    default:
      return <TopPage />
  }
}
