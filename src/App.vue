<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
#app,body,html {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 10px;
  background: #f2f2f2;
}
.none{display: none}
p{ font-size: 1.6rem; margin: 0}
*{box-sizing: border-box;}
a{text-decoration: none; color: #000;}
a:active{ color: #000;}
.content{display: flex;  align-items: flex-start;}
.center{text-align: center!important;}
.right{text-align: right!important;}
.profile-title{
  font-size: 2.6rem;
  color: #8f8f8f;
  margin-bottom: 15px;
}
.save-info{
  cursor: pointer;
  background: #FCC883;
  font-size: 1.6rem;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  margin-bottom: 15px;
}
.profile-inp{
  display: block;
  width: 100%;
  height: 30px;
  margin: 10px auto;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 5px;
  background: transparent;
  outline: none;
}
.table{width: 100%}
.content-add{
  background: #fff;
  max-width: 1140px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 15px;
}
.text-info label{
  margin: 7px auto;
  display: block;
}
.name-input{
  font-size: 1.2rem;
  color: #8f8f8f;
}
.quill-editor{
  margin: 5px auto;
}
.textarea-inp{
  width: 100%;
  max-width: 100%;
  margin: 5px auto 15px auto;
  min-height: 100px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 5px;
  background: transparent;
  outline: none;
}
.calendar{ margin: 10px auto 20px auto;}
.vc-container.vc-is-expanded{margin: 0}
.max-width-calendar{max-width: 50%; width: 100%; margin: 0 auto}
.title-confirm{
  text-align: center;
  font-weight: 500;
  margin-bottom: 10px;
}
.desc-confirm{
  text-align: center;
  color: #737373;
}
.new {background: #ffc400}
.process{background: #00f7ff}
.completed{background: #7af97a;}

/* tasks project*/
.us-task{display: flex; justify-content: flex-start}
.img-us-task{
  width: 25px;
  height: 25px;
  object-fit: cover;
  object-position: top center;
  border: 1px solid rgb(255, 249, 244);
  border-radius: 50px;
}
.vertical {
  vertical-align: middle !important;
}
.vgt-table thead th {background: rgb(255, 243, 232); font-weight: 400}
.vgt-table tbody {font-size: 1.2rem}
.deadline-start span{
  padding: 2px 5px;
  background: #d7ede9;
  border-radius: 5px;
  font-size: 1.2rem;
}
.deadline-end span{
  padding: 2px 5px;
  background: #edd7d7;
  border-radius: 5px;
  font-size: 1.2rem;
}
.project-td{background: rgb(255, 249, 244);}
.status-task{
  padding: 5px 7px;
  border-radius: 5px;
  border: none;
  line-height: 1.2rem;
}
.vgt-global-search{align-items: center}


</style>
