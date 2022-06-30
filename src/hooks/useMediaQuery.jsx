import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useMediaQuery = () => {
    const [isLaptop, setIsLaptop] = useState(true)
    // // useEffect(() => {
    // window.addEventListener('resize', () => {
    //     let width = window.screen.width;
    //     if (width < 1500) {
    //         setIsLaptop(false)
    //     }
    //     else {
    //         setIsLaptop(true)
    //     }
    // })
    // // }, [window])
    let history = useNavigate()
    const handleWindowSizeChange = () => {
        // setWidth(window.innerWidth);
        let width = window.screen.width;
        if (width < 1500) {
            setIsLaptop(false)
        }
        else {
            setIsLaptop(true)
        }
    }

    useEffect(() => {
        handleWindowSizeChange()
        window.addEventListener('resize', handleWindowSizeChange);
        window.addEventListener('load', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
            window.removeEventListener('load', handleWindowSizeChange);
            window.removeEventListener('select', handleWindowSizeChange);
        }
    }, [history]);
    // handleWindowSizeChange();

    return { isLaptop }
}
