import TableCell from "@tiptap/extension-table-cell";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      backgroundColor: {
        default: null,

        parseHTML: (element) => ({
          backgroundColor: element.style.backgroundColor || null,
        }),

        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color:${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export default CustomTableCell;
