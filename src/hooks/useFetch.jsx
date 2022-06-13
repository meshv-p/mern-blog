import { useEffect, useState } from 'react'

let cache = {}

export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        console.log(url);
        if (cache[url]) {
            // console.log('from cache', cache[url]);
            setData(cache[url])
            setIsLoading(false);
            setError(null)
        }
        else {
            // console.log('fetching from fetch');

            fetch(url, options)
                .then(res => {
                    if (!res.ok) {
                        throw Error('could not fetch data')
                    }

                    return res.json()
                })
                .then(d => {
                    // console.log(depth)
                    setData(d)
                    cache[url] = d;
                    // console.log(data)
                    setIsLoading(false);
                    setError(null)
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message)
                })
        }
    }, [url])



    return { data, isLoading, error, setData }
}
