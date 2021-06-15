
var productlists=[];

//create table product
var createProduct = function(data){
    var htmlInTableList='';
    if(!data){
        data=productlists;
    }
   for (let i = 0; i < data.length; i++) {
    htmlInTableList+=`
        <tr >
            <td>${data[i].id}</td>
            <td><img src="${data[i].image}" style="max-width:150px" alt="img product"></td>
            <td>${data[i].img}</td>
            <td>${data[i].type}</td>
            <td>${data[i].name}</td>
            <td>${data[i].price}</td>
            <td>${data[i].backCamera}</td>
            <td>${data[i].frontCamera}</td>
            <td>${data[i].inventory}</td>
            <td>${data[i].screen}</td>
            <td>${data[i].rating}</td>
            <td>${data[i].desc}</td>
            <td>
                <button class="btn btn-primary" onclick="getProductToUpdate(${data[i].id})">sửa</button>
                <button class="btn btn-danger" onclick="deleteProduct(${data[i].id})">xóa</button>
            </td>
        </tr>
    `
       
   }
   document.querySelector('.listproducts').innerHTML=htmlInTableList;
}
//fetch products list
var fetchProductsList=function(){
    axios({
        url:"https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
        method:"GET"
    })
    .then(function(res){
        if(res.data){
            productlists= res.data;
            createProduct()
        }
    })
    .catch(function(err){
        alert(err)
    })
}
fetchProductsList();

//add Edit product
var addEditProduct=function(){
    var checkValidation=validateForm();
    var elementInputID=document.getElementById('id');
    var id =document.querySelector('#id').value;
    var name =document.querySelector('#name').value;
    var price =document.querySelector('#price').value;
    var type =document.querySelector('#type').value;
    var image =document.querySelector('#image').value;
    var img =document.querySelector('#img').value ||' img default';
    var rating =document.querySelector('#rating').value;
    var desc =document.querySelector('#desc').value ||' desc default';
    var frontCamera =document.querySelector('#frontCamera').value || ' front camera default';
    var backCamera =document.querySelector('#backCamera').value || 'back camera default';
    var screen =document.querySelector('#screen').value || 'screen default';
    var inventory =document.querySelector('#inventory').value || 10;
    if(!checkValidation) return;

    var newProduct = new Product(
        backCamera,
        desc,
        frontCamera,
        id,
        image,
        img,
        inventory,
        name,
        price,
        rating,
        screen,
        type
    );
    if(elementInputID.disabled){
        //call api to edit
        axios({
            url:`https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
            method:"PUT",
            data:newProduct
        })
        .then(function(res){
            if(res){
                console.log(res);
                alertCallApi(res.statusText);
                document.getElementById('btn-reset').click();
                fetchProductsList()
            }   
        })
        .catch(function(err){
            alert(err)
        })
        
    }else{
        //call api to add
        axios({
            url:"https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
            method:"POST",
            data:newProduct,
        })
        .then(function(res){
           alertCallApi(res.statusText);
           fetchProductsList()
        })
        .catch(function(err){
            alert(err)
        })
    }
}

//delete product
var deleteProduct= function(id){
    axios({
        url:`https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method:"DELETE"
    })
    .then(function(res){
        alertCallApi(res.statusText);
        fetchProductsList()
    })
    .catch(function(err){
        alert(err)
    })
}

//alert respon api 
var alertCallApi=function(message){
    var elementAlert= document.querySelector('.alert-callapi');
    elementAlert.innerHTML=`
    <div class="alert alert-primary" role="alert">
        kết quá thao tác :  ${message} 
     </div>
    `
    elementAlert.classList.add('active');
    setTimeout(() => {
       elementAlert.classList.remove('active');
    }, 2000);
}
//getProductToUpdate
var getProductToUpdate =function(id){
    document.getElementById('id').disabled = true;
    document.getElementById('btn-addEdit').innerHTML='UPDATE PRODUCT';
    axios({
        url:"https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/",
        method:"GET",
        params: {
            id: id,
        },
    })
    .then(function(res){
        console.log(res);
        if(res.data){
            document.querySelector('#id').value=res.data[0].id;
            document.querySelector('#name').value=res.data[0].name;
            document.querySelector('#price').value=res.data[0].price;
            document.querySelector('#type').value=res.data[0].type;
            document.querySelector('#image').value=res.data[0].image;
            document.querySelector('#img').value= res.data[0].img;
            document.querySelector('#rating').value =res.data[0].rating;
            document.querySelector('#desc').value = res.data[0].desc;
            document.querySelector('#frontCamera').value = res.data[0].frontCamera;
            document.querySelector('#backCamera').value = res.data[0].backCamera;
            document.querySelector('#screen').value |= res.data[0].screen;
            document.querySelector('#inventory').value = res.data[0].inventory;
        }
    })
    .catch(function(err){
        alert(err)
    })
}

//search
var findProduct=function(){
    var key =document.getElementById('search').value;
    var dataFind=[];
    for (let i = 0; i < productlists.length; i++) {
        if(productlists[i].name.toLowerCase().includes(key.toLowerCase())){
            dataFind.push(productlists[i]);
        }
        
    }
    createProduct(dataFind);
}
//validation 
//check riquired
var checkRequired = function(value, errorid, messageErr){
    if(value.length > 0){
        document.getElementById(errorid).innerHTML='';
        return true;
    }
    document.getElementById(errorid).innerHTML= messageErr||' trường này bác buộc';
    return false;
}
var checklength = function(value, errorid,min){
    if( value.length >= min ){
        document.getElementById(errorid).innerHTML='';
        return true;
    }else{
        document.getElementById(errorid).innerHTML=`giá trị phải từ ${min} số trở lên `
        return false;
    }
}
var validateForm = function(){
    var id= document.querySelector('#id').value;
    var name= document.querySelector('#name').value;
    var price= document.querySelector('#price').value;
    var image= document.querySelector('#image').value;
    var isValid= true;
    isValid &=checkRequired(id,'errid','bạn chưa nhập id sản phẩm') && checklength(id,'errid',1);
    isValid &=checkRequired(name,'errname','bạn chưa nhập tên sản phẩm') ;
    isValid &=checkRequired(price,'errprice','bạn chưa nhập giá sản phẩm');
    isValid &=checkRequired(image,'errimage','kiếm link ảnh dán vào bạn ơi');
    return isValid;
}
var checkText = function(value, errorid){
    var parter=/^[A-Za-z\s]+$/g;
    if(parter.test(value)){
        document.getElementById(errorid).innerHTML='';
        return true;
    }else{
        document.getElementById(errorid).innerHTML=`giá trị nhập ko được có số`
        return false;
    }
}