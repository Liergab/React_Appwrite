
import { useDelateSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/QueriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import React,{ useState,useEffect } from "react"
import Loader from "./Loader"


type postProps ={
    post?:Models.Document,
    userId:string
}

const PostStatus = ({post, userId} : postProps) => {

  const likeLists = post?.likes.map((user:Models.Document) => user.$id)
  const [likes, setLikes] = useState(likeLists)
  const [isSaved, setIsSaved] = useState(false)

  const{mutate:likePost} = useLikePost();
  const{mutate:savePost, isPending:isSaveIsPending} = useSavePost();
  const{mutate:deleteSavePost, isPending: isDeleteSavePending} = useDelateSavePost();
  const {data:currentUser} = useGetCurrentUser()
  const savePostRecord = currentUser?.save.find((record:Models.Document) => record.post.$id === post?.$id);
  useEffect(() =>{
    setIsSaved(savePostRecord ? true : false)
  },[currentUser])
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    let newLikes = [...likes]

    const hasLiked = newLikes.includes(userId)

    if(hasLiked){
      newLikes = newLikes.filter((id) => id !== userId)
    }else{
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({postId:post?.$id || '', likeArray:newLikes})
  }
  const handleSavePost = (e:React.MouseEvent) => {
    e.stopPropagation
   

    if(savePostRecord){
      setIsSaved(false)
      deleteSavePost(savePostRecord.$id)
    }else{
      savePost({postId:post?.$id || '' , userId:userId})
      setIsSaved(true)
    }
   
  }
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
       
        <img 
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="" height={20} width={20} className="cursor-pointer" onClick={handleLikePost}/>
        
        <p className="smal-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
      {isSaveIsPending || isDeleteSavePending ? <Loader/>
       : <img 
          src={isSaved ? "/assets/icons/saved.svg": "/assets/icons/save.svg" }
          alt="" height={20} width={20} className="cursor-pointer" onClick={handleSavePost}/>}
      </div>
    </div>
  )
}

export default PostStatus