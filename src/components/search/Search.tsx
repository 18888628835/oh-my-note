import { DocSearch } from '@docsearch/react'

const Search = () => {
  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ''}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? ''}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? ''}
    />
  )
}

export default Search
