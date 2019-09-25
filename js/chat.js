var back = document.getElementById('back');
var nickName = document.getElementById('nickname');
var setting = document.getElementById('setting');
var content = document.getElementsByClassName('content')[0];
var ipt = document.getElementById('ipt');
var send = document.getElementById('send');
var dataLength = 0;
let userinfo = localStorage.userinf ? JSON.parse(localStorage.userinf) : null;

//将自己发送的消息显示到聊天框
// function showYou(){
//     if(ipt.value == ''){
//         return;
//     }else{
//         content.innerHTML += `<div id="you">
//         <img src="../img/me.png">
//         <p id="yourmessage"><span>${ipt.value}</span></p>
//         </div>`;
//             // content.scrollTop = content.scrollHeight;
//         ipt.value = '';
//     }
// };

//将好友的消息显示到聊天框
// function showFriend(){
//     // if(data.length > dataLength){
//     //     for(var i = data.length - dataLength; i<data.length; i++){
//     //         content.innerHTML += `<div id="friend">
//     //     <img src="../img/friend.png">
//     //     <p id="friendmessage">${data[i].message}</p>
//     // </div>`;
//     //     dataLength++;
//     //     }
//     // }else{
//     //     return;
//     // }
//     // for(const item in data){
//     //    var message = data[item].message;
//     //     content.innerHTML += `<div id="friend">
//     //     <img src="../img/friend.png">
//     //     <p id="friendmessage"><span>${message}</span></p>
//     //     </div>`;
//     // }
// };



var ll = window.location.href;//获取当前页面的url
var aa = ''
console.log(ll);
//解析url
function parseURL(url) {
    var url = url.split("?")[1];
    var para = url.split("&");
    var len = para.length;
    var res = {};
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr = para[i].split("=");
        res[arr[0]] = arr[1];
    }
    // console.log(1);
    console.log(res);
    aa = res
}
parseURL(ll);
aa2 = aa.q
let friendList = localStorage.friendList ? JSON.parse(localStorage.friendList) : null;//调用localStorage.friendList
// console.log(friendList)
//过滤器
var data = friendList.filter(function (item) {
    return item.user_id == aa2;
})
console.log(data);
$('#nickname').html(data[0].nickname)

//发送消息接口：
let url4 = 'http://118.24.25.7/chat_api/interface/sendMessage.php';
function sendMessage() {
    $('#send').on('click', function () {
        let tex = $('#ipt').val()
        $.ajax({
            url: url4,
            type: "POST",
            dataType: 'json',
            data: {
                sign_str: userinfo.sign_str,
                user_id: userinfo.id,
                receive_user_id: aa2,
                message: tex
            },
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    if (ipt.value == '') {
                        return;
                    } else {
                        content.innerHTML += `<div id="you">
                        <img src="http://118.24.25.7/${localStorage.head_logo}">
                        <p id="yourmessage"><span>${ipt.value}</span></p>
                        </div>`;
                        ipt.value = '';
                        content.lastElementChild.scrollIntoView();
                    }
                    console.log('发送成功');
                    localStorage.tex = tex;


                };
            },
            error: function (res) {
                console.log(res);
            }

        })
    })


};
sendMessage();
//回车发送消息：
$(".bottom").keydown(function (e) {
    // console.log(11)
    var e = e || event,
        keycode = e.which || e.keyCode;
    if (keycode == 13) {
        $("#send").trigger("click");
        // console.log(1)
    }
});


// 获取消息接口:
let url5 = 'http://118.24.25.7/chat_api/interface/getMessages.php'
function getMessage() {
    $.ajax({
        url: url5,
        type: "GET",
        dataType: 'json',
        data: {
            sign_str: userinfo.sign_str,
            user_id: userinfo.id,
        },
        success: function (res) {
            console.log(res);
            data = res.data;
            if (res.code == 0) {
                console.log(res);
                console.log('收到');
                for (const item in data) {
                    var message = data[item].message;
                    content.innerHTML += `<div id="friend">
                    <img src="http://118.24.25.7/chat_api${data[0].head_logo}">
                    <p id="friendmessage"><span>${message}</span></p>
                    </div>`;
                    content.lastElementChild.scrollIntoView();
                }
                getMessage();
            }
        },
        error: function (res) {
            console.log(res);
            getMessage();
        }

    })

};
getMessage();

//获取历史消息记录:

let url13 = 'http://118.24.25.7/chat_api/interface/getChatHistory.php'
function getChatHistory() {

    $.ajax({
        url: url13,
        type: "GET",
        dataType: 'json',
        data: {
            sign_str: userinfo.sign_str,
            user_id: userinfo.id,
            friend_id: aa2,
        },
        success: function (res) {
            console.log(res);
            let history = res.data;
            if (res.code == 0) {
                console.log(res);
                console.log('获取历史消息成功');
                for (const item in history) {
                    if (history[item].user_id == aa2) {
                        content.innerHTML += `<div id="friend">
                    <img src="http://118.24.25.7/chat_api${data[0].head_logo}">
                    <p id="friendmessage"><span>${history[item].message}</span></p>
                    </div>`;
                        content.lastElementChild.scrollIntoView();
                    } else {
                        content.innerHTML += `<div id="you">
                        <img src="http://118.24.25.7/${localStorage.head_logo}">
                        <p id="yourmessage"><span>${history[item].message}</span></p>
                        </div>`;
                        content.lastElementChild.scrollIntoView();
                    }
                }

            }
        },
        error: function (res) {
            console.log(res);
        }

    })
}
getChatHistory();
