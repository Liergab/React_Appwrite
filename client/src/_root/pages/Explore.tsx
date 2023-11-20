import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import SearchResult from "@/components/shared/SearchResult"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hook/useDebounce"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/QueriesAndMutations"
import {useState, useEffect} from 'react'
import { useInView } from 'react-intersection-observer';

const Explore = () => {
  const { ref, inView,} = useInView();
  const {data:posts, fetchNextPage, hasNextPage} = useGetPosts()

  const [searchValue, setSearchValue] = useState('')

  const debounceValue = useDebounce(searchValue, 500)
  const {data: searchedPost, isFetching:isSearchFetching} = useSearchPosts(debounceValue)

  useEffect(() => {
    if(inView &&  !searchValue) fetchNextPage()
  },[inView, searchValue])

  if(!posts){
    return (
      <div className="flex-center w-full h-full">
        <Loader/>
      </div>
    )
  }
  const shouldShowResultValue = searchValue !== '';
  const shouldShowPost =  !shouldShowResultValue  && posts.pages.every((item) => item.documents.length  === 0)
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
       <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
       <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="" width={24} height={24}/>
          <Input 
          type="text"
          placeholder="search"
          className="explore-search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          />
       </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2  cursor-pointer">
          <p className="small-medium md:base-medium text-light-2 ">All</p>
          <img src="/assets/icons/filter.svg" alt=""  width={20} height={20}/>
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {shouldShowResultValue ? (<SearchResult searchPost={searchedPost} isSearchFetching={isSearchFetching}/>)
           : shouldShowPost
           ? (<p className="text-light-4 mt-10 text-center w-full">End of posts</p>) 
           : posts.pages.map((item, index) => (
            <GridPostList  key={`page-${index}`} posts={item.documents}/>
           ))}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader/>
        </div>
      )}

    </div>
  )
}

export default Explore
