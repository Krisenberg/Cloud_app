import { Flex } from '@aws-amplify/ui-react';
import classes from './Error_404.module.css';
import { useNavigate } from "react-router-dom";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const ErrorMessage = () => {

  const navigate = useNavigate();

  return (
    <Flex direction="column" className={`${classes.messageContainer}`}>
      <Card sx={{ width: 500 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image="https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/404-page-best-practice.png.webp"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Page not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The requested URL was not found on this server :(
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="medium" color="primary" onClick={() => {navigate("/")}}>
            Go to the landing page
          </Button>
        </CardActions>
      </Card>
    </Flex>
  );
}

export default ErrorMessage;