import React from "react";
import cn from "classnames/bind";
import styles from "./Default.module.scss";

const cx = cn.bind(styles);

interface Props {}

export default (props: Props) => {
  return <div className={cx("red")}>Default page</div>;
};
