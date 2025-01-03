import React from "react";
import styles from "./wysiwyg-input.module.scss";

const WYSIWYGInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  return (
    <textarea
      className={styles.wysiwyginput}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default WYSIWYGInput;
