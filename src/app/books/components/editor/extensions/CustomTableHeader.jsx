import { mergeAttributes } from "@tiptap/core";
import TableHeader from "@tiptap/extension-table-header";

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      backgroundColor: {
        default: null,
      },

      borderColor: {
        default: null,
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
      "th",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default CustomTableHeader;
