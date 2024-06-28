import {Logout} from '@/app/actions/index'
import UserAccountInfo from './userinfo'

type Props = {}

const Header =   ({onMenuClick}: {onMenuClick: () => void}) => {

  return (
     <header className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center -m-2 ">
                    <button onClick={onMenuClick} type="button" className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex ml-6 xl:ml-0">
                    <div className="flex items-center flex-shrink-0">
                        <h1 className='text-2xl font-bold text-gray-900 ml-4'> Therottam </h1>
                    </div>
                </div>

               

                    

                <div className="flex items-center justify-end ml-auto space-x-6">
                  


                    {/* <button type="button" className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                        <img className="object-cover bg-gray-300 rounded-full w-9 h-9" src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/previews/dashboards/1/avatar-male.png" alt="" />
                    </button> */}
                    <UserAccountInfo />
                   
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header