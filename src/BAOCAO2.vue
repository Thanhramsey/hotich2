<template>
  <div>
    <v-container>
      <!-- File Upload -->
      <v-file-input
        label="Upload Excel File"
        accept=".xlsx, .xls"
        v-model="file"
      ></v-file-input>

      <!-- Progress Linear -->
      <v-progress-linear
        v-if="progress > 0 && progress < 100"
        :value="progress"
        height="10"
        color="blue"
        class="my-4"
      ></v-progress-linear>

      <!-- Process Button -->
      <v-btn @click="processFile"> Process Addresses </v-btn>

      <!-- Processed Addresses Table -->
      <v-data-table
        v-if="processedAddresses.length > 0"
        :headers="headers"
        :items="processedAddresses"
        class="mt-4"
      >
        <template v-slot:item.coordinates="{ item }">
          <span v-if="item.coordinates.lat">
            {{ item.coordinates.lat }}, {{ item.coordinates.lon }}
          </span>
          <span v-else>{{ item.coordinates }}</span>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import axios from "axios";

export default {
  data() {
    return {
      file: null, // For storing the uploaded file
      addresses: [], // Array to hold the addresses from the Excel file
      processedAddresses: [], // Array to hold the processed addresses with coordinates
      progress: 0, // To track the progress percentage
      totalAddresses: 0, // Total number of addresses to process
      headers: [
        { text: "Address", value: "address" },
        { text: "Coordinates", value: "coordinates" },
      ],
    };
  },
  methods: {
    async processFile() {
      if (!this.file) return;

      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Clear existing addresses and processed data
        this.addresses = [];
        this.processedAddresses = [];

        json.forEach((row, index) => {
          if (index > 0) {
            let simAddress = this.simplifyAddress(row[1]);
            this.addresses.push(simAddress); // Assuming column 2 is the address
          }
        });

        this.totalAddresses = this.addresses.length;
        await this.processAddresses();
      };

      reader.readAsArrayBuffer(this.file);
    },

    async processAddresses() {
      for (let i = 0; i < this.addresses.length; i++) {
        const address = this.addresses[i];
        const coordinates = await this.getCoordinates(address);
        this.processedAddresses.push({
          address,
          coordinates,
        });

        // Update progress
        this.progress = Math.round(((i + 1) / this.totalAddresses) * 100);
      }

      this.downloadProcessedFile(); // Call method to download the file
    },

    async getCoordinates(address) {
      // let simplifiedAddress = this.simplifyAddress(address);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: address,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          return { lat: response.data[0].lat, lon: response.data[0].lon };
        } else {
          return await this.findNearby(address);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return "Không tìm thấy";
      }
    },

    async findNearby(address) {
      const simplifiedAddress = this.simplifyAddress(address);

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: simplifiedAddress,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          return { lat: response.data[0].lat, lon: response.data[0].lon };
        } else {
          return "Không tìm thấy";
        }
      } catch (error) {
        console.error("Error fetching nearby coordinates:", error);
        return "Không tìm thấy";
      }
    },

    simplifyAddress(address) {
      const replacements = [
        { find: "\\bTP\\.?\\s*\\b", replace: "Thành phố " },
        { find: "\\bTp\\.?\\s*\\b", replace: "Thành phố " },
        { find: "\\bp\\.\\s*\\b", replace: "Phường " },
        { find: "\\bP\\.\\s*\\b", replace: "Phường " },
        { find: "\\bQ\\.\\s*\\b", replace: "Quận " },
        { find: "\\bH\\.\\s*\\b", replace: "Huyện " },
        { find: "\\bh\\.\\s*\\b", replace: "Huyện " },
        // { find: "\\bT\\.\\s*\\b", replace: "Tổ " },
        { find: "\\bHẻm\\b", replace: "" },
      ];

      let simplifiedAddress = address;

      // Sử dụng biểu thức chính quy để thay thế chính xác
      replacements.forEach((item) => {
        simplifiedAddress = simplifiedAddress.replace(
          new RegExp(item.find, "gi"),
          item.replace
        );
      });

      return simplifiedAddress;
    },

    downloadProcessedFile() {
      const wsData = [
        ["STT", "Địa chỉ", "Tọa độ"],
        ...this.processedAddresses.map((item, index) => [
          index + 1,
          item.address,
          item.coordinates.lat
            ? `${item.coordinates.lat}, ${item.coordinates.lon}`
            : item.coordinates,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Processed Addresses");

      XLSX.writeFile(wb, "Processed_Addresses.xlsx");
    },
  },
};
</script>

<style scoped>
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
