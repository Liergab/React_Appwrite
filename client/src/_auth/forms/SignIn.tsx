import { Button } from "@/components/ui/button"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInSchema } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate} from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/QueriesAndMutations"
import { useUserContext } from "@/context/AuthContext"



const SignIn = () => {
    const navigate = useNavigate()
    const {toast} = useToast()
    const {checkAuthUser, isLoading:isUserLoading} = useUserContext();
    const {mutateAsync:signInAccount, isPending} = useSignInAccount()
      const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
          email:"",
          password:""
        },
      })

    const onSubmit = async(values: z.infer<typeof SignInSchema>) => {

        const session = await signInAccount({
           email: values.email,
           password: values.password
        })
        if(!session){
            return toast({title:'Sign up failed, pls try again'})
        }
        const isLoggedIn = await checkAuthUser();

        if(isLoggedIn){
            form.reset();
            navigate('/')
        }else{
           return toast({title:'Sign up failed, pls try again'})
        }
    }
  
  return (
   
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
            <p className="text-light-3 small-medium md:base-regular">Welcome back!, please enter your details</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message "/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message "/>
                    </FormItem>
                )}
                />
                <Button type="submit" className="shad-button_primary">
                    {isUserLoading ? (<div className="flex-center gap-2"><Loader/> Loading...</div>) : 'signin'}
                </Button>

                <p className="text-small-regular text-light-2  text-center mt-2">
                Don't have an account? <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
                    </p>
            </form>
      </div>
    </Form>

    
  )
}

export default SignIn