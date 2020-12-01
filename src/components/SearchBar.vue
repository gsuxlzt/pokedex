<template>
  <div class="dropdown">
    <div class="searchbar" v-if="!selectedPokemon">
      <input
        ref="dropdowninput"
        v-model.trim="searchedPokemon"
        class="dropdown-input"
        type="text"
        placeholder="Search for a pokemon"
      />
      <button><i class="material-icons">search</i></button>
    </div>
    <div v-else @click="resetSelection" class="dropdown-selected">
      {{ selectedPokemon }}
    </div>
    <div v-if="searchedPokemon && filteredSearch.length" class="dropdown-list">
      <div
        @click="selectItem(item)"
        v-for="item in filteredSearch"
        :key="item.name"
        class="dropdown-item"
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-else-if="searchedPokemon && !filteredSearch.length"
      class="dropdown-list error"
    >
      <span>Sorry, there is no pokemon with that name.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchedPokemon: "",
      filteredSearch: "",
      pokemonList: "",
      selectedPokemon: ""
    };
  },
  watch: {
    searchedPokemon(newVal) {
      if (newVal)
        this.filteredSearch = this.pokemonList.filter(
          x =>
            // exclude selected pokemon from search results
            x.name.includes(newVal) && x.name !== this.$route.params.pokemon
        );
      else this.filteredSearch = [];
    }
  },
  async mounted() {
    // fetch all available pokemon since it's relatively small
    const url = "https://pokeapi.co/api/v2/pokemon?limit=1117";
    const {
      data: { results }
    } = await this.$http(url);
    this.pokemonList = results;
  },
  methods: {
    selectItem({ name }) {
      this.selectedPokemon = name;
      this.searchedPokemon = "";
      this.$router.push({ path: `/${name}` });
    },
    resetSelection() {
      this.selectedPokemon = "";
      this.$nextTick(() => this.$refs.dropdowninput.focus());
      this.$emit("on-item-reset");
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 100%;
  min-width: 250px;
  margin: 0 auto;

  .searchbar {
    display: flex;

    button {
      border: none;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  .dropdown-input,
  .dropdown-selected {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid transparent;
    background: #edf2f7;
    line-height: 1.5em;
    outline: none;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    &:focus,
    &:hover {
      background: #fff;
      border-color: #e2e8f0;
    }

    &::placeholder {
      opacity: 0.7;
    }
  }
  .dropdown-selected {
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }

  .dropdown-list {
    position: absolute;
    width: 100%;
    min-height: 150px;
    max-height: 150px;
    padding-top: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    &.error {
      color: #f44336;
      padding: 8px 0 8px 16px;
      width: calc(100% - 16px);
      font-size: 13px;
    }
    .dropdown-item {
      width: 100%;
      padding: 11px 16px;
      cursor: pointer;

      &:hover {
        background: #edf2f7;
      }
    }
  }
}
</style>
