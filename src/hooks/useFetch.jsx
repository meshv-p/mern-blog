import { useEffect, useState } from 'react'

let cache = {}

export const useFetch = (url, depth = "") => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        console.log(url);
        if (cache[url]) {
            console.log('from cache');
            setData(cache[url])
        }
        else {
            console.log('fetching from fetch');

            fetch(url)
                .then(res => {
                    if (!res.ok) {
                        throw Error('could not fetch data')
                    }

                    return res.json()
                })
                .then(data => {
                    // console.log(depth)
                    cache[url] = data;
                    setData(data)
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
