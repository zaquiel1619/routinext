import React, {useContext} from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {Grid, Link, List, ListItem, Typography} from '@material-ui/core';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';

export default function ProductScreen({ product }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  if (!product) {
    return <div>Product Not Found</div>;
  }
  if (!product) return <div>Product Not Found</div>

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(item => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: {...product, quantity } });
    router.push('/cart');
  }

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link><Typography>back to products</Typography></Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive" />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem><Typography component="h1" variant="h1">{product.name}</Typography></ListItem>
            <ListItem><Typography>Category: {product.category}</Typography></ListItem>
            <ListItem><Typography>Brand: {product.brand}</Typography></ListItem>
            <ListItem><Typography>Rating: {product.rating} stars ({product.numReviews}) reviews</Typography></ListItem>
            <ListItem><Typography>Description: {product.description}</Typography></ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.countInStock > 0 ? 'In stock' : 'Unaavailable'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params: { slug } } = context;
  await db.connect();
  const product= await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product)
    }
  }
}
