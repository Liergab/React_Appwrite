import { Models } from "appwrite"
import Loader from "./Loader"
import GridPostList from "./GridPostList"

type resultProps = {
  searchPost:Models.Document[],
  isSearchFetching:boolean
}

const SearchResult = ({searchPost, isSearchFetching}:resultProps) => {

  if(isSearchFetching) return <Loader />
  if(searchPost && searchPost.documents.length > 0){
    return (
      <GridPostList posts={searchPost.documents} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">no result found</p>
  )
}

export default SearchResult
