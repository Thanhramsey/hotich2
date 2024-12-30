<script>
import SheetTo from "../mixins/SheetTo";

export default {
  mixins: [SheetTo],
  data() {
    return {
      collection: null,
    };
  },
  mounted() {
    this._callBack = this.updateJson;
    this.load();
  },
  methods: {
    async load() {
      const {
        utils: { sheet_to_json },
      } = await import("xlsx");
      this._sheet_to_json = sheet_to_json;
      this.loaded = true;
    },
    updateJson(workbook) {
      const ws = workbook.Sheets[this.sheetNameFinder(workbook)];
      this.collection = this._sheet_to_json(ws, this.options);
      var saiMau = false;
      var listVangThi = [];
      if (this.collection.length < 3) {
        let nullObj = [{}];
        this.$emit("parsed", nullObj);
        this.$emit("table", {
          returnTable: returnTable,
          title: "Cuộc thi",
        });
        return false;
      }
      console.log(this.collection);
      var arrProp = this.collection[2];
      if (
        arrProp["__EMPTY"] === "Cuộc thi" &&
        arrProp["__EMPTY_5"] === "Trạng thái"
      ) {
        var tongSoHocSinh = this.collection.length - 3;
        var thamGiaThi = 0;
        var vangThi = 0;

        for (let i = 3; i < this.collection.length; i++) {
          let item = this.collection[i];
          if (item["__EMPTY_5"] == "Đã thi") {
            thamGiaThi++;
          } else if (item["__EMPTY_5"] == "Chưa thi") {
            vangThi++;
            listVangThi.push(item);
          }
        }
        // var text = this.collection[1];
        var string = "THỐNG KÊ HỌC VIÊN THAM GIA CUỘC THI";
        var returnJson = [
          {
            [string]: "Thống kê",
            "Tổng số": tongSoHocSinh,
            "Tham gia thi:": thamGiaThi,
            "Vắng thi:": vangThi,
          },
          {
            [string]: "DANH SÁCH THÍ SINH VẮNG",
            "Tổng số": "",
            "Tham gia thi:": "",
            "Vắng thi:": "",
          },
          {
            [string]: "Số thứ tự",
            "Tổng số": "Họ tên",
            "Tham gia thi:": "Cuộc thi",
            "Vắng thi:": "Lớp",
          },
        ];
        for (let i = 0; i < listVangThi.length; i++) {
          let obj = {
            [string]: i + 1,
            "Tổng số": listVangThi[i].__EMPTY_2,
            "Tham gia thi:": listVangThi[i].__EMPTY,
            "Vắng thi:": listVangThi[i].__EMPTY_4,
          };
          returnJson.push(obj);
        }
        var returnTable = [
          {
            a: "Thống kê",
            b: tongSoHocSinh,
            c: thamGiaThi,
            d: vangThi,
          },
        ];
        this.$emit("parsed", returnJson);
        var objTable = {
          returnTable: returnTable,
          title: string,
          saiMau: saiMau,
          listVangThi: listVangThi,
        };
        this.$emit("table", objTable);
      } else {
        saiMau = true;
        let nullObj = [{}];
        this.$emit("parsed", nullObj);
        this.$emit("table", {
          returnTable: returnTable,
          title: "Cuộc thi",
          saiMau: saiMau,
        });
        return false;
      }
    },
  },
  render(h) {
    if (this.$scopedSlots.default && this.loaded) {
      return h("div", [
        this.$scopedSlots.default({
          collection: this.collection,
        }),
      ]);
    }
    return null;
  },
};
</script>
