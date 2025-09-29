import { Switch, ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { updateSyncScrollIsActive } from "@/store/modules/currentHeightStore";
import { updateInput } from "@/store/modules/inputStore";
import "./index.scss";
import defaultText from "@/assets/defaultText";

const Menu = () => {
  const dispatch = useDispatch();
  const [syncEnabled, setSyncEnabled] = useState(
    useSelector((state) => state.currentHeight.isActive)
  );

  const newContent = useSelector((state) => state.input.value);

  const onResetClick = () => {
    if (newContent === defaultText) {
      // console.log("No changes to reset");
      return;
    }

    const comfirmed = window.confirm(
      "Are you sure you want to reset? Your changes will be lost."
    );

    if (comfirmed) {
      dispatch(updateInput(defaultText));
      localStorage.setItem("markdown-content", defaultText);
    }
  };

  const onSwitchChange = (checked) => {
    // console.log(`switch to ${checked}`);
    setSyncEnabled(checked);
    dispatch(updateSyncScrollIsActive(checked));
  };

  return (
    <div className="menu">
      <div className="title menu-item">
        <em>Markdown Previewer</em>
      </div>
      <div className="reset menu-item" onClick={onResetClick}>
        Reset
      </div>
      <div
        className="sync-scroll menu-item"
        onClick={() => onSwitchChange(!syncEnabled)}
      >
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Switch checked={syncEnabled} onChange={onSwitchChange} />
        </ConfigProvider>
        <span>Sync Scroll</span>
      </div>
      <a className="github menu-item">
        <img src="src/assets/GitHub-Mark-Light-32px.webp" alt="" />
      </a>
    </div>
  );
};

export default Menu;
