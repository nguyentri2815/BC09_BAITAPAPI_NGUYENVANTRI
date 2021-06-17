
var productLists=[];
var productCart=[];
if(localStorage.getItem('productcart-tt')){
    productCart=JSON.parse(localStorage.getItem('productcart-tt'));
}

//create products
var createProducts=function(ListProducts){
    var htmlListProducts='';
    for (let i = 0; i < ListProducts.length; i++) {
        htmlListProducts+=`
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card p-1 h-100">
            <img src="${ListProducts[i].img}" class="card-img-top" alt="...">
            <div class="card-body p-0">
                <h5 class="card-title mt-2">${ListProducts[i].name}</h5>
                <p class="card-text">${ListProducts[i].desc}</p>
                <h5 class="card-title">${ListProducts[i].price} Đ</h5>
            </div>
            <div class="card-footer p-0 mt-3">
                <button class="btn-success text-uppercase btn-block p-1" style="cursor: pointer;" onclick="addToCart(${ListProducts[i].id})">add to card</button>
            </div>
            </div>
        </div> `
        
    }
    document.querySelector('.products-list').innerHTML=htmlListProducts;
}

//fetch list product 

var fetchProducts=function(){
    axios({
        url:"https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
        methob:'GET'
    })
    .then(function(res){
        if(res.data){
            console.log(res.data);
            productLists=res.data;
            createProducts(productLists);
        }
    })
    .catch(function(err){
        alert(err)
    })

}
fetchProducts();


//filter type product
var filterTypeProducts=function(){
    var listProductsFIlter=[];
    var elementFIlter=document.querySelector('.product-filter');
    console.log(elementFIlter.value);
    if(elementFIlter.value){
        for (let i = 0; i < productLists.length; i++) {
            if(elementFIlter.value===productLists[i].type){
                listProductsFIlter.push(productLists[i]);
            }
            
        }
        createProducts(listProductsFIlter);
    }else{
        createProducts(productLists);
    }
}

// add to cart
var addToCart=function(id){
    var productAdd;
    for (let i = 0; i < productLists.length; i++) {
        if(+productLists[i].id===id){
            productAdd=productLists[i];
            break;
        }
    }
    if(productAdd){
        for (let k = 0; k < productCart.length; k++) {
            if(productCart[k].id === productAdd.id){
                var quantity=++productCart[k].quantity;
                productCart[k].quantity=quantity;
                createProductCart(productCart);
                localStorage.setItem('productcart-tt',JSON.stringify(productCart));
                return;
            }
        }
        productAdd.quantity=1;
        productCart.push(productAdd);
        createProductCart(productCart);
        localStorage.setItem('productcart-tt',JSON.stringify(productCart));
    }else{
        alert('add product fail')
    }
}
//create to cart

var createProductCart=function(listcart){
    var htmlCart='';
    var toltal=0;
    var numberProduct=0;
    // console.log(listcart);
    for (let i = 0; i < listcart.length; i++) {
        toltal+=(+listcart[i].price) * listcart[i].quantity;
        numberProduct+=listcart[i].quantity;
        htmlCart+=`
        <tr>
            <th scope="row"><img src="${listcart[i].image}" alt="" style="max-width:150px"></th>
            <td>${listcart[i].name}</td>
            <td>${listcart[i].price} Đ</td>
            <td class="d-flex align-items-center"> <input oninput="changeValueInputCart(event,${listcart[i].id})" type="number" value="${listcart[i].quantity}"></input>
                <div class="btn-goup">
                    <button type="button" class="btn btn-info" onclick="decrease(${listcart[i].id})">-</button>
                    <button type="button" class="btn btn-info" onclick="increase(${listcart[i].id})">+</button>
                </div>
            </td>
            <td>${listcart[i].price *listcart[i].quantity } Đ</td>
            <td><button type="button" class="btn btn-info" onclick="deleteCart(${listcart[i].id})">x</button></td>
      </tr>`
        
    }
    document.querySelector('.list-cart').innerHTML=htmlCart;
    document.querySelector('.total').innerHTML=toltal;
    document.querySelector('.numberProduct').innerHTML=numberProduct;
}

//get product cart
var getCartLocalstorage=function(){
    createProductCart(productCart);
}
getCartLocalstorage();

//pay cart

var payCart=function(){
    productCart=[];
    createProductCart(productCart);
}
//delete cart
var deleteCart=function(id){
    for (let i = 0; i < productCart.length; i++) {
        if((+productCart[i].id)===id){
            console.log('vao day ko');
            // productCart.splice(id,1);
            productCart.splice(i,1);
            break; 
        }
    }
    createProductCart(productCart);
}
//increase

var increase =function(id){
    for (let i = 0; i < productCart.length; i++) {
        if(+productCart[i].id === id){
            productCart[i].quantity+=1;
            createProductCart(productCart);
            break;
        }
        
    }
}


//decrease
var decrease =function(id){
    for (let i = 0; i < productCart.length; i++) {
        if(+productCart[i].id === id && productCart[i].quantity>=2){
            productCart[i].quantity-=1;
            createProductCart(productCart);
            break;
        }
        
    }
}

//change value input product cart
var changeValueInputCart=function(event,id){
    // console.log(event,id);
    for (let i = 0; i < productCart.length; i++) {
        if(+productCart[i].id === id){
            productCart[i].quantity=event.target.value;
            createProductCart(productCart);
            break;
        }
        
    }
}