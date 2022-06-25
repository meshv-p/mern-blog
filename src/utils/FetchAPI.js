let data=null,isLoading =true,error=null;
let cache = {}

export const FetchAPI = (url,options={}) =>{
    if (cache[url]) {
        // console.log('from cache', cache[url]);
        data = cache[url]
        isLoading = false
        error = false
        return { data, isLoading, error }

    }
    else {
        console.log('fetching from fetch');

      return new Promise(()=> {
          fetch(url, options)
              .then(res => {
                  if (!res.ok) {
                      throw Error('could not fetch data')
                  }
                  console.error('Some error occurred')
                  return res.json()
              })
              .then(d => {
                  // console.log(depth)
                  data = d
                  cache[url] = d;
                  // console.log(data)
                  isLoading = false
                  error = null
                  return { data, isLoading, error }

              })
              .catch(err => {
                  isLoading = false
                  error = err.message
              })
      },
          ()=>{
          console.error('Some error occurred')
      } )
    }
    return { data, isLoading, error }
}