import '../../global.css'
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/QueriesAndMutations"
import { useNavigate,Link } from "react-router-dom"
import {useEffect} from 'react'
import { useToast } from '../ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
const Topbar = () => {
  const {toast} = useToast()
  const{mutate:signOut, isSuccess } = useSignOutAccount();
  const {user} = useUserContext()
  const navigate = useNavigate();
 
  useEffect(() => {
    if(isSuccess){
      navigate('/sign-in')
      toast({title:'Login Successful'})
    }
  })
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to='/' className="flex gap-3 item-center">
          <img src="/assets/images/logo.svg" alt="" width={130} height={325} />
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" className="shad-button_ghost"  onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt=""  />
          </Button>
          <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
            <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="" className="w-8 h-8 rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar