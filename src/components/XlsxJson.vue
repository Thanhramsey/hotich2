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
      if (this.collection.length < 3) {
        let nullObj = [{}];
        saiMau = true;
        this.$emit("parsed", nullObj);
        this.$emit("table", {
          returnTable: returnTable,
          title: "Cuộc thi",
          saiMau: saiMau,
        });
        return false;
      }
      var arrProp = this.collection[3];
      if (
        arrProp["__EMPTY_9"] === "Điểm trung bình cuộc thi" &&
        arrProp["__EMPTY_8"] === "Thiết bị thi mới nhất"
      ) {
        var duoi5 = [];
        var tu5Den65 = [];
        var tu65Den8 = [];
        var tu8Den10 = [];
        console.log(ws);
        console.log(this.collection);
        var duoi5LamTrenMT = 0;
        var tu5Den65LamTrenMT = 0;
        var tu65Den8LamTrenMT = 0;
        var tu8Den10LamTrenMT = 0;
        var duoi5LamTrenDT = 0;
        var tu5Den65LamTrenDT = 0;
        var tu65Den8LamTrenDT = 0;
        var tu8Den10LamTrenDT = 0;
        var duoi5KhongXacDinh = 0;
        var tu5Den65KhongXacDinh = 0;
        var tu65Den8KhongXacDinh = 0;
        var tu8Den10KhongXacDinh = 0;
        for (let i = 4; i < this.collection.length; i++) {
          let item = this.collection[i];
          if (item["__EMPTY_9"] < 5 || item["__EMPTY_9"] == "-") {
            duoi5.push(item);
            if (item["__EMPTY_8"]) {
              if (item["__EMPTY_8"].includes("Desktop")) {
                duoi5LamTrenMT++;
              } else {
                duoi5LamTrenDT++;
              }
            } else {
              duoi5KhongXacDinh++;
            }
          } else if (item["__EMPTY_9"] >= 5 && item["__EMPTY_9"] < 6.5) {
            tu5Den65.push(item);
            if (item["__EMPTY_8"]) {
              if (item["__EMPTY_8"].includes("Desktop")) {
                tu5Den65LamTrenMT++;
              } else {
                tu5Den65LamTrenDT++;
              }
            } else {
              tu5Den65KhongXacDinh++;
            }
          } else if (item["__EMPTY_9"] >= 6.5 && item["__EMPTY_9"] < 8) {
            tu65Den8.push(item);
            if (item["__EMPTY_8"]) {
              if (item["__EMPTY_8"].includes("Desktop")) {
                tu65Den8LamTrenMT++;
              } else {
                tu65Den8LamTrenDT++;
              }
            } else {
              tu65Den8KhongXacDinh++;
            }
          } else if (item["__EMPTY_9"] >= 8 && item["__EMPTY_9"] <= 10) {
            tu8Den10.push(item);
            if (item["__EMPTY_8"]) {
              if (item["__EMPTY_8"].includes("Desktop")) {
                tu8Den10LamTrenMT++;
              } else {
                tu8Den10LamTrenDT++;
              }
            } else {
              tu8Den10KhongXacDinh++;
            }
          }
        }
        var text = this.collection[1];
        var string =
          text["THỐNG KÊ KẾT QUẢ CHI TIẾT HỌC VIÊN THAM GIA CUỘC THI"];
        var returnJson = [
          {
            [string]: "Số thí sinh",
            "Dưới 5:": duoi5.length + " Học sinh",
            "Từ 5 đến 6.5:": tu5Den65.length + " Học sinh",
            "Từ 6.5 đến 8:": tu65Den8.length + " Học sinh",
            "Từ 8 đến 10:": tu8Den10.length + " Học sinh",
            "Tổng:":
              duoi5.length +
              tu65Den8.length +
              tu8Den10.length +
              tu5Den65.length +
              " Học sinh",
          },
          {
            [string]: "Tỉ lệ %",
            "Dưới 5:":
              parseFloat(
                (duoi5.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 5 đến 6.5:":
              parseFloat(
                (tu5Den65.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 6.5 đến 8:":
              parseFloat(
                (tu65Den8.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 8 đến 10:":
              parseFloat(
                (tu8Den10.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Tổng:": "100%",
          },
          {
            [string]: "Làm trên máy tính",
            "Dưới 5:": duoi5LamTrenMT + " Học sinh",
            "Từ 5 đến 6.5:": tu5Den65LamTrenMT + " Học sinh",
            "Từ 6.5 đến 8:": tu65Den8LamTrenMT + " Học sinh",
            "Từ 8 đến 10:": tu8Den10LamTrenMT + " Học sinh",
            "Tổng:":
              duoi5LamTrenMT +
              tu5Den65LamTrenMT +
              tu65Den8LamTrenMT +
              tu8Den10LamTrenMT,
          },
          {
            [string]: "Tỉ lệ Làm trên máy tính",
            "Dưới 5:":
              parseFloat(
                (duoi5LamTrenMT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 5 đến 6.5:":
              parseFloat(
                (tu5Den65LamTrenMT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 6.5 đến 8:":
              parseFloat(
                (tu65Den8LamTrenMT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 8 đến 10:":
              parseFloat(
                (tu8Den10LamTrenMT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Tổng:":
              parseFloat(
                ((duoi5LamTrenMT +
                  tu5Den65LamTrenMT +
                  tu65Den8LamTrenMT +
                  tu8Den10LamTrenMT) /
                  (this.collection.length - 4)) *
                  100
              ).toFixed(2) + "%",
          },
          {
            [string]: "Làm trên điện thoại",
            "Dưới 5:": duoi5LamTrenDT + " Học sinh",
            "Từ 5 đến 6.5:": tu5Den65LamTrenDT + " Học sinh",
            "Từ 6.5 đến 8:": tu65Den8LamTrenDT + " Học sinh",
            "Từ 8 đến 10:": tu8Den10LamTrenDT + " Học sinh",
            "Tổng:":
              duoi5LamTrenDT +
              tu5Den65LamTrenDT +
              tu65Den8LamTrenDT +
              tu8Den10LamTrenDT,
          },
          {
            [string]: "Tỉ lệ Làm trên máy tính",
            "Dưới 5:":
              parseFloat(
                (duoi5LamTrenDT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 5 đến 6.5:":
              parseFloat(
                (tu5Den65LamTrenDT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 6.5 đến 8:":
              parseFloat(
                (tu65Den8LamTrenDT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Từ 8 đến 10:":
              parseFloat(
                (tu8Den10LamTrenDT / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            "Tổng:":
              parseFloat(
                ((duoi5LamTrenDT +
                  tu5Den65LamTrenDT +
                  tu65Den8LamTrenDT +
                  tu8Den10LamTrenDT) /
                  (this.collection.length - 4)) *
                  100
              ).toFixed(2) + "%",
          },
          {
            [string]: "Không xác định thiết bị",
            "Dưới 5:": duoi5KhongXacDinh,
            "Từ 5 đến 6.5:": tu5Den65KhongXacDinh,
            "Từ 6.5 đến 8:": tu65Den8KhongXacDinh,
            "Từ 8 đến 10:": tu8Den10KhongXacDinh,
          },
        ];
        var returnTable = [
          {
            a: "Số học sinh",
            b: duoi5.length + " Học sinh",
            c: tu5Den65.length + " Học sinh",
            d: tu65Den8.length + " Học sinh",
            e: tu8Den10.length + " Học sinh",
            f:
              duoi5.length +
              tu5Den65.length +
              tu65Den8.length +
              tu8Den10.length +
              " Học sinh",
          },
          {
            a: "Tỉ lệ",
            b:
              parseFloat(
                (duoi5.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            c:
              parseFloat(
                (tu5Den65.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            d:
              parseFloat(
                (tu65Den8.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            e:
              parseFloat(
                (tu8Den10.length / (this.collection.length - 4)) * 100
              ).toFixed(2) + "%",
            f: "100%",
          },
          {
            a: "Số lượng làm trên máy tính",
            b: duoi5LamTrenMT + " Học sinh",
            c: tu5Den65LamTrenMT + " Học sinh",
            d: tu65Den8LamTrenMT + " Học sinh",
            e: tu8Den10LamTrenMT + " Học sinh",
            f:
              duoi5LamTrenMT +
              tu5Den65LamTrenMT +
              tu65Den8LamTrenMT +
              tu8Den10LamTrenMT +
              " Học sinh",
          },
          {
            a: "Số lượng làm trên điện thoại",
            b: duoi5LamTrenDT + " Học sinh",
            c: tu5Den65LamTrenDT + " Học sinh",
            d: tu65Den8LamTrenDT + " Học sinh",
            e: tu8Den10LamTrenDT + " Học sinh",
            f:
              duoi5LamTrenDT +
              tu5Den65LamTrenDT +
              tu65Den8LamTrenDT +
              tu8Den10LamTrenDT +
              " Học sinh",
          },
          {
            a: "Số lượng thiết bị không xác định",
            b: duoi5KhongXacDinh,
            c: tu5Den65KhongXacDinh,
            d: tu65Den8KhongXacDinh,
            e: tu8Den10KhongXacDinh,
            f:
              duoi5KhongXacDinh +
              tu5Den65KhongXacDinh +
              tu65Den8KhongXacDinh +
              tu8Den10KhongXacDinh,
          },
        ];
        this.$emit("parsed", returnJson);
        var objTable = {
          returnTable: returnTable,
          title: string,
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
