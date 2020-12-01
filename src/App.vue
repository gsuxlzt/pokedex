<template>
  <div id="app">
        <div class="header">
            <div class="logo-container">
                <img src="/img/pokemon-logo.png" />
            </div>
            <div class="search-container">
                <search-bar />
            </div>
        </div>
   <router-view />
  </div>
</template>

<script>
import SearchBar from './components/SearchBar';
export default {
    components: {
        SearchBar
    }
}
</script>

<style lang="scss">

    * {
        box-sizing: border-box;
    }
#app {
    width: 100%;
    margin: 10px auto;
    @include respond-to(md) {
        max-width: 1440px;
    }
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        div {
            padding: 4px;
        }

        .logo-container {
            max-width: 350px;
            text-align: center;
            img {
                width: 100%;
                object-fit: contain;
            }
        }
    }
}

</style>
