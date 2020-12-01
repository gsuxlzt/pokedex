<template>
  <div
    class="pokemon-card"
    v-if="hasPokemonData"
    :style="{ '--bg-color': getColorFromType() }"
    @click="goToPokemonDetails"
  >
    <div class="pokemon-number">
      <b>#{{ getPokeNumber() }}</b>
    </div>
    <div class="image">
      <img :src="pokemonData.sprites['front_default']" />
    </div>
    <h3 class="name">{{ capitalizeName(pokemonData.name) }}</h3>
  </div>
</template>

<script>
import { capitalize } from '@/utils/functions/helpers';
import { TYPE_COLORS } from "@/utils/constants/constants";
export default {
  name: "PokemonCard",
  props: {
    details: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pokemonData: {},
      hasPokemonData: false
    };
  },
  async mounted() {
    const { url } = this.details;
    await this.getPokemonDetails(url);
  },
  methods: {
    async getPokemonDetails(url) {
      const { data } = await this.$http(url);
      this.pokemonData = data;
      this.hasPokemonData = true;
    },
    goToPokemonDetails() {
    this.$router.push({path:this.pokemonData.name});
    },
    getColorFromType() {
      const type = this.pokemonData.types[0].type.name;
      return TYPE_COLORS[type];
    },
    prepareData(data) {
      this.pokemonData = data;
      console.log(data);
    },
    capitalizeName(name) {
      return capitalize(name);;
    },
    getPokeNumber() {
      return `000${this.pokemonData.id}`.slice(-4);
    }
  }
};
</script>

<style lang="scss" scoped>
.pokemon-card {
  width: 250px;
  height: 250px;
  margin: 8px;
  padding: 12px;
  border: 1px solid white;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
}
</style>
