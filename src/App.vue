<script>
import DcHeader from './components/AppHeader';
import DcContent from './components/Content';

export default {
  name: 'RightPanel',
  components: {
    DcHeader,
    DcContent,
  },
};
</script>

<template>
  <div id="app">
    <div id="data-collector">
      <dc-header/>
      <dc-content/>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&subset=latin-ext');
@import url('/src/assets/variable.css');

body {
  font-family: 'Open Sans', sans-serif;
  padding: 0;
  margin: 0;
  background: var(--dc-color);
}

#data-collector {
  position: fixed;
  right: 30px;
  bottom: 30px;
  overflow: hidden;
  background-color: #fff;
  width: 400px;
  height: 400px;
  -webkit-box-shadow: 0px 0px 20px -9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 20px -9px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 20px -9px rgba(0, 0, 0, 0.75);
  z-index: 99999999;
}
</style>
