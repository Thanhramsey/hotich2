<template>
  <div id="attach-dialog-bc6">
    <v-app>
      <v-container>
        <v-row>
          <v-col>
            <v-textarea
              label="Token"
              v-model="igateToken"
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- Textfield nhập processId -->
            <v-text-field
              label="Mã Hồ sơ"
              v-model="maHso2"
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <span>Module: {{ module }}</span>
          </v-col>
          <v-col>
            <!-- Textfield nhập processId -->
            <v-text-field
              label="Mã Hồ sơ Liên Thông"
              v-model="maHso"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              @click="fetchData"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 10px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
              >Get log hồ sơ</v-btn
            >
            <v-btn
              @click="checkTrangThai"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 10px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
              >Kiểm tra trạng thái hồ sơ</v-btn
            >
            <v-btn
              @click="getKetQua"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 10px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
              >Lấy kết quả</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="istrangThaiHoSoSuccess">
          <v-col cols="10">
            <v-textarea
              variant="solo"
              bg-color="amber-lighten-4"
              color="orange orange-darken-4"
              v-model="trangThaiHoSoString"
            >
            </v-textarea>
          </v-col>
          <v-col cols="2">
            <p>Trạng thái hiện tại : {{ trangThaiHienTai }}</p>
            <v-btn
              @click="updateTrangThai"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 10px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
              >Cập nhật trạng thái
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-data-table
            :headers="tableHeaders"
            :items="data"
            :items-per-page="30"
            class="elevation-1"
            no-data-text="Không có log"
          >
            <template v-slot:item.requestBody="{ item }">
              <pre
                style="
                  max-width: 500px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ item.requestBody }}
              </pre>
            </template>
            <template v-slot:item.responseBody="{ item }">
              <pre>{{ item.responseBody }}</pre>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn color="primary" @click="handleButtonClick(item)">
                Gọi lại
              </v-btn>
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  watch: {},
  computed: {
    iconStyle() {
      return {
        backgroundColor: "#1976d2 !important" /* Màu nền của icon */,
        color: "white" /* Màu của icon */,
        borderRadius: "50%" /* Bo tròn để tạo hình tròn */,
        padding: "5px" /* Thêm không gian xung quanh icon */,
        fontSize: "15px" /* Kích thước icon */,
        marginBottom: "5px",
      };
    },
    closeIconStyle() {
      return {
        position: "absolute" /* Đặt vị trí tuyệt đối cho icon đóng */,
        right: "16px" /* Căn chỉnh từ bên phải */,
        top: "16px" /* Căn chỉnh từ trên cùng */,
        cursor: "pointer" /* Thay đổi con trỏ khi hover */,
        color: "white" /* Màu của icon, có thể thay đổi theo ý muốn */,
        borderRadius: "50%",
        backgroundColor: "#1976d2 !important",
        padding: "5px" /* Thêm không gian xung quanh icon */,
        fontSize: "15px" /* Kích thước icon */,
      };
    },

    imageStyle() {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    },
  },
  data() {
    return {
      igateToken: "",
      maHso: "",
      maHso2: "",
      module: "",
      tableHeaders: [
        { text: "Dossier Code", value: "dossierCode" },
        { text: "Call Time", value: "callTime" },
        { text: "Request Body", value: "requestBody" },
        { text: "Response Body", value: "responseBody" },
        // { text: "Security Key", value: "securityKey" },
        { text: "Trang Thai", value: "requestBody.trangThai" },
        { text: "Action", value: "action", sortable: false },
      ],
      data: [],
      trangThaiHoSo: {},
      trangThaiHoSoString: "",
      istrangThaiHoSoSuccess: false,
      trangThaiHienTai: "",
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      if (this.maHso2 != "") {
        await this.getHsoId();
      }
      this.getTTHosO();
    },

    async checkTrangThai() {
      const response = await axios.post(
        "https://dvcapi.daklak.gov.vn/ad/service/judicial-civil-status/--dossiers",
        {
          maTinh: "66",
          maDinhDanhHoSo: [this.maHso2],
          module: this.module, // Nối tiền tố với name
        },
        {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        }
      );
      if (response) {
        this.istrangThaiHoSoSuccess = true;
        this.trangThaiHoSo = response.data.value[0];
        this.trangThaiHoSoString = JSON.stringify(this.trangThaiHoSo, null, 2);
        this.trangThaiHienTai = response.data.value[0].trangThai;
      }
    },

    async updateTrangThai() {},

    async getHsoId() {
      const maHsoTrimmed = this.maHso2.trim().replace(/\s+/g, "");
      const getHsoIdUrl = `https://dvcapi.daklak.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${maHsoTrimmed}`;

      try {
        const getHsId = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        if (getHsId.data.content[0]) {
          this.maHso2 = getHsId.data.content[0].code;
          this.maHso = getHsId.data.content[0].nationCode;
          this.module = getHsId.data.content[0].eForm.data.loaiHTTP;
        }
      } catch (error) {
        alert("lỖI");
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async getTTHosO() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      this.data = [];

      const getHsoIdUrl = `https://dvcapi.daklak.gov.vn/ad/api/lienthongDVCLT/getLog?nationCode=${maHsoTrimmed}`;

      try {
        const response = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        if (response.data && response.data.content.length > 0) {
          response.data.content.forEach((element) => {
            if (element.requestBody.trangThai) {
              // Check if element already exists based on trangThai and responseBody.status
              const exists = this.data.some(
                (item) =>
                  item.requestBody.trangThai ===
                    element.requestBody.trangThai &&
                  item.responseBody.status === element.responseBody.status
              );

              if (!exists) {
                this.data.push(element);
                if (this.module == "") {
                  if (
                    element.requestBody.maTTHC == "2.000986" ||
                    element.requestBody.maTTHC == "2.001023"
                  ) {
                    this.module = "LTKS";
                  } else if (element.requestBody.maTTHC == "1.011733") {
                    this.module = "LTKT";
                  }
                }
                this.maHso2 = element.requestBody.maHoSo;
              }
            }
          });
        }

        this.data.sort(
          (a, b) => a.requestBody.trangThai - b.requestBody.trangThai
        );

        console.log("content:", response);
      } catch (error) {
        alert(error);
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },
    async handleButtonClick(item) {
      console.log(item);
      const dayLaiUrl = `https://dvcapi.daklak.gov.vn/ad/api/lienthongDVCLT/capNhatTrangThaiHoSoDVCLTHoTich`;
      try {
        const response = await axios.post(dayLaiUrl, item.requestBody, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        });
        if (response) {
          console.log(response.data);
          if (response.data.status == 200) {
            alert(response.data.title);
          } else {
            alert(response.data.errors.soHoSoLT[0]);
          }
        }
      } catch (error) {
        alert(error);
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async getKetQua() {
      if (this.maHso2 == "") {
        alert("chưa nhập mã hồ sơ");
        return;
      }
      const maHsoTrimmed = this.maHso2.trim().replace(/\s+/g, "");
      const getKetQuaUrl = `https://dvcapi.daklak.gov.vn/pa/judicial-civil-status/--sync-dossiers?code=${maHsoTrimmed}`;
      const response = await axios.post(
        getKetQuaUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        }
      );
      if (response) {
        alert(response);
      }
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%; /* Chiều rộng 100% của phần tử chứa */
  height: 100px; /* Chiều cao cụ thể */
  box-sizing: border-box; /* Đảm bảo kích thước bao gồm padding và border */
  border: 1px solid #bbbbbb !important;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #bbbbbb !important;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}
.response-column {
  max-width: 300px; /* Đặt độ rộng tối đa */
  white-space: nowrap; /* Không cho phép xuống dòng */
  overflow: hidden; /* Ẩn phần vượt quá */
  text-overflow: ellipsis; /* Hiển thị dấu "..." khi nội dung vượt quá */
}

button {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #bbbbbb !important;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: rgb(38, 113, 184) !important;
}

p {
  color: red;
}
</style>
