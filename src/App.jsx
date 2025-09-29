import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import "@/App.scss";

import Menu from "@/Components/Menu";
import RawCode from "./Components/RawCode";
import Previewer from "./Components/Previewer";

function App() {
  const rawCodeRef = useRef(null); // 接收 RawCode 暴露的对象
  const previewerRef = useRef(null); // 接收 Previewer 暴露的对象
  const isSyncing = useRef(false); // 防止循环同步
  const syncScrollIsActive = useSelector(
    (state) => state.currentHeight.isActive
  );

  useEffect(() => {
    const editor = rawCodeRef.current;
    const previewer = previewerRef.current;

    if (!editor || !previewer || !syncScrollIsActive) return;

    const editorScroller = editor.scrollDOM;
    const previewScroller = previewer.scrollDOM;

    const handleEditorScroll = () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      const { scrollTop, scrollHeight, clientHeight } = editorScroller;
      const maxPreviewScroll =
        previewScroller.scrollHeight - previewScroller.clientHeight;
      const scrollRatio =
        scrollHeight > clientHeight
          ? scrollTop / (scrollHeight - clientHeight)
          : 0;

      previewScroller.scrollTop = scrollRatio * maxPreviewScroll;

      setTimeout(() => (isSyncing.current = false), 0);
    };

    const handlePreviewScroll = () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      const { scrollTop, scrollHeight, clientHeight } = previewScroller;
      const maxEditorScroll =
        editorScroller.scrollHeight - editorScroller.clientHeight;
      const scrollRatio =
        scrollHeight > clientHeight
          ? scrollTop / (scrollHeight - clientHeight)
          : 0;

      editorScroller.scrollTop = scrollRatio * maxEditorScroll;

      setTimeout(() => (isSyncing.current = false), 0);
    };

    editorScroller.addEventListener("scroll", handleEditorScroll);
    previewScroller.addEventListener("scroll", handlePreviewScroll);

    return () => {
      editorScroller.removeEventListener("scroll", handleEditorScroll);
      previewScroller.removeEventListener("scroll", handlePreviewScroll);
    };
  }, [syncScrollIsActive]);

  return (
    <div className="app">
      <Menu className="menu" />
      <div className="content">
        <RawCode ref={rawCodeRef} className="raw-code" />
        <Previewer ref={previewerRef} className="previewer" />
      </div>
    </div>
  );
}

export default App;
