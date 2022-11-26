//透過 validate.js套件驗證表單
export default function validateForm(addForm, addFormInputs){
  const constraints = {
    "套票名稱": {
      presence: {
        message: "是必填欄位"
      },
    },
    "圖片網址":{
      presence: {
        message: "是必填欄位"
      },
      url: {
        message: "需為http或https的網址格式"
      }
    },
    "景點地點":{
      presence: {
        message: "是必填欄位"
      },
    },
    "套票金額":{
      presence: {
        message: "是必填欄位"
      },
      numericality: {
        greaterThan: 0,
        message: "必須大於 0"
      }
    },
    "套票組數":{
      presence: {
        message: "是必填欄位"
      },
      numericality: {
        greaterThan: 0,
        message: "必須大於 0"
      }
    },
    "套票星級":{
      presence: {
        message: "是必填欄位"
      },
      numericality: {
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 10,
        message: "必須符合 1-10 的區間"
      }
    },
    "套票星級":{
      presence: {
        message: "是必填欄位"
      },
    },
    "套票描述":{
      presence: {
        message: "是必填欄位"
      },
      length: {
        maximum: 50,
        message: "不能超過50個字"
      }
    }
  };

  let errMsgs = {};
  // console.log(addFormInputs);
  addFormInputs.forEach((item) => {
    // console.log(item);
    item.addEventListener("change", ()=>{
      //預設驗證提示訊息為空值
      // console.log(item.parentNode.nextElementSibling); //取得父層元件的下一個元件 (為取得 <p>標籤)
      item.parentNode.nextElementSibling.textContent = "";
  
      //驗證回傳的內容 (物件格式)
      errMsgs = validate(addForm, constraints);
  
      //呈現在畫面上
      if(errMsgs){
        Object.keys(errMsgs).forEach((keys) =>{
          document.querySelector(`[data-msgName=${keys}]`).textContent = errMsgs[keys];
        })
      }
      // console.log(errMsgs);
    })
  })
}