import { bottombarLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"

const Bottombar = () => {
  const {pathname} = useLocation()
  return (
    <section className="bottom-bar">
       {bottombarLinks.map((link) => {
        const active = pathname === link.route
        return(
          <Link to={link.route} key={link.label} className={`${active &&  'bg-primary-500 rounded-[10px]'} 
            flex-center flex-col gap-1 p-2 transition`}>
            <img 
              src={link.imgURL} alt=""
              width={16}
              height={16}
              className={`${active && 'invert-white'}`}/>

            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        )
       })}
    </section>
  )
}

export default Bottombar