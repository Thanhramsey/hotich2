<template>
  <div id="attach-dialog-bc5">
    <v-app>
      <v-container>
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
              >INFO QT Clone</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-combobox
            v-model="selectedBranch"
            @change="getXa"
            :items="capHuyens"
            item-value="id"
            item-text="name"
            label="Chọn huyện"
            attach="#attach-dialog-bc5"
          ></v-combobox>
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

          <!-- <v-btn
            @click="dummyFunction"
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
            >Reset</v-btn
          > -->
        </v-row>

        <v-row>
          <!-- Data Table hiển thị xã -->
          <v-data-table
            v-if="filteredCommunes.length"
            :headers="communeHeaders"
            :items="filteredCommunes"
            item-value="id"
            class="mt-5"
            :items-per-page="30"
            no-data-text="Không có xã nào phù hợp"
            show-select
            v-model="selectedCommunes"
          >
            <template v-slot:item.tenQT="{ item }">
              <!-- Khi ô được click, chuyển thành v-text-field để chỉnh sửa -->
              <v-text-field
                v-if="editingItemId === item.id"
                v-model="item.tenQT"
                @blur="stopEditing(item)"
                @keyup.enter="stopEditing(item)"
                label="Edit name"
                dense
                hide-details
              />
              <span v-else @click="startEditing(item)">{{ item.tenQT }}</span>
            </template>

            <template v-slot:item.maQT="{ item }">
              <!-- Khi ô được click, chuyển thành v-text-field để chỉnh sửa -->
              <v-text-field
                v-if="editingItemId === item.id"
                v-model="item.maQT"
                @blur="stopEditing(item)"
                @keyup.enter="stopEditing(item)"
                label="Edit mã QT"
                dense
                hide-details
              />
              <span v-else @click="startEditing(item)">{{ item.maQT }}</span>
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import donviJson from "./donvi.json";
// import capHuyen from "./capHuyen.json";
import capXa from "./capXa.json";
export default {
  created() {},
  computed: {
    filteredCommunes() {
      if (!this.selectedBranch) return [];
      return this.capXas.content.filter(
        (commune) => commune.parent === this.selectedBranch.id
      );
    },
  },
  data() {
    return {
      // ID của xã đang chỉnh sửa
      loading2: false,
      notificationDialog2: false,
      notificationMessage2: "",
      isSuccess2: false,
      token: "",
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
      editingItemId: null,
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
            id: "",
            name: "",
            parent: "",
            isChecked: true,
            level: 2,
            expandable: true,
          },
        ],
      },

      capXas: capXa,
      communeHeaders: [
        { text: "ID", value: "id" },
        { text: "Tên Xã", value: "name" },
        { text: "Tên Quy trình", value: "tenQT" },
        { text: "MÃ Quy trình", value: "maQT" },
        { text: "Trạng Thái", value: "logoId" },
      ],
      selectedCommunes: [],

      capHuyens: [
        {
          id: "66090d95162cb160f8906385",
          name: "UBND Huyện Chư Prông",
          code: "H21.52",
          tenTat: "chuprong",
        },
        {
          id: "6619f691bfe89f70f2596e86",
          name: "UBND huyện Chư Păh",
          code: "H21.51",
          tenTat: "chupah",
        },
        {
          id: "66052492162cb160f89060a6",
          name: "UBND huyện Chư Pưh",
          code: "H21.53",
          tenTat: "chupuh",
        },
        {
          id: "6619f691bfe89f70f2596e88",
          name: "UBND huyện Chư Sê",
          code: "H21.54",
          tenTat: "chuse",
        },
        {
          id: "6619f691bfe89f70f2596e8e",
          name: "UBND huyện Ia Grai",
          code: "H21.58",
          tenTat: "iagrai",
        },
        {
          id: "6619f691bfe89f70f2596e90",
          name: "UBND huyện Ia Pa",
          code: "H21.59",
          tenTat: "iapa",
        },
        {
          id: "6619f692bfe89f70f2596e98",
          name: "UBND huyện Mang Yang",
          code: "H21.63",
          tenTat: "mangyang",
        },
        {
          id: "6619f692bfe89f70f2596e9a",
          name: "UBND huyện Phú Thiện",
          code: "H21.64",
          tenTat: "phuthien",
        },
        {
          id: "6619f691bfe89f70f2596e8c",
          name: "UBND huyện Đak Pơ",
          code: "H21.56",
          tenTat: "dakpo",
        },
        {
          id: "6619f691bfe89f70f2596e8a",
          name: "UBND huyện Đak Đoa",
          code: "H21.55",
          tenTat: "dakdoa",
        },
        {
          id: "6619f17bbfe89f70f2596e82",
          name: "UBND huyện Đức Cơ",
          code: "H21.57",
          tenTat: "ducco",
        },
        {
          id: "6619f692bfe89f70f2596e9e",
          name: "UBND thị xã An Khê",
          code: "H21.66",
          tenTat: "ankhe",
        },
        {
          id: "66174303bfe89f70f2596e15",
          name: "UBND thị xã Ayun Pa",
          code: "H21.67",
          tenTat: "ayunpa",
        },
        {
          id: "6619f692bfe89f70f2596e9c",
          name: "UBND thành phố Pleiku",
          code: "H21.65",
          tenTat: "pleiku",
        },
        {
          id: "6619f691bfe89f70f2596e92",
          name: "UBND huyện KBang",
          code: "H21.60",
          tenTat: "kbang",
        },
        {
          id: "6619f692bfe89f70f2596e96",
          name: "UBND huyện Krông Pa",
          code: "H21.62",
          tenTat: "krongpa",
        },
        {
          id: "6619f692bfe89f70f2596e94",
          name: "UBND huyện Kông Chro",
          code: "H21.61",
          tenTat: "kongchro",
        },
      ],
      selectedBranch: {
        id: "",
        name: "",
        code: "",
        tenTat: "",
      },
      receptionInfo: {},
      selectObj: {},
    };
  },
  methods: {
    startEditing(item) {
      this.editingItemId = item.id; // Đặt ID của item đang chỉnh sửa
    },
    // Kết thúc chỉnh sửa
    stopEditing() {
      this.editingItemId = null; // Đặt lại ID, kết thúc chỉnh sửa
    },
    dummyFunction() {
      console.log("selectedCommunes", this.selectedCommunes);
    },

    getXa() {
      if (this.name != "") {
        this.filteredCommunes.forEach((item) => {
          item.editing = false;

          let shortName = item.name.replace(
            /(UBND\s+thị trấn|UBND\s+xã|UBND\s+phường)\s+/i,
            ""
          );
          let tenTat = shortName.toLowerCase().replace(/\s+/g, "");
          item.tenTat = tenTat;
          item.tenQT =
            this.selectedBranch.tenTat + "-" + tenTat + "-" + this.name;
          item.maQT =
            this.code + "-" + this.selectedBranch.tenTat + "-" + tenTat;
        });

        console.log(this.filteredCommunes);
      }
    },

    // resetScreen() {
    //   // Lưu lại giá trị của token và processId
    //   this.code = ""; // Biến chứa code từ textfield
    //   this.name = ""; // Biến chứa name từ textfield
    //   this.prefix = ""; // Biến chứa tiền tố
    //   this.processCloneId = "";
    //   this.definedTask = "";
    //   this.processDefinition = "";
    //   this.selectedItem = null;
    //   this.search = "";
    //   this.processingTime = "";
    //   this.editingItemId = null;
    //   this.selectedBranch = {
    //     id: "",
    //     name: "",
    //     code: "",
    //     tenTat: "",
    //   };
    // },

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
    // changeAgency() {
    //   this.donvis.forEach((item) => {
    //     if (this.selectedItem == item.id) {
    //       this.apDungDonViReq.appliedAgency[0].id = item.id;
    //       this.apDungDonViReq.appliedAgency[0].name = item.name;
    //       this.apDungDonViReq.appliedAgency[0].parent = item.parent;
    //       this.selectObj = item;
    //     }
    //   });

    //   this.listDonvi.content.forEach((item) => {
    //     if (
    //       item.code.includes(this.selectObj.code) &&
    //       item.name.includes("Bộ phận")
    //     ) {
    //       this.receptionInfo.id = item.id;
    //       this.receptionInfo.name = item.name;
    //       this.receptionInfo.parent = item.parent;
    //       this.receptionInfo.code = item.code;
    //     }
    //   });
    // },

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
      if (this.selectedCommunes.length == 0) {
        alert("Chưa có tích ô nào hết");
      }
      try {
        for (let process of this.selectedCommunes) {
          // Gọi API clone quy trình
          this.loading2 = true;
          const response = await axios.post(
            "https://apiigate.gialai.gov.vn/bpm/process-definition/--clone-process",
            {
              processId: this.processId,
              code: process.maQT,
              name: process.tenQT, // Nối tiền tố với name
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

          this.apDungDonViReq.appliedAgency[0].id = process.id;
          this.apDungDonViReq.appliedAgency[0].name = process.name;
          this.apDungDonViReq.appliedAgency[0].parent = process.parent;
          const response2 = await axios.put(
            `https://apiigate.gialai.gov.vn/bpm/process-definition/${this.processCloneId}/--properties`,
            this.apDungDonViReq,
            {
              headers: {
                Authorization: `Bearer ${this.token}`, // Đính kèm token vào header (nếu cần)
              },
            }
          );
          console.log(response2);
          await this.getProcessInfo(this.processCloneId);
          await this.appplyProcess(process);

          this.selectedCommunes = [];
        }
      } catch (error) {
        this.isSuccess2 = false;
        this.notificationMessage2 = "Clone không thành công";
        console.error(`Error for task `, error);
      } finally {
        this.loading2 = false; // Kết thúc hiển thị loader
        this.showError2();
      }
    },

    async appplyProcess(process) {
      try {
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

              // let oldAgency = originalJson.candidateGroup;

              // let agency;
              // if (oldAgency[0].name[0].name.includes("Bộ phận")) {
              //   agency = this.receptionInfo;
              // } else {
              //   agency = this.selectObj;
              // }
              // let parent = null;
              // if (agency.parent != undefined) {
              //   parent = {
              //     id: agency.parent,
              //   };
              // }
              let childItem = this.capXas.content.find(
                (item) => item.parent === process.id
              );
              if (!childItem) {
                return 0;
              }
              console.log("childItem:", childItem);

              let parent = null;
              if (childItem.parent != undefined) {
                parent = {
                  id: childItem.parent,
                };
              }

              const candidateGroupNew = [
                {
                  id: childItem.id,
                  code: childItem.code,
                  name: [
                    {
                      languageId: 228,
                      name: childItem.name,
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
              process.logoId = "hoàn thành";
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
