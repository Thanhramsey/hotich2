<template>
  <div>
    <v-app>
      <v-container>
        <section style="display: none">
          <section class="mb-5">
            <h2 class="mb-5">Get Token(Dùng ở local)</h2>
          </section>
          <hr class="mb-5" />
          <div>
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              required
              style="
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
              "
            />
          </div>
          <div>
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              style="
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
              "
            />
          </div>
          <button
            @click="getToken"
            style="
              color: white;
              font-weight: bold;
              width: 150px;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
              font-size: 16px;
              background-color: rgb(38, 113, 184) !important;
            "
          >
            Get Token
          </button>
          <p v-if="token">Token: {{ token }}</p>
        </section>

        <section>
          <section class="mb-5">
            <h2 class="mb-5">Get TT Hồ sơ</h2>
            <div>
              <label
                for="igateToken"
                style="font-size: large; font-weight: bold"
                >dlkToken:</label
              >
              <v-icon
                class="ml-2 cursor-pointer round-icon"
                @click="showImage('images/image2.png')"
                :style="iconStyle"
              >
                mdi-information-outline
              </v-icon>
              <textarea
                class="textarea"
                type="text"
                id="igateToken"
                v-model="token"
                required
                style="
                  width: 100%;
                  height: 100px;
                  box-sizing: border-box;
                  border: 1px solid #bbbbbb !important;
                "
              ></textarea>
            </div>
            <div>
              <div class="d-flex align-center">
                <label
                  for="igateToken"
                  style="font-size: large; font-weight: bold"
                >
                  igateToken:
                </label>
                <v-icon
                  class="ml-2 cursor-pointer round-icon"
                  @click="showImage('images/image.png')"
                  :style="iconStyle"
                >
                  mdi-information-outline
                </v-icon>
              </div>
              <!-- Dialog -->
              <v-dialog
                v-model="dialog"
                class="custom-dialog"
                persistent
                max-width="90%"
                :style="imageStyle"
              >
                <v-card>
                  <v-card-title class="headline" style="margin-bottom: 20px"
                    >Lấy token Igate<v-icon
                      :style="closeIconStyle"
                      @click="dialog = false"
                    >
                      mdi-close
                    </v-icon></v-card-title
                  >
                  <v-card-text>
                    <v-img :src="currentImage" alt="Description" />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">Đóng</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog
                v-model="notificationDialog"
                max-width="700px"
                persistent
              >
                <v-card>
                  <v-card-title class="headline">
                    <span v-if="isSuccess">Success</span>
                    <span v-else>Error</span>
                  </v-card-title>
                  <v-card-text>
                    <v-alert
                      :type="isSuccess ? 'success' : 'error'"
                      border="left"
                      colored-border
                    >
                      {{ notificationMessage }}
                    </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      style="color: white; background-color: #1976d2 !important"
                      text
                      @click="notificationDialog = false"
                      >Close</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <textarea
                class="textarea"
                type="text"
                id="igateToken"
                v-model="igateToken"
                required
                style="
                  width: 100%;
                  height: 100px;
                  box-sizing: border-box;
                  border: 1px solid #bbbbbb !important;
                "
              ></textarea>
            </div>
            <div>
              <label for="maHso" style="font-size: large; font-weight: bold"
                >Mã hồ sơ:</label
              >
              <input
                type="text"
                id="maHso"
                v-model="maHso"
                required
                style="
                  width: 100%;
                  padding: 10px;
                  margin: 10px 0;
                  border: 1px solid #bbbbbb !important;
                  border-radius: 4px;
                  box-sizing: border-box;
                  font-size: 16px;
                "
              />
            </div>
            <p v-if="eformData" style="color: red; display: none">
              eformData: {{ eformData }}
            </p>
            <v-btn
              @click="fetchData"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 20px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
            >
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="white"
                size="20"
                class="ml-2"
              ></v-progress-circular>
              Get TT Hồ sơ
            </v-btn>
            <v-btn
              @click="endHoSo"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 20px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
              >Kết thúc hồ sơ</v-btn
            >
            <p v-if="donViNop" style="color: red">
              <b>Hồ sơ của đơn vị: {{ donViNop }}</b>
            </p>
            <p v-if="noiDangKy" style="color: red">
              <b>Nơi đăng ký trong eform: {{ noiDangKy }}</b>
            </p>
          </section>
          <section class="mt-5">
            <h2 class="mb-5">Đẩy qua hộ tịch</h2>
            <v-btn
              @click="pushHoTich"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                width: auto;
                font-weight: bold;
                padding: 20px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
            >
              Đẩy qua hộ tịch
            </v-btn>
            <p v-if="requestBody" style="color: red; display: none">
              Body gửi đi: {{ requestBody }}
            </p>
            <textarea
              v-model="requestBodyString"
              style="
                width: 100%;
                height: 300px;
                box-sizing: border-box;
                border: 1px solid #bbbbbb !important;
              "
            ></textarea>
            <p v-if="responseHT" style="color: purple">
              Kết quả trả về từ hộ tịch: {{ responseHT }}
            </p>
          </section>
        </section>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import { jsonToXml } from "./jsonToXml.js";
