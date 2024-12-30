<template>
  <div class="coordinate-converter">
    <h2>Chuyển đổi tọa độ WGS84 sang VN2000 (Gia Lai)</h2>
    <div>
      <label for="latitude">Vĩ độ (WGS84):</label>
      <input
        type="number"
        v-model="latitude"
        id="latitude"
        placeholder="Nhập vĩ độ WGS84"
      />
    </div>
    <div>
      <label for="longitude">Kinh độ (WGS84):</label>
      <input
        type="number"
        v-model="longitude"
        id="longitude"
        placeholder="Nhập kinh độ WGS84"
      />
    </div>
    <button @click="convertCoordinates">Chuyển đổi</button>

    <div v-if="convertedCoordinates">
      <h3>Kết quả (VN2000 - Gia Lai):</h3>
      <p>X: {{ convertedCoordinates[0] }}</p>
      <p>Y: {{ convertedCoordinates[1] }}</p>
    </div>
  </div>
</template>

<script>
import proj4 from "proj4";

export default {
  name: "CoordinateConverter",
  data() {
    return {
      latitude: null,
      longitude: null,
      convertedCoordinates: null,
    };
  },
  methods: {
    convertCoordinates() {
      // Kiểm tra nếu latitude và longitude có giá trị hợp lệ
      if (
        this.latitude === null ||
        this.longitude === null ||
        isNaN(this.latitude) ||
        isNaN(this.longitude)
      ) {
        alert("Vui lòng nhập giá trị số hợp lệ cho cả vĩ độ và kinh độ.");
        return;
      }

      // Định nghĩa hệ tọa độ WGS84 và VN2000 (Gia Lai)
      const WGS84 = "+proj=longlat +datum=WGS84 +no_defs";
      const VN2000_GiaLai =
        "+proj=tmerc +lat_0=0 +lon_0=108.25 +k=0.9999 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs";

      // Thực hiện chuyển đổi
      this.convertedCoordinates = proj4(WGS84, VN2000_GiaLai, [
        parseFloat(this.longitude),
        parseFloat(this.latitude),
      ]);
    },
  },
};
</script>

<style scoped>
.coordinate-converter {
  max-width: 400px;
  margin: auto;
  text-align: left;
}
label {
  display: block;
  margin-top: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  margin-top: 15px;
  padding: 10px 20px;
}
</style>
