import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { createPost, 
        createUserAccount, 
        deletePost, deleteSavePost, 
        getCurrentUser, 
        getInfinitePost, 
        getPostById, 
        getRecentPosts, 
        likePost, 
        savePost, 
        searchPosts, 
        signInAccount, 
        signOutAccount, 
        updatePost } from '../appwrite/api'


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount= () => {
    return useMutation({
        mutationFn: (user:{
            email:string;
            password:string
        }) => signInAccount(user)
    })
}

export const useSignOutAccount= () => {
    return useMutation({
        mutationFn:signOutAccount
    })
}

export const useCreatePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost) => createPost(post),
        onSuccess: () => {
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_RECENT_POSTS]})
        }
    })
}
export const useGetRecentPost = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const useLikePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:({postId,likeArray}:{postId:string; likeArray:string[]}) => likePost(postId, likeArray),
        onSuccess: (data) => {
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_RECENT_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_CURRENT_USER]})
        }

    })
}

export const useSavePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:({postId,userId}:{postId:string; userId:string}) => savePost(postId, userId),
        onSuccess: (data) => {
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_RECENT_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_CURRENT_USER]})
        }

    })
}

export const useDelateSavePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:(saveRecordId:string) => deleteSavePost(saveRecordId),
        onSuccess: () => {
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_RECENT_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_POSTS]})
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_CURRENT_USER]})
        }

    })
}


export const useGetCurrentUser = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })
}

export const useGetPostById =  (postId:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:() => getPostById(postId),
        enabled:!!postId
    })
}

export const useUpdatePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:(postId:IUpdatePost) => updatePost(postId),
        onSuccess: () => {
            queryCient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryCient = useQueryClient();
    return useMutation({
        mutationFn:({postId, imageId}:{postId:string, imageId:string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryCient.invalidateQueries({queryKey:[QUERY_KEYS.GET_RECENT_POSTS]})
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost,
        getNextPageParam:(lastPage) => {
            if(lastPage && lastPage.documents.length === 0)return null;

            const lastId =  lastPage.documents[lastPage?.documents.length - 1].$id;
           
            return lastId
        }
    })
}


export const useSearchPosts = (searchTerm:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn:() => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}