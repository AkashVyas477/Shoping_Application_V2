import Order from "../../models/order";
export const ADD_ORDER='ADD_ORDER';
export const SET_ORDERS='SET_ORDERS';

export const fetchOrders =() =>{
    
    return async (dispatch, getState) =>{
        const userId =getState().auth.userId;
        try {
            // any async code you want!
            const response = await fetch(
                `https://shoping-app-aaad1-default-rtdb.firebaseio.com/orders/${userId}.json`, 
            );
            if( !response.ok){
              throw new Error('Somthine  wrong!');
            }
            const resData = await response.json();
            // console.loge(resData);
            const loadedOrders =[];
             
            for (const key in resData){
                loadedOrders.push(
                    new Order(
                        key, 
                        resData[key].cartItems, 
                        resData[key].totalAmount, 
                        new Date(resData[key].date))
                    );
                }
        dispatch({type:SET_ORDERS, orders:[]});
            } catch(err){
                throw err ;
            }
        };
    };


 export const addOrder= (cartItems, totalAmount) =>{
    return async (dispatch, getState) =>{
        const token =getState().auth.token;
        const userId =getState().auth.userId;
        const date= new Date();
        const response = await fetch(
            `https://shoping-app-aaad1-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       cartItems,
       totalAmount,
       date: date.toISOString()
      })
    });

    if (!response.ok) {
        throw new Error('Something Wrong!');

    }
    const resData = await response.json();

        dispatch ({
            type: ADD_ORDER, 
        orderData:{
           id:resData.name, items: cartItems, amount: totalAmount,date:date
        }
        });
    
    };

};