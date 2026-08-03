import { mergeAttributes } from "@tiptap/core";
import { TableCell } from "@tiptap/extension-table-cell";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      backgroundColor: {
        default: null,

        parseHTML: (element) => {
          return element.style.backgroundColor || null;
        },

        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color:${attributes.backgroundColor}`,
          };
        },
      },

      borderColor: {
        default: null,

        parseHTML: (element) => {
          return element.style.borderColor || null;
        },

        renderHTML: (attributes) => {
          if (!attributes.borderColor) {
            return {};
          }

          return {
            style: `border-color:${attributes.borderColor}`,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const styles = [];

    if (HTMLAttributes.backgroundColor) {
      styles.push(`background-color:${HTMLAttributes.backgroundColor}`);
      delete HTMLAttributes.backgroundColor;
    }

    if (HTMLAttributes.borderColor) {
      styles.push(`border-color:${HTMLAttributes.borderColor}`);
      delete HTMLAttributes.borderColor;
    }

    if (styles.length) {
      HTMLAttributes.style = styles.join("; ");
    }

    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default CustomTableCell;
