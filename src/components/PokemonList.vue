<template>
  <div>
    <ul class="pokemon-list">
      <li v-for="(pokemon, index) in pokemonList" :key="index">
        <pokemon-card :details="pokemon" />
      </li>
    </ul>
  </div>
</template>

<script>
import PokemonCard from "./PokemonCard";
export default {
  name: "PokemonList",
  components: {
    PokemonCard
  },
  data() {
    return {
      pokemonList: [],
      limit: 20,
      nextUrl: "",
      maxCount: 0
    };
  },
  mounted() {
    // add scroll listener for fetching next batch of results
    this.$nextTick(() => {
      window.addEventListener("scroll", this.onScroll);
      this.onScroll(); // needed for initial loading on page
    });
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=0`;
    this.getPokemonList(url);
  },
  methods: {
    async getPokemonList(url) {
      const {
        data: { count, next, results }
      } = await this.$http(url);
      this.pokemonList.push(...results);
      this.nextUrl = next;
      if (!this.maxCount) this.maxCount = count;
    },
    fetchNextResults() {
      if (this.maxCount > this.pokemonList.length)
        this.getPokemonList(this.nextUrl);
    },
    onScroll() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        this.fetchNextResults();
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style lang="scss" scoped>
.pokemon-list {
  width: calc(100% - 24px);
  list-style-type: none;
  margin: 12px auto;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
