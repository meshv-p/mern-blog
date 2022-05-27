import { useEffect, useState } from 'react'

export const useFetch = (url, depth = "") => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw Error('could not fetch data')
                }

                return res.json()
            })
            .then(data => {
                // console.log(depth)

                setData(data)
                // console.log(data)
                setIsLoading(false);
                setError(null)
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.message)
            })
    }, [url])



    return { data, isLoading, error, setData }
}
