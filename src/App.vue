<template>
  <div class="VueXlsx">
    <v-card height="100%" class="big-card">
      <v-tabs v-model="tab" background-color="primary" dark>
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card height="100%" class="big-card">
            <v-card-text>
              <component v-bind:is="item.content"></component>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import BAOCAO1 from "./BAOCAO1";
import BAOCAO2 from "./BAOCAO2";
import BAOCAO3 from "./BAOCAO3";
import BAOCAO4 from "./BAOCAO4";
import BAOCAO5 from "./BAOCAO5";
import BAOCAO6 from "./BAOCAO6";
export default {
  components: {
    BAOCAO1,
    BAOCAO2,
    BAOCAO3,
    BAOCAO4,
    BAOCAO5,
    BAOCAO6,
  },
  data() {
    return {
      tableTitle: "MTP",
      tab: 0,
      items: [
        { tab: "Get Token", content: "BAOCAO1" },
        // { tab: "Get tọa độ", content: "BAOCAO2" },
        // { tab: "Tạo object", content: "BAOCAO3" },
        // { tab: "Clone quy trình DD", content: "BAOCAO4" },
        // { tab: "Clone xã", content: "BAOCAO5" },
        // { tab: "DVCLT", content: "BAOCAO6" },
      ],
    };
  },
  methods: {},
};
</script>

<style></style>
