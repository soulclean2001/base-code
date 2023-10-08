import { useDispatch, useSelector } from 'react-redux'
import { FaBars } from 'react-icons/fa'
import './dashboard.scss'
import { handleChangeSideBar } from '../../employerSlice'
import SideBarEmployer from './components/SideBar/SideBarEmployer'
import { Outlet } from 'react-router-dom'

import { RootState } from '~/app/store'
import { useEffect, useState } from 'react'

// import SideBarEmployer from './components/SideBar/SideBarEmployer'

const DashboarEmployer = () => {
  const dispatch = useDispatch()
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const [widthContent, setWidthContent] = useState('82.2%')
  useEffect(() => {
    if (collap) {
      setWidthContent('100%')
    } else {
      setWidthContent('100%')
    }
  }, [collap])
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [hiddenButtonCollapsed, setHiddenButtonCollapsed] = useState(false)
  const [windowSize, setWindowSize] = useState(getWindowSize())
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth <= 786) {
      setHiddenButtonCollapsed(true)
    } else {
      setHiddenButtonCollapsed(false)
    }
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [windowSize.innerWidth <= 786])
  return (
    <div className='employer-dashboard-container'>
      {/* <div style={{ width: '25%' }}> */}
      <SideBarEmployer roleType={'EMPLOYER_ROLE'} />
      {/* </div> */}

      <div className='employer-dashboard-content' style={{ width: widthContent }}>
        <FaBars hidden={hiddenButtonCollapsed} onClick={() => dispatch(handleChangeSideBar())} />

        <Outlet />
      </div>
    </div>
  )
}

export default DashboarEmployer