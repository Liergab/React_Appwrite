import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostSchema } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/QueriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
type PostProps = {
    post?:Models.Document;
    action: 'Create' | 'Update';
}
const PostForm = ({post,action}: PostProps) => {
    const navigate = useNavigate()
    const {toast} = useToast();
    const{mutateAsync:createPost, isPending:isLoadingCreate} = useCreatePost();
    const{mutateAsync:updatePost, isPending:isLoadingUpdate} = useUpdatePost();
    const {user} = useUserContext()

    const form = useForm<z.infer<typeof PostSchema>>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
          caption: post ? post?.caption : "",
          file:[],
          location: post ? post?.location : "",
          tags : post ? post?.tags.join(",") : ""
        },
    })
    async function onSubmit(values: z.infer<typeof PostSchema>) {
      if(post && action === 'Update'){
        const updatedPost = await updatePost({
          ...values,
          postId: post?.$id,
          imageUrl: post?.imageUrl,
          imageId: post?.imageId
        })

        if(!updatedPost){
          toast({title:"please try again!"})
        }

        return navigate(`/post/${post.$id}`)
      }
        const newPost = await createPost({...values, userId:user.id })
        if(!newPost){
            toast({title:'Failed try again'})
        }
        navigate('/')
      }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
            <Textarea className="shad-textarea custom-scrollbar" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Photo</FormLabel>
            <FormControl>
            <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl}/>
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Location</FormLabel>
            <FormControl>
            <Input className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add tags (seperated by comma " , ")</FormLabel>
            <FormControl>
            <Input className="shad-input" placeholder="JS, React, Next" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />
      <div className="flex gap-4 justify-end items-center">
      <Button type="button" className="shad-button_dark_4">cancel</Button>
      <Button type="submit" className="shad-button_primary whitespace-nowrap"
      disabled={isLoadingCreate || isLoadingUpdate}
      >
       {isLoadingCreate || isLoadingUpdate &&  'Loading ...'}
       {action} Post
        </Button>
      </div>
      
    </form>
  </Form>
  )
}

export default PostForm
