import { useParams } from 'next/navigation'

const useDecodeParams = () => {
  const { category, slug } = useParams()
  return { category: decodeURIComponent(category), slug: decodeURIComponent(slug) }
}

export default useDecodeParams
