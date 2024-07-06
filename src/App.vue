<template>
  <v-app id="odysseia">
      <v-app-bar
          floating
          color="triadic"
      >

        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Odysseia Greek</v-app-bar-title>
        <v-menu
            v-model="menu"
            activator="parent"
            :close-on-content-click="true"
            location="left"
        >
          <v-list
              nav min-width="30em"
              style="background-color: #e0f7fa"
          >
            <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.path" link>
              <v-icon>{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    <v-main>
      <router-view></router-view>
      <v-btn
          v-show="fab"
          @click="toTop"
          color="triadic"
          size="large"
          icon="mdi-arrow-up"
          style="position: fixed; bottom: 16px; right: 16px; z-index: 1000;"
      >

      </v-btn>
      <v-footer color="background">
        <v-card flat width="100%" class="footer lighten-1 text-center" color="footer">
          <v-card-text>
            <v-btn
                class="ma-2"
                :href="item.path"
                v-for="item in footerItems"
                :key="item.icon"
                :icon="item.icon"
                variant="text"
            >
            </v-btn>

          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} — <strong>Odysseia</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const fab = ref(false);
    const appTitle = ref('Odysseia');
    const closeOnClick = ref(true);
    const menu = ref(false);
    const footerItems = ref([
      { icon: 'mdi-github', path: 'https://github.com/odysseia-greek' },
      { icon: 'mdi-linkedin', path: 'https://nl.linkedin.com/in/joeri-vrijaldenhoven-22713a80' },
      { icon: 'mdi-book-open-outline', path: '/ploutarchos/' },
    ]);
    const menuItems = ref([
      { title: 'Home', path: '/', icon: 'mdi-home-variant' },
      { title: 'Quiz', path: '/quiz', icon: 'mdi-alphabet-greek' },
      { title: 'Texts', path: '/texts', icon: 'mdi-bookshelf' },
      { title: 'Grammar', path: '/grammar', icon: 'mdi-feather' },
      { title: 'Dictionary', path: '/dictionary', icon: 'mdi-magnify' },
    ]);

    const onScroll = (e) => {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      fab.value = top > 20;
    };

    const toTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMounted(() => {
      window.addEventListener('scroll', onScroll);
    });

    return {
      fab,
      appTitle,
      closeOnClick,
      footerItems,
      menuItems,
      menu,
      onScroll,
      toTop,
    };
  },
};
</script>


<style>
.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}
</style>
