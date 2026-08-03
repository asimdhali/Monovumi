import { mergeAttributes } from "@tiptap/core";
import TableHeader from "@tiptap/extension-table-header";

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      backgroundColor: {
        default: null,

        parseHTML: (element) => {
          console.log("TD BG =", element.style.backgroundColor);
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
          console.log("TD Border =", element.style.borderColor);
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
      "th",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default CustomTableHeader;
