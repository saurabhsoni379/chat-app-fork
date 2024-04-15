import React , {useState} from 'react'
import dlgbx from './dlgbx'
export const DlgProvider = ( {children}) => {
const [isdlg,setIsDlg]=useState(false);
  return (

    <dlgbx.Provider value={{isdlg,setIsDlg}}>
        {children}
    </dlgbx.Provider>
  )
}
