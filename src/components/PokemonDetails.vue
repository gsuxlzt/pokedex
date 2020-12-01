<template>
  <div v-if="hasData">
    <div v-if="hasErrors" class="error-container">
      <h1 class="error-header">SORRY</h1>
      <img src="/img/pokeball.png" />
      <h4 class="error-message">
        The Pokémon you are looking for cannot be found.
      </h4>
    </div>
    <div v-else class="details-container">
      <div class="general-details">
        <h1>{{ capitalizeName(details.name) }}</h1>
        <div class="type-cards">
          <span
            v-for="type in details.types"
            :key="type.type.name"
            class="type"
            :style="{ '--bg-color': getColorFromType(type.type.name) }"
          >
            {{ type.type.name }}
          </span>
        </div>
        <img class="sprite" :src="details.sprites[spriteToShow]" />
        <p class="desc">{{ getFlavorText() }}</p>
      </div>
      <div class="detail-group">
        <div class="size-details">
          <h4>General Info</h4>
          <div class="info" v-for="details in sizeDetails" :key="details.name">
            <label> {{ details.name }}: </label>
            <span>
              {{ details.value }}
            </span>
          </div>
        </div>
        <div class="abilities-details">
          <h4>Abilities</h4>
          <div
            class="info"
            v-for="ability in details.abilities"
            :key="ability.slot"
          >
            <h5>{{ ability.ability.name }}</h5>
          </div>
        </div>
      </div>
      <div class="stat-details">
        <div class="stat" v-for="stats in statsDetails" :key="stats.name">
          <label>{{ stats.name }}</label>
          <div
            class="stat-bar"
            :style="{ '--bar-width': `${(stats.value / totalStats) * 100}%` }"
          ></div>
        </div>
      </div>
      <div class="typing-details" v-if="hasType">
        <h4>Typing</h4>
        <p>Weak against:</p>
        <div class="type-cards">
          <span
            v-for="type in weakAgainst()"
            :key="type"
            class="type"
            :style="{ '--bg-color': getColorFromType(type) }"
          >
            {{ type }}
          </span>
        </div>
        <p>Strong against:</p>
        <div class="type-cards">
          <span
            v-for="type in strongAgainst()"
            :key="type"
            class="type"
            :style="{ '--bg-color': getColorFromType(type) }"
          >
            {{ type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalize } from "@/utils/functions/helpers";
import { TYPE_COLORS } from "@/utils/constants/constants";

export default {
  name: "PokemonDetails",
  data() {
    return {
      details: {},
      typing: {},
      hasErrors: false,
      hasData: false,
      hasType: false,
      spriteToShow: "front_default",
      spriteChange: null
    };
  },
  watch: {
    async $route(to, from) {
      // path changed
      if (to.params.pokemon !== from.params.pokemon) {
        clearInterval(this.spriteChange);
        this.hasType = false;
        const { pokemon } = to.params;
        await this.getPokemonData(pokemon);
        this.$nextTick(async () => {
          await this.getPokemonTyping();
        });
      }
    }
  },
  async mounted() {
    const { pokemon } = this.$route.params;
    await this.getPokemonData(pokemon);
    this.$nextTick(async () => {
      await this.getPokemonTyping();
      this.$forceUpdate();
    });
  },
  methods: {
    async getPokemonData(pokemon) {
      //fetch pokemon data
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
        const { data } = await this.$http(url);
        const speciesUrl = data.species.url;
        const res = await this.$http(speciesUrl);
        this.details = { ...data, ...res.data };

        this.spriteChange = setInterval(() => {
          const obj = {
            front_default: "back_default",
            back_default: "front_default"
          };
          // cycle through the sprites to have that turning effect
          if (!this.details.sprites[obj[this.spriteToShow]])
            clearInterval(this.spriteChange);
          else this.spriteToShow = obj[this.spriteToShow];
        }, 1200);
      } catch (e) {
        this.hasErrors = true;
      }
      this.hasData = true;
    },
    capitalizeName(name) {
      return capitalize(name);
    },
    getColorFromType(type) {
      return TYPE_COLORS[type];
    },
    getFlavorText() {
      return this.details.flavor_text_entries.find(
        f => f.language.name === "en"
      ).flavor_text;
    },
    async getPokemonTyping() {
      this.typing = {};
      await this.details.types.forEach(async type => {
        const {
          data: { damage_relations }
        } = await this.$http(type.type.url);
        Object.entries(damage_relations).forEach(([key, value]) => {
          if (this.typing[key]) {
            this.typing[key].push(...value);
          } else this.typing[key] = value;
        });
        this.hasType = true;
      });
    },
    getStrongTypes() {
      // strong types if double damage to, no damage from, and half damage from,
      const arr = [];
      console.log(this.typing.double_damage_to);
      this.typing["double_damage_to"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });

      this.typing["no_damage_from"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });

      this.typing["half_damage_from"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });
      return arr;
    },
    getWeakTypes() {
      // weak types if double damage from, no damage to, and half damage to
      const arr = [];
      this.typing["double_damage_from"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });

      this.typing["no_damage_to"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });

      this.typing["half_damage_to"].forEach(x => {
        if (!arr.includes(x.name)) arr.push(x.name);
      });
      return arr;
    },
    strongAgainst() {
      const str = this.getStrongTypes();
      const wk = this.getWeakTypes();
      return str.filter(s => !wk.includes(s));
    },
    weakAgainst() {
      const str = this.getStrongTypes();
      const wk = this.getWeakTypes();
      return wk.filter(s => !str.includes(s));
    }
  },
  computed: {
    sizeDetails() {
      const { color, habitat, shape, height, weight } = this.details;
      const obj = { color, habitat, shape, height, weight };
      const arr = [];
      Object.entries(obj).forEach(([key, val]) => {
        if (val && Object.prototype.hasOwnProperty.call(val, "name"))
          arr.push({ name: key, value: val.name });
        else if (val) {
          // height and weight values in m and kg
          arr.push({
            name: key,
            value: key === "weight" ? `${val / 10}kg` : `${val / 10}m`
          });
        }
      });

      return arr;
    },
    statsDetails() {
      const { stats } = this.details;
      return stats.map(stat => {
        const {
          base_stat,
          stat: { name }
        } = stat;
        return {
          name,
          value: base_stat
        };
      });
    },
    totalStats() {
      return this.statsDetails.reduce((a, b) => a + (b["value"] || 0), 0);
    }
  }
};
</script>

