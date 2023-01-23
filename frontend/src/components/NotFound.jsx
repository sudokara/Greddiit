import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import HomeIcon from "@mui/icons-material/Home";
import Button from '@mui/material/Button';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h3">
              The page you're looking for does not exist.
            </Typography>
            <Link to="/" replace>
              <Button variant="contained" color="primary" startIcon={<HomeIcon />}>
                Go Back Home
              </Button>
            </Link>
          </Grid>
          <Grid xs={12} sm={12}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt="404 Error"
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default NotFound;
