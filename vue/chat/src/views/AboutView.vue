<template>
  <header class="chathead">
    <span class="header-name">text</span>
    <nav>
     <img class="img1" src="icons8-수색-50.png" alt="검색이미지" />
     <img class="img2" src="icons8-둥근-메뉴-50.png" alt="메뉴이미지" />
    </nav>
  </header>
  <div class="chatbg">
  <div class="chatbg-ul" v-for="chat in chatlist" :key="chat">
  <li class="chatbg-list">{{time}} <span class="chatbg-text">{{chat}}</span></li>
  </div>
  </div>
  <div class="chatbg2">
  <input class="chatst" type="text" @keyup.enter="chating()"   placeholder="채팅을 입력해주세요" v-model="chatmessage">
</div>
</template>

<script>
/* eslint-disable */
import dayjs from 'dayjs'
export default {
  name: "app",
  data() {
    return {
      chatlist : [],
      chatmessage: "",
      time: dayjs().format('HH:mm'),
      target:""
    };
  },
  methods: {
    chating(){
      let chatbg = document.querySelector('.chatbg')
      console.log(this.chatmessage);
      this.chatlist.push(this.chatmessage);
      this.chatmessage = ""
      chatbg.scrollTop = chatbg.scrollHeight
    }
  },
};
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chathead{
  background-color: chartreuse;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-name{
  margin: 0.5rem;
  padding: 0;
}
.chatbg{
  background-color: chartreuse;
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height:535px;
  overflow-y: auto; /*태그 안에 벗어나지 않게 하고 벗어난다면 스크롤바 생성*/
}
.chatbg::before{
content: "";
display: block;
flex: 1;
}
.chatbg-ul{
  display: flex;
  flex-direction: row;
  justify-content: flex-end
}
.chatbg-list{
  list-style: none;
  font-size: 1.5rem;
  margin: 2.5rem;
  border-radius: 15px;
}
.chatbg-text{
background-color: yellowgreen;
box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
padding: 1rem;
}
.chatst{
  width: 100%;
  height: 3rem;
  font-size: 1.5rem;
}
</style>
