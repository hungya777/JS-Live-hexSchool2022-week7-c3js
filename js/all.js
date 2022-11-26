// import file
import validateForm from "./validate.js";

//取得目前 id的最大值(暫存id值)
let tempId = 0;

//套票卡片區塊
const ticketCardArea = document.querySelector('#ticketCardArea');

// 新增旅遊套票功能-表單欄位
const addForm = document.querySelector("#addForm");
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketLocation = document.querySelector("#ticketLocation");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const btnAddTicket = document.querySelector("#btnAddTicket");
// const addFormInputs = document.querySelectorAll("input[type=text],input[type=number],select,textarea");
const addFormInputs = document.querySelectorAll('[data-inputName]');
console.log(addFormInputs);

//下拉選單-地區搜尋
const locationSearch = document.querySelector("#locationSearch");
//本次搜尋共幾筆資料
const countsSearchResult = document.querySelector("#countsSearchResult");

//查無資料區塊
const cantFindArea = document.querySelector(".cantFind-area");

let data = []; //宣告一個存放資料的陣列

// 初始化
function init(){
  getData(); //取得旅遊景點資料
}
init();

//取得旅遊景點資料
function getData(){
  // 透過axios串接API，取得JSON格式資料
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function(response){
      // console.log(response.data.data);
      data = response.data.data;
      renderData(data); //渲染畫面到網頁上
      renderC3(data); //渲染 c3圖表 到網頁上
    })
    .catch(function(error){
      console.log(error);
    })
}


//渲染 卡片資料到網頁上
function renderData(data){
  let str = "";
  if(data.length == 0){
    cantFindArea.style.display = "block";  //查無資料區塊-顯示
  }else{
    cantFindArea.style.display = "none";   //查無資料區塊-隱藏
    data.forEach((item) => {
      //設定 tempId 做為新增資料使用
      if(item.id > tempId){
        tempId = item.id;
      }
      //組HTML字串
      str += `<li class="ticket-card">
      <div class="ticket-card-img mb-5">
        <a href="#">
          <img src=${item.imgUrl} alt="photo-travel">                
        </a>
        <div class="ticket-card-location fs-m px-5 py-2">${item.area}</div>
        <div class="ticket-card-rank px-2 py-1">${item.rate}</div>
      </div>
      <div class="ticket-card-content d-flex flex-column justify-content-between px-5">
        <div>
          <h2 class="fs-l fw-medium text-primary mb-4">${item.name}</h2>
          <p class="mb-8 text-gray-dark">
            ${item.description}
          </p>
        </div>
        <div class="d-flex justify-content-between align-items-center text-primary mb-4">
          <p class="fw-medium">
            <span class="material-icons-outlined mr-1">
              error
            </span>
            剩下最後 ${item.group} 組
          </p>
          <div class="d-flex align-items-center">
            <span class="fw-medium mr-1">TWD</span>
            <span class="fs-xl fw-medium">$${separator(item.price)}</span>
          </div>
        </div>
      </div>
    </li>`;
    })
  }
  ticketCardArea.innerHTML = str;
  countsSearchResult.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

//渲染 cs 圖表 到網頁上
function renderC3(data){
  // 篩選地區，並累加數字上去
  // locationObj 會變成 {台北: 1, 台中: 1, 高雄: 1}
  let locationObj = {}; //宣告一個物件，用來存放地區統計資料
  data.forEach((item) =>{
    if(locationObj[item.area] == undefined){
      locationObj[item.area] = 1;
    }else{
      locationObj[item.area] += 1;
    }
  })

  //為了使用c3.js圖表套件，須將locationObj的資料轉成【陣列】格式
  // arrData = [["台北",1], ["台中", 1], ["高雄", 2]]
  let arrData = [];  //宣告一個陣列格式，用來存放地區統計資料(規格需跟c3.js的資料要求相同)
  let location = Object.keys(locationObj); //物件轉陣列，將物件的key值放到陣列中, 如location output ["台北","台中","高雄"]
  location.forEach((item) => {
    let arr = []; //宣告一個陣列，用來組資料，預期: ["台北",1]
    arr.push(item); //將item值放到arr陣列中，如 ["台北"]
    arr.push(locationObj[item]); //再從locationObj中將屬性的值加入arr陣列中，加入後變成 如 ["台北", 1]
    arrData.push(arr);  //最後將 arr組出來的陣列加入陣列 arrData中，如 [["台北", 1]] (符合c3.js資料格式)
  })

  // 將 組好的arrData資料 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: arrData,
      type : 'donut',
      colors:{
        台北: "#26BFC7",
        台中: "#5151D3",
        高雄: "#E68619"
      }
    },
    donut: {
      title: "套票地區比重",
      width: 20,
      label: {
        show: false
      }
    },
    size:{
      width: 200,
      height: 200
    }   
  });
}

// 驗證表單欄位
validateForm(addForm, addFormInputs);

//監聽 新增套票按鈕 綁定 click 監聽事件
btnAddTicket.addEventListener('click',(e) =>{
  const arrVerifyMsgs = document.querySelectorAll('[data-MsgName]'); //驗證訊息元素
  let chkMsg = chkFormValue(addFormInputs, arrVerifyMsgs);
  // console.log(chkMsg);
  if(chkMsg != "") { //若有驗證不過的訊息，alert提醒
    alertFormVerifyMsg();
  } else {
    let obj = {}; //宣告一個物件，用來存放新增的套票內容
    obj.id = ++tempId;
    obj.name = ticketName.value;
    obj.imgUrl = ticketImgUrl.value;
    obj.area = ticketLocation.value;
    obj.description = ticketDescription.value;
    obj.rate = ticketRate.value;
    obj.group = ticketNum.value;
    obj.price = separator(ticketPrice.value); //數字三位一撇(如 1,000)
    obj.isTimeLimit = false;
    data.push(obj);
    renderData(data);
    renderC3(data);
    addForm.reset(); //清空表單欄位 (助教建議優化功能)
  }
})

//監聽 下拉選單-地區搜尋, 綁定 change 監聽事件
locationSearch.addEventListener('change', (e)=>{
  // console.log(e.target.value);
  // 取出 option 內的 value 值
  if(e.target.value == "全部地區") {
    renderData(data);
  } else {
    let filterData = data.filter((item) =>{
      return item.area == e.target.value;
    })
    renderData(filterData);
  }
})

//檢查、驗證新增套票的input欄位是否符合要求
function chkFormValue(addFormInputs, arrVerifyMsgs){
  let str = "";
  //檢查欄位是否空白
  addFormInputs.forEach((item)=>{
    if(item.value == "") {
      str += `欄位【${item.name}】不可空白，請填寫。\n`;
    }
  })
  //檢查是否有驗證未過的訊息
  arrVerifyMsgs.forEach((item)=>{
    if(item.textContent != "") {
      str += `${item.textContent}\n`;
    }
  })
  return str;
}

//數字 三位一撇
function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}
// 表單驗證訊息Alert (SweetAlert)
function alertFormVerifyMsg(){
  swal({
    title: "請確認表單欄位【不可空白】、且【完整填寫】再點擊【新增套票】。",
    icon: "warning",
    buttons: true,
    dangerMode: true
  });
}
