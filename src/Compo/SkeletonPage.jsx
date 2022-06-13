import { Box, Button, Card, CardContent, CardMedia, Divider, Skeleton, Stack, Typography } from '@mui/material'

import React from 'react'

export const SkeletonPage = () => {
  return (
    <>
      <Card>
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />


        <CardContent >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton animation="wave" variant="circular" width={100} height={100} />

          </Box>



          <div style={{ display: 'flex', justifyContent: 'center' }}>

            <Stack
              sx={{ my: 2, width: '50%' }}
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={22}

            >
              <span style={{ width: '30%' }}>


                <Skeleton
                  animation="wave"
                  height={10}
                  width='100%'
                // style={{ marginBottom: 6 }}
                />
              </span>
              <Stack
                sx={{ m: 0, ml: 0, width: 100 }}
                style={{ margin: 0, marginLeft: '90px' }}
                className='this'
              >

                <Skeleton animation="wave" height={10} width="100%" />
                <Skeleton animation="wave" height={10} width="100%" />



              </Stack>

            </Stack>


          </div>

          <Stack
            sx={{ my: 5 }}
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Skeleton animation="wave" height={10} width="30%" />



          </Stack>

          <Stack gap={3}>

            <Stack direction="row" alignItems="center" gap={3}>
              <Skeleton animation="wave" height={10} width="40%" />

            </Stack>
            <Stack direction="row" alignItems="center" gap={3}>
              <Skeleton animation="wave" height={10} width="40%" />

            </Stack>
            <Stack direction="row" alignItems="center" gap={3}>
              <Skeleton animation="wave" height={10} width="40%" />
            </Stack>

          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
