<template>
  <div id="attach-dialog-bc2">
    <v-container>
      <!-- Textarea để nhập token -->
      <v-dialog
        v-model="notificationDialog2"
        max-width="700px"
        persistent
        attach="#attach-dialog-bc2"
      >
        <v-card>
          <v-card-title class="headline">
            <span v-if="isSuccess2">Success</span>
            <span v-else>Error</span>
          </v-card-title>
          <v-card-text>
            <v-alert
              :type="isSuccess2 ? 'success' : 'error'"
              border="left"
              colored-border
            >
              {{ notificationMessage2 }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              style="color: white; background-color: #1976d2 !important"
              text
              @click="notificationDialog2 = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-progress-circular
        attach="#attach-dialog-bc2"
        v-if="loading2"
        indeterminate
        color="white"
        size="20"
        class="ml-2"
      ></v-progress-circular>
      <v-row>
        <v-col>
          <v-textarea label="Token" v-model="token" outlined></v-textarea>
        </v-col>
        <v-col>
          <!-- Textfield nhập processId -->
          <v-text-field
            label="Quy trình ID"
            v-model="processId"
            outlined
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            @click="getProcessInfo(processId)"
            style="
              color: white;
              font-weight: bold;
              width: auto;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
              font-size: 16px;
              background-color: rgb(38, 113, 184) !important;
            "
            >Get INFO quy trình Clone</v-btn
          >
        </v-col>
      </v-row>
      <!-- Textfield nhập code -->
      <v-row>
        <v-col>
          <v-text-field label="Mã id " v-model="prefix" outlined></v-text-field>
        </v-col>
        <v-col>
          <label>Chọn văn phòng đăng ký đất đai</label>
          <select
            placeholder="Chọn văn phòng"
            v-model="selectedItem"
            @change="changeAgency"
            style="
              height: 40px;
              font-weight: bold;
              width: auto;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
            "
          >
            <option value="" disabled>Chọn văn phòng đăng ký đất đai</option>
            <option v-for="item in donvis" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </v-col>
        <v-col>
          <v-text-field
            label="Mã quy trình"
            v-model="code"
            outlined
          ></v-text-field>
        </v-col>
        <!-- Textfield nhập name -->
        <v-col>
          <v-text-field
            label="Tên quy trình"
            v-model="name"
            outlined
          ></v-text-field>
        </v-col>
        <!-- Textfield nhập tiền tố -->
      </v-row>
      <!-- Nút gọi API -->
      <v-row>
        <v-col>
          <v-btn
            @click="CreateNameCode"
            style="
              color: white;
              font-weight: bold;
              width: auto;
              height: 40px;
              padding: 10px;
              margin: 0px 10px;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
              font-size: 16px;
              background-color: rgb(38, 113, 184) !important;
            "
            >Tạo tên,code</v-btn
          >
          <v-btn
            @click="cloneProcess2"
            :disabled="loading2"
            style="
              color: white;
              font-weight: bold;
              width: auto;
              height: 40px;
              padding: 10px;
              margin: 0px 10px;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
              font-size: 16px;
              background-color: rgb(38, 113, 184) !important;
            "
            >Clone Quy Trình</v-btn
          >

          <v-btn
            @click="appplyProcess"
            :disabled="loading2"
            style="
              color: white;
              font-weight: bold;
              width: auto;
              height: 40px;
              padding: 10px;
              margin: 0px 10px;
              border: 1px solid #bbbbbb !important;
              border-radius: 4px;
              box-sizing: border-box;
              font-size: 16px;
              background-color: rgb(38, 113, 184) !important;
            "
            >Áp dụng các bước</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import donviJson from "./donvi.json";
export default {
  created() {},
  data() {
    return {
      loading2: false,
      notificationDialog2: false,
      notificationMessage2: "",
      isSuccess2: false,
      token: "", // Biến chứa token từ textarea
      processId: "", // Biến chứa processId từ textfield
      code: "", // Biến chứa code từ textfield
      name: "", // Biến chứa name từ textfield
      prefix: "", // Biến chứa tiền tố
      processCloneId: "",
      definedTask: "",
      processDefinition: "",
      selectedItem: null,
      search: "",
      processingTime: "",
      listDonvi: donviJson,
      apDungDonViReq: {
        processingTime: "",
        processingTimeUnit: "d",
        applicantEForm: {
          id: "6652e73bd4696e0018acefa4",
          name: "HCC-GLI-VBDLIS",
        },
        eForm: null,
        reportTemplate: [],

        timesheet: {
          id: "6604f6d5c21257111af17280",
          name: "Thời gian làm việc hành chính GLI (không được xóa)",
        },
        dynamicVariable: {
          constraintTotalProcessTime: false,
          processType: 0,
          isRequiredInputEForm: true,
          isProcessingTimeUnitType: true,
          processingTimeAfterAddition: "",
          extendHCM: {},
        },
        appliedAgency: [
          {
            id: "6635a42e2f006c34b683c2f8",
            name: "Chi nhánh Văn phòng Đăng ký đất đai TP Pleiku",
            parent: "66359bbece635e4fa0955ab7",
            isChecked: true,
            level: 2,
            expandable: true,
          },
        ],
      },

      donvis: [
        {
          id: "6635a42e2f006c34b683c31a",
          name: "Bộ phận tiếp nhận văn phòng đăng ký đất đai tỉnh Gia lai.",
          code: "H21.14.0101",
          tenTat: "GLI",
        },
        {
          id: "6635a42e2f006c34b683c2fc",
          name: "Chi nhánh Văn phòng Đăng ký đất đai  thị xã An Khê",
          code: "H21.14.01.03",
          tenTat: "ANKHE",
        },
        {
          id: "6635a42e2f006c34b683c2fa",
          name: "Chi nhánh Văn phòng Đăng ký đất đai  thị xã Ayun Pa",
          code: "H21.14.01.02",
          tenTat: "AYUNPA",
        },
        {
          id: "6635a42e2f006c34b683c2f8",
          name: "Chi nhánh Văn phòng Đăng ký đất đai TP Pleiku",
          code: "H21.14.01.01",
          tenTat: "PLEIKU",
        },
        {
          id: "6635a42e2f006c34b683c302",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Prông",
          code: "H21.14.01.06",
          tenTat: "CHUPRONG",
        },
        {
          id: "6635a42e2f006c34b683c316",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Păh",
          code: "H21.14.01.16",
          tenTat: "CHUPAH",
        },
        {
          id: "6635a42e2f006c34b683c300",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Pưh",
          code: "H21.14.01.05",
          tenTat: "CHUPUH",
        },
        {
          id: "6635a42e2f006c34b683c2fe",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Sê",
          code: "H21.14.01.04",
          tenTat: "CHUSE",
        },
        {
          id: "6635a42e2f006c34b683c314",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Ia Grai",
          code: "H21.14.01.15",
          tenTat: "IAGRAI",
        },
        {
          id: "6635a42e2f006c34b683c308",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Ia Pa",
          code: "H21.14.01.09",
          tenTat: "IAPA",
        },
        {
          id: "6635a42e2f006c34b683c318",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện KBang",
          code: "H21.14.01.17",
          tenTat: "KBANG",
        },
        {
          id: "6635a42e2f006c34b683c306",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Krông Pa",
          code: "H21.14.01.08",
          tenTat: "KRONGPA",
        },
        {
          id: "6635a42e2f006c34b683c310",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Kông Chro",
          code: "H21.14.01.13",
          tenTat: "KONGCHRO",
        },
        {
          id: "6635a42e2f006c34b683c30e",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Mang Yang",
          code: "H21.14.01.12",
          tenTat: "MANGYANG",
        },
        {
          id: "6635a42e2f006c34b683c304",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Phú Thiện",
          code: "H21.14.01.07",
          tenTat: "PHUTHIEN",
        },
        {
          id: "6635a42e2f006c34b683c30c",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đak Pơ",
          code: "H21.14.01.11",
          tenTat: "DAKPO",
        },
        {
          id: "6635a42e2f006c34b683c30a",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đak Đoa",
          code: "H21.14.01.10",
          tenTat: "DAKDOA",
        },
        {
          id: "6635a42e2f006c34b683c312",
          name: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đức Cơ",
          code: "H21.14.01.14",
          tenTat: "DUCCO",
        },
      ],
      receptionInfo: {},
      selectObj: {},
    };
  },
  methods: {
    showError2() {
      this.notificationDialog2 = true; // Mở dialog
    },
    CreateNameCode() {
      let partsName = this.name.split("-");
      if (partsName && partsName[1]) {
        this.name =
          this.selectObj.tenTat + "_" + this.prefix + "-" + partsName[1];
      } else {
        this.name = this.selectObj.tenTat + "_";
      }
      this.code = "VBDLIS-" + this.selectObj.tenTat + "_" + this.prefix;
    },
    changeAgency() {
      this.donvis.forEach((item) => {
        if (this.selectedItem == item.id) {
          this.apDungDonViReq.appliedAgency[0].id = item.id;
          this.apDungDonViReq.appliedAgency[0].name = item.name;
          this.apDungDonViReq.appliedAgency[0].parent = item.parent;
          this.selectObj = item;
        }
      });

      this.listDonvi.content.forEach((item) => {
        // console.log(
        //   item.code.includes(this.selectObj.code) &&
        //     item.name.includes("Bộ phận")
        // );
        if (
          item.code.includes(this.selectObj.code) &&
          item.name.includes("Bộ phận")
        ) {
          this.receptionInfo.id = item.id;
          this.receptionInfo.name = item.name;
          this.receptionInfo.parent = item.parent;
          this.receptionInfo.code = item.code;
        }
      });
    },

    async getProcessInfo(processId) {
      try {
        // Gọi API clone quy trình
        const apiUrl = `https://apiigate.gialai.gov.vn/bpm/process-definition/${processId}`;
        this.loading2 = true;
        return axios
          .get(apiUrl, {
            headers: {
              Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
            },
          })
          .then((response) => {
            this.code = response.data.code;
            this.name = response.data.name;
            this.processingTime = response.data.processingTime;
            this.apDungDonViReq.processingTime = this.processingTime;
            this.definedTask = response.data.definedTask;
            this.processDefinition = response.data;
            this.isSuccess2 = true;
            this.notificationMessage2 = "get thông tin thành công";
          });
      } catch (error) {
        this.isSuccess2 = false;
        this.notificationMessage2 = "Get thông tin không thành công";
        console.error("Error cloning process:", error);
      } finally {
        this.loading2 = false; // Kết thúc hiển thị loader
        this.showError2();
      }
    },

    async cloneProcess2() {
      try {
        // Gọi API clone quy trình
        this.loading2 = true;
        const response = await axios.post(
          "https://apiigate.gialai.gov.vn/bpm/process-definition/--clone-process",
          {
            processId: this.processId,
            code: this.code,
            name: this.name, // Nối tiền tố với name
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
            },
          }
        );

        // Lấy ID từ API clone
        this.processCloneId = response.data.id;

        // Gọi API thứ hai với method PUT và payload
        const response2 = await axios.put(
          `https://apiigate.gialai.gov.vn/bpm/process-definition/${this.processCloneId}/--properties`,
          this.apDungDonViReq,
          {
            headers: {
              Authorization: `Bearer ${this.token}`, // Đính kèm token vào header (nếu cần)
            },
          }
        );
        this.getProcessInfo(this.processCloneId);
        this.isSuccess2 = true;
        this.notificationMessage2 = "Clone thành công";
        console.log("Kết quả từ API thứ hai: ", response2.data);
      } catch (error) {
        this.isSuccess2 = false;
        this.notificationMessage2 = "Clone không thành công";
        console.error(`Error for task `, error);
      } finally {
        this.loading2 = false; // Kết thúc hiển thị loader
        this.showError2();
      }
    },

    async appplyProcess() {
      try {
        this.loading2 = true;
        this.notificationMessage2 = "Áp dụng không thành công";
        for (const task of this.definedTask) {
          const taskDefinitionKey = task.id; // Lấy task-definition-key từ từng task
          if (taskDefinitionKey != "root") {
            // Gọi API thứ hai với process-definition-id và task-definition-key
            const apiUrl = `https://apiigate.gialai.gov.vn/bpm/process-definition-task/--find-by-activiti-task?process-definition-id=${this.processCloneId}&task-definition-key=${taskDefinitionKey}`;

            try {
              const taskResponse = await axios.get(apiUrl, {
                headers: {
                  Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
                },
              });

              const originalJson = taskResponse.data;

              let oldAgency = originalJson.candidateGroup;

              let agency;
              if (oldAgency[0].name[0].name.includes("Bộ phận")) {
                agency = this.receptionInfo;
              } else {
                agency = this.selectObj;
              }
              let parent = null;
              if (agency.parent != undefined) {
                parent = {
                  id: agency.parent,
                };
              }
              const candidateGroupNew = [
                {
                  id: agency.id,
                  code: agency.code,
                  name: [
                    {
                      languageId: 228,
                      name: agency.name,
                    },
                  ],
                  tag: null,
                  parent: parent,
                  ancestors: [],
                },
              ];

              const transformedJson = {
                name: originalJson.name,
                remind: originalJson.remind,
                processingTime: originalJson.processingTime,
                processingTimeUnit: originalJson.processingTimeUnit,
                position: null,
                assignee: originalJson.assignee,
                isFirst: originalJson.isFirst,
                isLast: originalJson.isLast,
                description: originalJson.description,
                totalDayProcessAgency:
                  originalJson.dynamicVariable?.totalDayProcessAgency || "",
                dayProcessAgencyUnit:
                  originalJson.dynamicVariable?.dayProcessAgencyUnit || "d",
                processBranch: "",
                variable: {
                  processComments: originalJson.variable.processComments,
                  canPaused: originalJson.variable.canPaused,
                  canPrintDossiersCostReport:
                    originalJson.variable.canPrintDossiersCostReport,
                  canUploadResult: originalJson.variable.canUploadResult,
                  canIncreaseDue: originalJson.variable.canIncreaseDue,
                  canUseDigitalSign: originalJson.variable.canUseDigitalSign,
                  canUseDigitalSignSmartCA:
                    originalJson.variable.canUseDigitalSignSmartCA,
                  canUseDigitalSignVGCA:
                    originalJson.variable.canUseDigitalSignVGCA,
                  canUseDigitalSignVNPTCA:
                    originalJson.variable.canUseDigitalSignVNPTCA,
                  canUseDigitalSignNEAC:
                    originalJson.variable.canUseDigitalSignNEAC,
                  canUseDigitalSignQNM:
                    originalJson.variable.canUseDigitalSignQNM,
                  canUpdateDossierComp:
                    originalJson.variable.canUpdateDossierComp,
                  canUpdateApplicant: originalJson.variable.canUpdateApplicant,
                  canCancelDosssier: originalJson.variable.canCancelDosssier,
                  canChoiceNextStep: originalJson.variable.canChoiceNextStep,
                  canUpdateDosssierDetail:
                    originalJson.variable.canUpdateDosssierDetail,
                  canResendDossierToPriviousStep:
                    originalJson.variable.canResendDossierToPriviousStep,
                  canDeleteDossier: originalJson.variable.canDeleteDossier,
                  canPrintReceiptTicket:
                    originalJson.variable.canPrintReceiptTicket,
                  canEvictDossier: originalJson.variable.canEvictDossier,
                  canConfirmDossierPaper:
                    originalJson.variable.canConfirmDossierPaper,
                  canSendDocument: originalJson.variable.canSendDocument,
                  canConnectedIOffice:
                    originalJson.variable.canConnectedIOffice,
                  canConnectedQLVB: originalJson.variable.canConnectedQLVB,
                  canConnectedIOfficeV4:
                    originalJson.variable.canConnectedIOfficeV4,
                  canSyncLicenseBXD: originalJson.variable.canSyncLicenseBXD,
                  mustRatingOfficials:
                    originalJson.variable.mustRatingOfficials,
                  mustPublishInvoice: originalJson.variable.mustPublishInvoice,
                  mustChooseAssignee: originalJson.variable.mustChooseAssignee,
                  mustSendSMSToApplicant:
                    originalJson.variable.mustSendSMSToApplicant,
                  mustAttachResultsFile:
                    originalJson.variable.mustAttachResultsFile,
                  mustConfirm: originalJson.variable.mustConfirm,
                  mustSignTypeOrg: originalJson.variable.mustSignTypeOrg,
                  requireSaveIstorage:
                    originalJson.variable.requireSaveIstorage,
                  mustConstraintDigitalSignatureFileResults:
                    originalJson.variable
                      .mustConstraintDigitalSignatureFileResults,
                  officerSMSTemplate: originalJson.variable.officerSMSTemplate,
                  officerSMSTemplateId: "",
                  officerSMSDefaultSend:
                    originalJson.variable.officerSMSTemplate?.defaultSend ||
                    false,
                  officerEmailTemplate:
                    originalJson.variable.officerEmailTemplate,
                  officerEmailDefaultSend:
                    originalJson.variable.officerEmailTemplate?.defaultSend ||
                    false,
                  officerZaloTemplate:
                    originalJson.variable.officerZaloTemplate,
                  officerZaloDefaultSend:
                    originalJson.variable.officerZaloTemplate?.defaultSend ||
                    false,
                  citizenSMSTemplate: originalJson.variable.citizenSMSTemplate,
                  citizenSMSTemplateId: "",
                  citizenSMSDefaultSend:
                    originalJson.variable.citizenSMSTemplate?.defaultSend ||
                    false,
                  citizenEmailTemplate:
                    originalJson.variable.citizenEmailTemplate,
                  citizenEmailDefaultSend:
                    originalJson.variable.citizenEmailTemplate?.defaultSend ||
                    false,
                  citizenZaloTemplate:
                    originalJson.variable.citizenZaloTemplate,
                  citizenZaloDefaultSend:
                    originalJson.variable.citizenZaloTemplate?.defaultSend ||
                    false,
                  form: null,
                  deadlineForAdditionalRequests: false,
                  printReceiptPaper: false,
                  sampleReceiptPaper: [],
                  attachResultFileToEmail: false,
                  dossierReselectAgencyProcessing: false,
                },
                dynamicVariable: JSON.stringify(originalJson.dynamicVariable),
                activiti: originalJson.activiti,
                candidateGroup: candidateGroupNew,
                processDefinition: this.processDefinition,
              };

              console.log("JSON cập nhật:", transformedJson);

              const response = await axios.post(
                "https://apiigate.gialai.gov.vn/bpm/process-definition-task",
                transformedJson,
                {
                  headers: {
                    Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
                  },
                }
              );
              console.log(response.data);
              this.isSuccess2 = true;
              this.notificationMessage2 = "Áp dụng thành công";
            } catch (error) {
              console.error(`Error for task :`, error);
              this.isSuccess2 = false;
              this.notificationMessage2 = "Áp dụng không thành công";
            } finally {
              this.loading2 = false; // Kết thúc hiển thị loader
              this.showError2();
            }
          }
        }
      } catch (error) {
        console.error("Error cloning process:", error);
        this.isSuccess2 = false;
        this.notificationMessage2 = "Áp dụng không thành công";
      } finally {
        this.loading2 = false; // Kết thúc hiển thị loader
        this.showError2();
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
