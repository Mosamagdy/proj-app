import { CardContent, Container, Grid2 } from '@mui/material'
import React from 'react'
import { Margin, Padding } from '@mui/icons-material'
import axios from 'axios'
import { cookies } from 'next/headers'
import { Post } from '@/interfieses/post'
import CardComponent from '@/app/_component/CardCombonnt/CartCmponent'
import { Params } from 'next/dist/server/request/params'

export default async function page( {params} : {params:Params} ) {

const { id } = await params; // ✅ لازم await

   const CookesDatat = await cookies()
  const tokenData  =  CookesDatat.get ('token')
  
  async  function getAllpostt(){
    return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${id} `,{
      headers : {
        token: tokenData?.value
      }
      }).then((res)=>{
        return res.data.post
    })
  }
  const post : Post = await getAllpostt()

  return (
    <div style={{ 
      backgroundColor: 'var(--main-color)',       
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="md">
        <Grid2 container justifyContent="center" alignItems="center" >
          <Grid2 >
            <CardComponent singel={false} postDetails={post} />
          </Grid2>
        </Grid2>
      </Container>                    
    </div>
  )
}