import dviJson from "./dviJson.json";
import noiDangKyJson from "./noiDangKy.json";

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
      username: "",
      password: "",
      token: "",
      maHso: "",
      hsoId: "",
      igateToken: "",
      eformData: "",
      requestBody: {
        maDonVi: "",
        module: "",
        maHoSo: "",
        ngayTiepNhan: "",
        data: "",
      },
      responseHT: "",
      requestBodyString: "",
      dialog: false,
      currentImage: "",
      notificationDialog: false,
      notificationMessage: "",
      isSuccess: false,
      loading: false,
      dViData: dviJson,
      noiDangKyJson: noiDangKyJson,
      donViNop: "",
      noiDangKy: "",
      ltRequest: {},
      isDVCLT: false,
    };
  },
  methods: {
    showImage(image) {
      this.currentImage = image; // Cập nhật đường dẫn hình ảnh
      this.dialog = true; // Mở dialog
    },

    showError() {
      this.notificationDialog = true; // Mở dialog
    },

    async getToken() {
      const tokenUrl = "/api/token"; // Sử dụng proxy
      const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;

      const data = new URLSearchParams();
      data.append("grant_type", "client_credentials");

      try {
        const response = await axios.post(tokenUrl, data, {
          headers: {
            Authorization: authHeader,
            "Access-Control-Allow-Origin ": "*",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log("Token:", response.data);
        this.token = response.data.access_token;
      } catch (error) {
        if (error.response) {
          // Máy chủ đã phản hồi với mã trạng thái nằm ngoài phạm vi 2xx
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
          console.error("Header phản hồi lỗi:", error.response.headers);
        } else if (error.request) {
          // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          // Một lỗi đã xảy ra trong quá trình thiết lập yêu cầu
          console.error("Thông báo lỗi:", error.message);
        }
        console.error("Cấu hình lỗi:", error.config);
      }
    },

    async getLTRequest() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      const getLTRequestURL = `https://dvcapi.daklak.gov.vn/pa/judicial-civil-status/--send?code=${maHsoTrimmed}&showIntputSendEnable=true`;

      try {
        const dataLT = await axios.post(
          getLTRequestURL,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
            },
          }
        );
        console.log("content LT:", dataLT);
        this.ltRequest = dataLT.data.input;
        this.requestBodyString = JSON.stringify(this.ltRequest, null, 2);
      } catch (error) {
        this.loading = false;
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        this.showError();
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

    async getHsoId() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      const getHsoIdUrl = `https://dvcapi.daklak.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${maHsoTrimmed}`;
      this.requestBodyString = "";
      try {
        const getHsId = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        console.log("content:", getHsId);
        this.hsoId = getHsId.data.content[0].id;
        this.isDVCLT = getHsId.data.content[0].isDVCLT;
        let agency = getHsId.data.content[0].agency.code;
        if (agency) {
          let dvi = this.dViData.content.find((room) => room.code === agency);
          this.donViNop = dvi.name;

          var maNoiDangKy = getHsId.data.content[0].eForm.data.noiDangKy;
          let noiDangKyName = this.noiDangKyJson.find(
            (data) => data.value === maNoiDangKy
          );
          this.noiDangKy = noiDangKyName.tenDonViHanhChinh;
        }
        if (
          getHsId.data.content[0].eForm.data.loaiHTTP == "LTKS" ||
          getHsId.data.content[0].eForm.data.loaiHTTP == "LTKT"
        ) {
          await this.getLTRequest();
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
        } else {
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
          this.showError();
          this.requestBody.maDonVi =
            getHsId.data.content[0].eForm.data.noiDangKy;
          const date = new Date(getHsId.data.content[0].acceptedDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
          const day = String(date.getDate()).padStart(2, "0");

          this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
          this.requestBody.module = getHsId.data.content[0].eForm.data.loaiHTTP;
          this.requestBody.maHoSo = getHsId.data.content[0].code;
          this.eformData = getHsId.data.content[0].eForm.data;
          let innerXML = jsonToXml(this.eformData);
          this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
          this.responseHT = "";
          this.requestBodyString = JSON.stringify(this.requestBody, null, 2);
        }
      } catch (error) {
        this.loading = false;
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        this.showError();
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      } finally {
        this.loading = false; // Kết thúc hiển thị loader
        this.showError();
      }
    },

    async endHoSo() {
      this.loading = true;
      await this.getHsoId();
      if (this.hsoId) {
        await this.endProcess();
      }
    },

    async endProcess() {
      this.loading = true;
      if (this.hsoId == "") {
        this.loading = false;
        this.notificationMessage = "Không có thông tin";
        this.isSuccess = false;
        this.showError();
      } else {
        const url =
          "https://dvcapi.daklak.gov.vn/pa/dossier/--force-end-process";
        var endRequestBody = [
          {
            id: this.hsoId,
            code: this.maHso,
          },
        ]; // Chuyển requestBodyString về dạng object
        console.log(this.requestBody);
        try {
          const response = await axios.put(url, endRequestBody, {
            headers: {
              Authorization: `Bearer ${this.igateToken}`,
              "Content-Type": "application/json", // Content-Type của body là JSON
            },
          });
          console.log("Response:", response.data);

          this.notificationMessage = "Thành công";
          this.isSuccess = true;
        } catch (error) {
          this.notificationMessage = error.response
            ? error.response.data
            : error.message;
          this.isSuccess = false;
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        } finally {
          this.loading = false; // Kết thúc hiển thị loader
          this.showError();
        }
      }
    },

    async getData() {
      const url = `https://dvcapi.daklak.gov.vn/pa/dossier/${this.hsoId}/--online`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        // Lưu dữ liệu vào biến data
        console.log("Data:", response.data);

        if (
          response.data.eForm.data.loaiHTTP == "LTKS" ||
          response.data.eForm.data.loaiHTTP == "LTKT"
        ) {
          await this.getLTRequest();
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
        } else {
          this.requestBody.maDonVi = response.data.eForm.data.noiDangKy;
          const date = new Date(response.data.acceptedDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
          const day = String(date.getDate()).padStart(2, "0");

          this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
          this.requestBody.module = response.data.eForm.data.loaiHTTP;
          this.requestBody.maHoSo = response.data.code;
          this.eformData = response.data.eForm.data;
          let innerXML = jsonToXml(this.eformData);
          this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
          this.responseHT = "";
          this.requestBodyString = JSON.stringify(this.requestBody, null, 2);
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
          this.showError();
        }
      } catch (error) {
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      } finally {
        this.loading = false; // Kết thúc hiển thị loader
        this.showError();
      }
    },

    async fetchData() {
      this.loading = true;
      await this.getHsoId();
      // if (this.hsoId) {
      //   await this.getData();
      // }
    },

    async pushHoTich() {
      this.loading = true;
      if (this.token == "") {
        this.loading = false;
        this.notificationMessage = " Chưa có token GLI";
        this.isSuccess = false;
        this.showError();
      } else {
        var url = "https://lgsp.daklak.gov.vn/http/1.0/dangky";
        var bodySend = JSON.parse(this.requestBodyString); // Chuyển requestBodyString về dạng object

        if (bodySend.module == "LTKS" || bodySend.module == "LTKT") {
          url = "https://lgsp.daklak.gov.vn/apiLienThongKSKT/1.0/nhanHoSoDKHT";
        }
        console.log(bodySend);
        try {
          const response = await axios.post(url, bodySend, {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json", // Content-Type của body là JSON
            },
          });
          console.log("Response:", response.data);

          this.responseHT = response.data;
          this.notificationMessage = response.data;
          this.isSuccess = true;
        } catch (error) {
          this.notificationMessage = error.response
            ? error.response.data
            : error.message;
          this.isSuccess = false;
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        } finally {
          this.loading = false; // Kết thúc hiển thị loader
          this.showError();
        }
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
