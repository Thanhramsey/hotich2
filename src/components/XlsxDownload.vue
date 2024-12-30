<script>
export default {
  inject: ["getWorkbook"],
  props: {
    filename: {
      type: String,
      default: "tong_quan_ki_thi.xlsx",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    disableWrapperClick: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    this.load();
  },
  watch: {
    loaded: {
      immediate: true,
      handler(loaded) {
        if (loaded) {
          this.getWorkbook((wb) => {
            this._workbook = wb;
          });
        }
      },
    },
  },
  methods: {
    async load() {
      const { writeFile } = await import("xlsx");
      this._writeFile = writeFile;
      const {
        utils: { json_to_sheet },
      } = await import("xlsx");
      this.json_to_sheet = json_to_sheet;
      this.loaded = true;
    },
    download() {
      const ws = this._workbook.Sheets["Dữ liệu"];
      ws["!cols"] = [
        { width: 60 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
      ];
      this._writeFile(this._workbook, this.filename, this.options);
      this.$emit("done", {});
    },
  },
  render(h) {
    if (this.$scopedSlots.default && this.loaded) {
      return h(
        "div",
        {
          on: {
            click: this.disableWrapperClick ? () => {} : this.download,
          },
        },
        [
          this.$scopedSlots.default({
            download: this.download,
          }),
        ]
      );
    }
    return null;
  },
};
</script>
