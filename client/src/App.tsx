import { 
  Home,
  Explore,
  EditPost,
  AllUser,
  Saved,
  CreatePost,
  PostDetails,
  Profile,
  UpdateProfile } from './_root/pages';
import {Routes, Route} from 'react-router-dom'
import './global.css'
import SignIn from './_auth/forms/SignIn'
import SignUp from './_auth/forms/SignUp'
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout'
import { Toaster } from "@/components/ui/toaster"


const App = () => {
  return (
   <main className='flex h-screen'>
    
    <Routes>
      {/* public */}
      <Route element={<AuthLayout/>}>
        <Route path='sign-in' element={<SignIn/>}/>
        <Route path='sign-up' element={<SignUp/>}/>
      </Route>
     

      {/* private */}
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>} />
        <Route path='/explore' element={<Explore/>} />
        <Route path='/all-users' element={<AllUser/>} />
        <Route path='/saved' element={<Saved/>} />
        <Route path='/create-post' element={<CreatePost/>} />
        <Route path='/update-post/:id' element={<EditPost/>} />
        <Route path='/post/:id' element={<PostDetails/>} />
        <Route path='/profile/:id/*' element={<Profile/>} />
        <Route path='/update-profile/:id' element={<UpdateProfile/>} />

      </Route>
    </Routes>
    <Toaster />
   </main>
  )
}

export default App