<style lang="scss">
.error-container {
  padding: 12px;
  margin: auto;
  width: 100%;
  max-width: 768px;
  .error-header {
    color: #f44336;
    margin: 8px 0;
  }
  img {
    width: 100%;
    object-fit: contain;
  }

  .error-message {
    margin: 8px 0;
  }
}
.details-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  margin: auto;
  padding: 16px;
  justify-content: center;
  align-items: center;

  @include respond-to(md) {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .general-details {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    border: 1px solid #f1f1f1;
    background: #f1f1f1;
    padding: 12px;
    margin: 8px;
    align-items: center;
    width: 100%;
    @include respond-to(md) {
      width: 420px;
    }

    .sprite {
      // max width of sprite
      max-width: 96px;
      object-fit: contain;
    }

    .desc {
      max-width: 250px;
      text-align: left;
    }
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 8px;

    @include respond-to(md) {
      width: 420px;
    }

    .size-details,
    .abilities-details {
      padding: 12px;
      margin: 8px 0;
      border: 1px solid black;
      text-align: left;
      h4 {
        margin: 8px 0;
      }
      .info {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 8px;

        label {
          text-align: left;
          min-width: 75px;
          margin-right: 4px;
        }
        span {
          font-weight: bold;
          margin-left: 4px;
        }
      }
    }

    .abilities-details {
      h5 {
        margin: 2px 0;
      }
    }
  }

  .stat-details {
    flex-basis: 70%;
    width: 100%;
    @include respond-to(md) {
      max-width: 550px;
    }
    padding: 12px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #8ddba7;
    .stat {
      width: 100%;
      margin: 4px;
      display: flex;
      justify-content: flex-start;
      label {
        color: #111;
        text-align: left;
        min-width: 120px;
      }

      .stat-bar {
        width: 100%;
        height: 20px;
        padding: 4px;
        background: #eee;

        &:after {
          content: "";
          display: block;
          background: #a7db8d;
          height: 100%;
          width: var(--bar-width);
        }
      }
    }
  }

  .typing-details {
    width: 100%;
    text-align: left;
    @include respond-to(md) {
      width: 360px;
    }
  }
}
.type-cards {
  display: flex;
  flex-wrap: wrap;
  .type {
    background: var(--bg-color);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    margin: 4px 8px;
  }
}
</style>
