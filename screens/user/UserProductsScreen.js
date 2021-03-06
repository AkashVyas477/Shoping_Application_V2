import React from 'react';
import { FlatList,Platform,  Button ,Alert, View, Text } from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';


import  HeaderButton  from '../../component/UI/HeaderButton';
import ProductItem from '../../component/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsAction from '../../store/actions/products'


const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.Products.userProducts);
    const dispatch= useDispatch();

    const editProductHandler = id =>{
      props.navigation.navigate('EditProduct',{productId:id} );
    };

    const deleteHandler =(id) =>{
      Alert.alert('Are you sure ','Do  you really want to delet this item?',[
      {text:'No',style:'default'},
      {text: 'yes',style:'destructive',onPress:() => {
        dispatch(productsAction.deleteProduct(id));
       }
    }
    ])
  };
 
if (userProducts.length ===0 ) {
  return (
    <View style={{flex:1 , justifyContent: 'center' ,alignItems:'center' }} >
      <Text>
        No products found, maybe start create some
      </Text>
    </View>
  )
}
    return (
    <FlatList
        data={userProducts}
        keyExtractor={item => item.id}
        renderItem={itemData => (
        <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              editProductHandler(itemData.item.id);
            }}
        >
          <Button
                color={Colors.primary}
                title="Edit"
                onPress ={()=>{
                  editProductHandler(itemData.item.id);
                }}
                
              />
              <Button
                color={Colors.primary}
                title="Delete"
                onPress={
                  deleteHandler.bind(this,itemData.item.id)}
                  // onPress={() =>{ 
                //   editProductHandler (itemData.item.id);
                // }}
                
              />

        </ProductItem>
        )}
    />
    );
};
 export const screenOptions = navData => {
  return {
    headerTitle:'Your Products ',
    headerLeft:()=>
    (<HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
            navData.navigation.toggleDrawer()
        }}
      />
    </HeaderButtons>
    ),
    headerRight: ()=>
    (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="ADD"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
              navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
      };

    
 };


export default UserProductsScreen;
