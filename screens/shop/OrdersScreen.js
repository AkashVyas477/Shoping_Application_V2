import React ,{useEffect ,useState}from 'react';
import {View,StyleSheet, FlatList,Text,Platform, ActivityIndicator }from  'react-native';
import { useSelector , useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import  HeaderButton  from '../../component/UI/HeaderButton';
import OrderItem from '../../component/shop/OrderItem';
import * as ordersActions from '../../store/actions/order'
import Colors from '../../constants/Colors';


 const OrdersScreen = props =>{
const [isLoading, setIsLoading ] = useState(false);

     const orders = useSelector(state => state.Orders.orders)
    const dispatch = useDispatch();
    useEffect(() => {
      setIsLoading(true);
      dispatch(ordersActions.fetchOrders()).then(()=>{
        setIsLoading(false);
      });
    }, [dispatch]);

    if (isLoading){
      return(
        <View style={styles.centered} >
          <ActivityIndicator size='large' color={Colors.secondary} />
        </View>
      )
    }
  
    if (orders.length ===0 ) {
      return (
        <View style={{flex:1 , justifyContent: 'center' ,alignItems:'center' }} >
          <Text>
            No orders found, maybe start ordering some
          </Text>
        </View>
      )
    }

     return (<FlatList 
     data ={orders} 
     keyExtractor={item=>item.ud} 
     renderItem ={itemData =>(
      <OrderItem 
        amount={itemData.item.totalAmount}
        date={itemData.item.readableDate}
        items={itemData.item.items}
         /> 
         )}
    />
    );

 };
export const  screenOptions = navData =>{
     return {
        headerTitle:'Your Orders',
        headerLeft:()=>
        (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Menu"
              iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
              onPress={() => {
                  navData.navigation.toggleDrawer('Menu')
              }}
            />
          </HeaderButtons>
          ),
     };
    
 }; 

 const styles = StyleSheet.create({
  centered:{
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
})

 export default OrdersScreen;
