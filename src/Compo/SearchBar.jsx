import { TextField } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import SearchIcon from '@mui/icons-material/Search';

import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';

export const SearchBar = () => {
    const context = useContext(blogContext);
    let { setSearchData, alignment, search, setSearch, url } = context;

    function SearchData(searchValue) {
        fetch(`${url}/api/v1/search?${alignment}=${searchValue}`).then(res => res.json()).then(data => {
            if (data.message) {
                // console.log('not usr');
                return setSearchData({ message: "Not found" });
            }
            else {

                setSearchData(data.result);

            }
        });
    }

    // const loading = open && options.length === 0;
    let history = useNavigate()

    function handleSearch(e, s) {
        let searchValue = s || e?.target?.value;
        setSearch(searchValue)
        console.log(s);
        // input.current.autofocus = true
        if (e?.target?.value === '') return setSearchData([])
        // console.log(searchValue)
        SearchData(searchValue);
    }


    // useEffect(() => {
    //     // console.log(alignment);
    //     SearchData(search)
    // }, [alignment, search])


    // const Search = styled('div')(({ theme }) => ({
    //     position: 'relative',
    //     borderRadius: theme.shape.borderRadius,
    //     backgroundColor: alpha(theme.palette.common.white, 0.15),
    //     '&:hover': {
    //         backgroundColor: alpha(theme.palette.common.white, 0.25),
    //     },
    //     marginRight: theme.spacing(2),
    //     marginLeft: 0,
    //     width: '100%',
    //     [theme.breakpoints.up('sm')]: {
    //         marginLeft: theme.spacing(3),
    //         width: 'auto',
    //     },
    // }));
    // const SearchIconWrapper = styled('div')(({ theme }) => ({
    //     padding: theme.spacing(0, 2),
    //     height: '100%',
    //     position: 'absolute',
    //     pointerEvents: 'none',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // }));

    // const StyledInputBase = styled(InputBase)(({ theme }) => ({
    //     color: 'inherit',
    //     '& .MuiInputBase-input': {
    //         padding: theme.spacing(1, 1, 1, 0),
    //         // vertical padding + font size from searchIcon
    //         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    //         transition: theme.transitions.create('width'),
    //         width: '100%',
    //         [theme.breakpoints.up('md')]: {
    //             width: '20ch',
    //         },
    //     },

    // }));


    return (
        <div>

            {/* <Autocomplete
                id="asynchronous-demo"
                sx={{ width: 300 }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                onClick={() => {
                    history('/search')
                }}
                // isOptionEqualToValue={(option, value) => option.title === value.title}
                getOptionLabel={(option) => option?.username}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        onInput={handleSearch}
                        {...params}
                        label="Asynchronous"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            /> */}
            {/* <Search >
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                </Search> */}


            {/* <StyledInputBase
                    ref={input}
                    value={value}
                    onInput={handleSearch}
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                /> */}
            {/* <input type="text" value={value}
                    onInput={handleSearch}
                    placeholder="Search…"
                /> */}
            <form
                onSubmit={e => {
                    e.preventDefault()
                    history('/search')
                }}
            >

                <TextField
                    value={search}
                    id="outlined-name"
                    label="Search..."
                    onChange={handleSearch}
                    placeholder="Search…"
                />
            </form>
        </div>
    )


}

