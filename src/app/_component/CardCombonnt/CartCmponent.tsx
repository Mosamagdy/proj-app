 
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

import { Post } from '@/interfieses/post';
import Comment from '../Comment/Comment';
import MerOpiton from '../MerOpiton/MerOpiton';



export default function CardComponent({ postDetails , singel }: { postDetails:Post , singel:boolean })  {
 


  return (
    <Card sx={{ width: '100%' , my: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={postDetails.user.photo} alt={postDetails.user.name }sx={{ bgcolor: red[500] }} aria-label="recipe">
            
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MerOpiton  postDetails ={postDetails} />
          </IconButton>
        }
        title={postDetails.user.name}
        subheader={`${new Date(postDetails.createdAt).getFullYear()}-${new Date(postDetails.createdAt).getMonth()+1}  ${new Date(postDetails.createdAt).getHours()}: ${new Date(postDetails.createdAt).getMinutes()} `}
      />
      
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {postDetails.body}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="500"
        image={postDetails.image}
        alt={postDetails.body}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Comment singel ={ singel }  postDetails={postDetails}/>
    </Card>
  );
}
