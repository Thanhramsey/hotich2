<template>
  <v-container>
    <v-textarea v-model="input" label="Nhập các trường" rows="5"></v-textarea>

    <!-- Nút thứ 1: Tạo @JsonProperty -->
    <v-btn
      @click="generateJsonProperty"
      style="
        color: white;
        font-weight: bold;
        width: 200px;
        padding: 10px;
        margin: 10px;
        border: 1px solid #bbbbbb !important;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 13px;
        background-color: rgb(38, 113, 184) !important;
      "
      >Tạo @JsonProperty</v-btn
    >

    <!-- Nút thứ 2: Tạo JSON object -->
    <v-btn
      @click="generateJsonObject"
      style="
        color: white;
        font-weight: bold;
        width: 200px;
        padding: 10px;
        margin: 10px;
        border: 1px solid #bbbbbb !important;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 13px;
        background-color: rgb(38, 113, 184) !important;
      "
      >Tạo JSON Object</v-btn
    >

    <!-- Nút thứ 3: Tạo body. format -->
    <v-btn
      @click="generateBodyFormat"
      style="
        color: white;
        font-weight: bold;
        width: 200px;
        padding: 10px;
        margin: 10px;
        border: 1px solid #bbbbbb !important;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 13px;
        background-color: rgb(38, 113, 184) !important;
      "
      >Tạo body. format</v-btn
    >

    <!-- Kết quả xuất ra -->
    <v-textarea
      v-model="output"
      label="Kết quả"
      readonly
      rows="10"
    ></v-textarea>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      input: "", // Chuỗi đầu vào từ textarea
      output: "", // Kết quả sinh ra
    };
  },
  methods: {
    // Hàm loại bỏ "ps", "PS", "p0", "P0"
    cleanField(field) {
      return field.replace(/^(ps|PS|p0|P0)/, ""); // Loại bỏ tiền tố "ps", "PS", "p0", "P0"
    },

    // Hàm sinh ra @JsonProperty
    generateJsonProperty() {
      const fields = this.input
        .split("\n")
        .filter((field) => field.trim() !== "");
      const cleanedFields = fields.map(this.cleanField); // Loại bỏ tiền tố trước khi xử lý
      const result = cleanedFields
        .map(
          (field) =>
            `@JsonProperty("${field.trim()}")\nprivate String ${field.trim()};`
        )
        .join("\n\n");
      this.output = result;
    },

    // Hàm sinh ra JSON object
    generateJsonObject() {
      const fields = this.input
        .split("\n")
        .filter((field) => field.trim() !== "");
      const cleanedFields = fields.map(this.cleanField); // Loại bỏ tiền tố trước khi xử lý
      const result = cleanedFields
        .map((field) => `"${field.trim()}": ""`)
        .join(",\n");
      this.output = `{\n${result}\n}`;
    },

    // Hàm sinh ra body.MA_HD, body.MA_KH, body.MA_CQ và dòng chứa dấu '?'
    generateBodyFormat() {
      const fields = this.input
        .split("\n")
        .filter((field) => field.trim() !== "");
      const cleanedFields = fields.map(this.cleanField); // Loại bỏ tiền tố trước khi xử lý
      const resultBody = cleanedFields
        .map((field) => `body.${field.trim()}`)
        .join(",\n");
      const resultQuestionMarks = cleanedFields.map(() => "?").join(", ");
      this.output = `${resultBody},\n${resultQuestionMarks}`;
    },
  },
};
</script>
