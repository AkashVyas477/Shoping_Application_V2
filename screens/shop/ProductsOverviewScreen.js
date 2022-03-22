import React, {useState, useEffect , useCallback} from 'react';
import { FlatList, Platform ,Button,ActivityIndicator,View ,StyleSheet ,Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';


import  HeaderButton  from '../../component/UI/HeaderButton';
import  ProductItem from '../../component/shop/ProductItem'
import * as cartActions from '../../store/actions/cart';
import * as productsActions from  '../../store/actions/products'
import Colors from '../../constants/Colors';



const ProductsOverviewScreen = props => {
  
  const [isLoading,setIsLoading] = useState (false);
  const [error , SetError] =useState();
  const [isRefreshing,setIsRefreshing]=useState(false);
  const products = useSelector(state => state.Products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async() =>{
    // console.log('LOAD PRODUCTS')
    SetError(null);
    setIsRefreshing(true);
    try {
    await dispatch(productsActions.fetchProducts());
  }catch (err){ 
  SetError(err.message);
  }
  setIsRefreshing(false);
  }, [dispatch, setIsLoading,SetError]);

useEffect(() => {
 const unsubscribe = props.navigation.addListener('focus',loadProducts);
  return() =>{
    unsubscribe();
  };
},[loadProducts]
);

useEffect(() => {
  setIsLoading(true);
  loadProducts().then(()=>{
    setIsLoading(false);
  });
  }, [dispatch , loadProducts]);

  const selectItemHandler =(id,title)=>{
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  if (error) {
    return (
    <View style={styles.centered}>
      <Text>
        AN error Ocurred!
      </Text>
      <Button title="Try again " onPress={loadProducts}  color={Colors.secondary}/>
    </View>
    );
  }


  if (isLoading){
    return (
    <View style={styles.centered} >
     <ActivityIndicator  size="large" color={Colors.secondary} /> 
    </View>
    );
  }

  if (!isLoading && products.length === 0 ){
    return (
      <View style={styles.centered} >
       <Text> No products found. Maybe start adding some ! </Text>
      </View>
      );
  }

  return (
    <FlatList
    onRefresh={loadProducts}
    refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
             
          }}
        
        
        >
          <Button
                color={Colors.primary}
                title="View Details"
                onPress={() =>{
                  selectItemHandler(itemData.item.id, itemData.item.title);
           
                }}
              />
              <Button
                color={Colors.primary}
                title="To Cart"
                onPress={() => {
                  dispatch(cartActions.addToCart(itemData.item));
                }}
              />
        </ProductItem>
      )}
    />
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft:()=>  (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
            navData.navigation.toggleDrawer('Menu')
        }}
      />
    </HeaderButtons>
    ),

    headerRight:()=> (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
              navData.navigation.navigate('Cart')
          }}
        />
      </HeaderButtons>
    )
  };
};


const styles = StyleSheet.create({
  centered:{
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
})

export default ProductsOverviewScreen;
