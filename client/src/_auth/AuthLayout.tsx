import {Outlet, Navigate} from 'react-router-dom'

const AuthLayout = () => {
    const isAuthenticate = false
  return (
    <>
       {isAuthenticate 
        ? ( <Navigate to='/' /> )
        : (
        <> 
            <section className='flex flex-1 justify-center items-center flex-col pt-10'> 
                <Outlet/>
            </section>
            <img src="/assets/images/side-img.svg" 
                alt="logo" 
                className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'/>
        </>) }
    </>
  )
}

export default AuthLayout