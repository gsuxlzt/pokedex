import Vue from "vue";
import VueRouter from "vue-router";
import PokemonList from "@/components/PokemonList";
import PokemonDetails from "@/components/PokemonDetails";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "PokeList",
    component: PokemonList
  },
  {
    path: "/:pokemon",
    name: "PokeDetails",
    component: PokemonDetails
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
